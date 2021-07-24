import React, { useEffect, useState } from "react";
import "./style.scss";
import TextField from "@material-ui/core/TextField";
import { getWalletNumbers } from "../../util/functions";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { storage, firestore } from "../../config/Fire";
import {
  getFirestoreCollections,
  createNewStore,
  createWalletStore,
  sendNotification,
  getRegiobyAgency,
  getUserByAgency,
} from "../../util/fire-functions";
import Button from "@material-ui/core/Button";
import { useAlert } from "../alert/alertContext";
import placeholder from "../../assets/images/placeholder.jpg";

export default function CreateNewStore({ user, handleClose }) {
  const [plans, setPlans] = useState();
  const [categories, setCategories] = useState();
  const [preValues, setPreValues] = useState();
  const [allUsers, setAllUsers] = useState(false);
  const [cashback, setCashback] = useState();
  const [logo, setLogo] = useState(
    user &&
      user.fotosDosDocumentos &&
      user.fotosDosDocumentos.urlImagemDaLogoMarca
      ? user.fotosDosDocumentos.urlImagemDaLogoMarca
      : placeholder
  );
  const [comprovanteState, setComprovanteState] = useState(placeholder);
  const [selectedCategory, setSelectedCategory] = useState();
  const alert = useAlert();

  useEffect(() => {
    (async () => {
      const panos = await getFirestoreCollections("planos");
      const categorias = await getFirestoreCollections("categorias");
      setPlans(panos);
      setCategories(categorias);
    })();
  }, []);

  const submit = async (event) => {
    const {
      plano,
      url,
      cashbackDaLoja,
      categoria,
      logoUrl,
      comprovante,
      order,
    } = event.target.elements;
    try {
      const storageRef = storage.ref();
      if (
        comprovante.value &&
        plano.value &&
        url.value &&
        cashbackDaLoja.value &&
        categoria.value
      ) {
        let logoUpload =
          user &&
          user.fotosDosDocumentos &&
          user.fotosDosDocumentos.urlImagemDaLogoMarca
            ? user.fotosDosDocumentos.urlImagemDaLogoMarca
            : null;
        let comprovanteRef = storageRef.child(
          `usuarios/${user.uid}/termoDeUso.jpg`
        );
        await comprovanteRef.putString(comprovanteState, "data_url");
        const comprovanteUrl = await comprovanteRef.getDownloadURL();

        const agency = await getRegiobyAgency(user.agencia);
        if (logoUrl.value) {
          const logomarca = storageRef.child(
            `usuarios/${user.uid}/logomarca.jpg`
          );
          await logomarca.putString(logo, "data_url");
          logoUpload = await logomarca.getDownloadURL();

          await firestore
            .collection("usuarios")
            .doc(user.uid)
            .update({
              ["fotosDosDocumentos.urlImagemDaLogoMarca"]: logoUpload,
              situacao: "Aprovado",
              possuiCarteira: true,
            });

          const res = await createWalletStore({
            agencia: user.agencia,
            conta: await getWalletNumbers(agency),
            cnpj: user.cnpj,
            idUsuario: user.uid,
            nomeUsuario: user.nome,
            razaoSocial: user.razaoSocial,
            saldoCashback: 0,
            saldoCashbackAcumulado: 0,
            saldoTotalDisponivel: 0,
            temCartaoFisico: "Não solicitado",
            tipoDeUsuario: user.tipoDeUsuario,
            usuario: firestore.collection("usuarios").doc(user.uid),
            cashbackDaLoja: parseInt(cashbackDaLoja.value),
            planoAssociado: plano.value,
            tipoDoPlanoAssociado: preValues.tipo,
            planoAssociadoDinheiroParaDistribuir:
              preValues.dinheiroParaDistribuir,
            planoAssociadoMaximoCashbackUsuario: preValues.cashbackAte,
          });
          await createNewStore({
            ["urlImagemDaLogoMarca"]: logoUpload,
            nomeDaLoja: user.razaoSocial,
            agencia: user.agencia,
            planoAssociado: preValues,
            usuario: firestore.collection("usuarios").doc(user.uid),
            cepEmpresa: user.cepEmpresa,
            cashbackDaLoja: parseFloat(cashbackDaLoja.value),
            url: url.value,
            categoria: selectedCategory,
            carteiraDigital: res,
            ordem: parseInt(order.value) || "none",
          });
        } else {
          await firestore.collection("usuarios").doc(user.uid).update({
            situacao: "Aprovado",
            possuiCarteira: true,
          });
          const res = await createWalletStore({
            agencia: user.agencia,
            conta: await getWalletNumbers(agency),
            cnpj: user.cnpj,
            idUsuario: user.uid,
            nomeUsuario: user.nome,
            razaoSocial: user.razaoSocial,
            saldoCashback: 0,
            saldoCashbackAcumulado: 0,
            saldoTotalDisponivel: 0,
            temCartaoFisico: "Não solicitado",
            tipoDeUsuario: user.tipoDeUsuario,
            usuario: firestore.collection("usuarios").doc(user.uid),
            cashbackDaLoja: parseFloat(cashbackDaLoja.value),
            planoAssociado: plano.value,
            tipoDoPlanoAssociado: preValues.tipo,
            planoAssociadoDinheiroParaDistribuir:
              preValues.dinheiroParaDistribuir,
            planoAssociadoMaximoCashbackUsuario: preValues.cashbackAte,
          });
          await createNewStore({
            ["urlImagemDaLogoMarca"]: logoUpload,
            urlComprovanteDoTermoDeUso: comprovanteUrl,
            nomeDaLoja: user.razaoSocial,
            agencia: user.agencia,
            planoAssociado: preValues,
            usuario: firestore.collection("usuarios").doc(user.uid),
            cepEmpresa: user.cepEmpresa,
            cashbackDaLoja: parseFloat(cashbackDaLoja.value),
            url: url.value,
            categoria: selectedCategory,
            carteiraDigital: res,
            ordem: parseInt(order.value) || "none",
          });
        }
        if (allUsers) {
          const usersFilter = await getUserByAgency(user.agencia);
          const reqs = [];
          usersFilter.forEach(async (item) => {
            reqs.push(
              sendNotification(
                `A loja ${user.razaoSocial} já está disponível para compras no Aplicativo`,
                item.id,
                "Nova Loja na sua Região!"
              )
            );
          });
          await Promise.all(reqs);
        }

        await sendNotification(
          "Sua Loja foi criada com sucesso",
          user.uid,
          "Loja Criada"
        );
        alert.setOptions({
          open: true,
          message: "Loja criada com sucesso",
          type: "success",
          time: 2000,
        });
        handleClose();
      } else {
        alert.setOptions({
          open: true,
          message: "Preencha todos os campos corretamente",
          type: "error",
          time: 15000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="new-store">
      <h2>Nova Loja</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(e);
        }}
      >
        <div className="photos">
          <label className="logo-loja">
            <div className="img-wrapper">
              <img src={logo} />
            </div>
            <input
              hidden
              name="logoUrl"
              type="file"
              onChange={(e) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                  setLogo(reader.result);
                };
                if (e.target.files[0]) {
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
            <small>Click para enviar uma nova logo</small>
          </label>
          <label className="logo-loja">
            <div className="img-wrapper">
              <img src={comprovanteState || placeholder} />{" "}
            </div>
            <input
              hidden
              name="comprovante"
              type="file"
              onChange={(e) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                  setComprovanteState(reader.result);
                };
                if (e.target.files[0]) {
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
            <small>
              clique para carregar a foto do comprovante de termos de uso
            </small>
          </label>
        </div>

        <Autocomplete
          options={plans}
          getOptionLabel={(option) => {
            return `${option.tipo}`;
          }}
          name="plano"
          id="plano"
          onChange={(event, newValue) => {
            setCashback(newValue.cashbackDaLojaPadrao);
            setPreValues(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecione o Plano"
              margin="normal"
              variant="outlined"
            />
          )}
        />

        <TextField
          id="cashbackDaLoja"
          name="cashbackDaLoja"
          type="number"
          value={parseFloat(cashback)}
          InputProps={{
            inputProps: {
              min: 0.1,
              step: "0.1",
              max:
                preValues && preValues.cashbackAte ? preValues.cashbackAte : 50,
            },
          }}
          variant="outlined"
          onInput={(e) => {
            if (
              preValues &&
              preValues.cashbackAte &&
              e.target.value <= preValues.cashbackAte
            ) {
              setCashback(e.target.value);
            }
          }}
          label="Cashback da Loja"
        />
        <TextField
          id="url"
          name="url"
          variant="outlined"
          onInput={(e) => {}}
          label="Link da loja"
        />
        <Autocomplete
          options={categories}
          getOptionLabel={(option) => {
            return `${option.tipo}`;
          }}
          name="categoria"
          id="categoria"
          onChange={(event, newValue) => {
            setSelectedCategory(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecione a categoria"
              margin="normal"
              variant="outlined"
            />
          )}
        />
        <TextField id="order" name="order" variant="outlined" label="Ordem" />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={allUsers}
              color="primary"
              label="Enviar Notificões para todos os usuários dessa região"
              onChange={() => {
                setAllUsers((prev) => !prev);
              }}
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          }
          label="Enviar para todos"
        />

        <Button
          type="button"
          onClick={() => handleClose()}
          className="submit-cancel"
        >
          Cancelar
        </Button>
        <Button type="submit" className="submit-button">
          Criar
        </Button>
      </form>
    </div>
  );
}