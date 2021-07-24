import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { getPjUnset } from "../../util/fire-functions";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "./style.scss";
import { firestore } from "../../config/Fire";
import { maskInput } from "../../util/functions";
import country from "../../util/estados_cidades.json";
import Button from "@material-ui/core/Button";
import {
  createNewAgency,
  updateAgency,
  getRegiobyAgency,
  setNewCollectionDoc,
} from "../../util/fire-functions";
import { useAlert } from "../alert/alertContext";

const CreateNewAgency = (props) => {
  const [cidades, setCidades] = useState();
  const [agency, setAgency] = useState(
    props.agency ? props.agency.agencia : null
  );
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedCities, setSelectedCities] = useState();
  const [cidadesUsadas, setCidadesUsadas] = useState([]);
  const alert = useAlert();

  const getIndexCity = (cidades) => {
    if (cidades) {
      const preValues = Object.keys(cidades).map((item) => {
        const city = item.split(" - ")[0];
        const state = item.split(" - ")[1];
        return { cidade: city, estado: state };
      });
      return preValues;
    }
    return [];
  };
  const citiesUsed = (agencias) => {
    let arr = [];
    agencias.forEach((item) => {
      arr = arr.concat(getIndexCity(item.cidades));
    });
    setCidadesUsadas(arr);
  };
  useEffect(() => {
    const cities = [];
    country.estados.forEach((item) => {
      item.cidades.forEach((city) =>
        cities.push({ cidade: city, estado: item.sigla })
      );
    });
    setCidades(cities);
    (async () => {
      if (props.agency) {
        const usersData = await getPjUnset(props.agency.agencia);
        setUsers(usersData || []);
      }
    })();
    citiesUsed(props.allAgencies);
  }, []);
  console.log(getIndexCity(props.agency));
  const submit = async (event) => {
    const { agencia, user } = event.target.elements;

    try {
      const controlAgency = await getRegiobyAgency(agencia.value);
      if (props.agency) {
        await updateAgency(props.agency.id, {
          agencia: agencia.value,
          cidades: selectedCities || props.agency.cidades,
        });
        if (user.value && selectedUser) {
          await firestore
            .collection("usuarios")
            .doc(props.agency.gerenteDados.id)
            .update({
              tipoDeUsuario: "Pessoa Jurídica",
              situacao: "Em análise",
            });

          const walletData = {
            agencia: props.agency.agencia,
            conta: "10000000",
            cnpj: selectedUser.cnpj,
            idUsuario: selectedUser.id,
            nomeUsuario: selectedUser.nome,
            razaoSocial: selectedUser.razaoSocial,
            saldoCashback: 0,
            saldoCashbackAcumulado: 0,
            saldoTotalDisponivel: 0,
            temCartaoFisico: "Não solicitado",
            tipoDeUsuario: "Gerente Regional",
            usuario: firestore.collection("usuarios").doc(selectedUser.id),
          };

          await firestore.collection("usuarios").doc(selectedUser.id).update({
            agencia: props.agency.agencia,
            tipoDeUsuario: "Gerente Regional",
            situacao: "Aprovado",
          });
          await setNewCollectionDoc(
            "carteirasDigitais",
            walletData,
            selectedUser.id
          );

          await firestore
            .collection("regioes")
            .doc(props.agency.id)
            .update({
              temGerenteAssociado: true,
              docGerenteAssociado: firestore
                .collection("usuarios")
                .doc(selectedUser.id),
              gerenteDados: { ...selectedUser, agencia: props.agency.agencia },
            });
        }
        alert.setOptions({
          open: true,
          message: "Agência alterada com sucesso",
          type: "success",
          time: 2000,
        });
        props.setOpen(false);
      } else if (
        selectedCities &&
        !controlAgency &&
        agencia.value.length === 4 &&
        !props.agency
      ) {
        await createNewAgency({
          agencia: agencia.value,
          carteiraAtual: 10000000,
          cidades: selectedCities,
          temGerenteAssociado: false,
        });

        alert.setOptions({
          open: true,
          message: "Nova agência adicionada com sucesso",
          type: "success",
          time: 2000,
        });
        props.setOpen(false);
      } else if (controlAgency) {
        alert.setOptions({
          open: true,
          message:
            "Já existe uma agência com esse código. Por favor digite outro código valido",
          type: "error",
          time: 15000,
        });
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
    <div className="new-store modal-container">
      <h2>{props.agency ? "Editar Agência" : "Nova Agência"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(e);
        }}
      >
        <TextField
          id="agencia"
          name="agencia"
          variant="outlined"
          value={agency}
          defaultValue={
            props.agency && props.agency && props.agency.agencia
              ? props.agency.agencia
              : agency
          }
          onInput={(e) => {
            setAgency(maskInput({ type: "agencia", value: e.target.value }));
          }}
          label="Código da agência"
        />
        {cidades && cidades.length && (
          <Autocomplete
            multiple
            options={cidades}
            getOptionLabel={(option) => {
              return `${option.cidade} - ${option.estado}`;
            }}
            getOptionDisabled={(option) => {
              return !!cidadesUsadas.find((el) => el.cidade === option.cidade);
            }}
            name="cidades"
            id="cidades"
            // disabled={props.agency ? true : false}
            defaultValue={getIndexCity(props.agency.cidades)}
            onChange={(event, newValue) => {
              let obj = {};
              newValue.forEach((item) => {
                obj = {
                  ...obj,
                  ...{ [`${item.cidade} - ${item.estado}`]: true },
                };
              });
              setSelectedCities(obj);
            }}
            // getOptionSelected={(option, { multiple, value }) => {
            //   if (!multiple) {
            //     return option.value === value;
            //   }
            //   return false;
            // }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cidades"
                margin="normal"
                variant="outlined"
              />
            )}
          />
        )}
        {props.agency && (
          <Autocomplete
            options={users}
            getOptionLabel={(option) => {
              return `${option.nome}  -  ${option.cnpj}  -  ${option.razaoSocial}`;
            }}
            name="user"
            id="user"
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
            defaultValue={props.agency.gerenteDados}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Usuários"
                margin="normal"
                variant="outlined"
              />
            )}
          />
        )}
        <Button
          type="button"
          onClick={() => props.setOpen(false)}
          className="submit-cancel"
        >
          Cancelar
        </Button>
        <Button type="submit" className="submit-button">
          {props.agency ? "Salvar Alterações" : "Criar"}
        </Button>
      </form>
    </div>
  );
};
export default CreateNewAgency;
