import React, { useState } from "react";
import "./styled.scss";
import { Container, Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { MoneyFormat, priceFormat } from "../../util/functions";
import { getUserByIdplug, getWalletById } from "../../util/fire-functions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import { useAlert } from "../../components/alert/alertContext";
import { functions } from "../../config/Fire";

const QrCodePlug = () => {
  const user = JSON.parse(window.localStorage.getItem("@plugpixweb/authData"));
  const [open, setOpen] = useState(false);
  const [valor, setValor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagador, setPagador] = useState(null);
  const alert = useAlert();
  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
  };

  const submit = async (e) => {
    const { idplug, description } = e.target.elements;

    try {
      // const callable = functions.httpsCallable("enviar_boleto");
      // const { data } = await callable({
      //   email: "novaiscortesgabriel729@gmail.com",
      // });
      if (valor && idplug.value) {
        setLoading(true);
        const user = await getUserByIdplug(idplug.value);
        if (!user) {
          alert.setOptions({
            open: true,
            message: "Erro ao buscar usuário com esse IDPLUG",
            type: "error",
            time: 3000,
          });
          setLoading(false);
        } else {
          try {
            const callable = functions.httpsCallable(
              "pix-gerarcobrancapixinterno"
            );
            const { data } = await callable({
              valor: parseFloat(valor),
              descricao: description.value || "",
              devedor: {
                idPlug: idplug.value,
                cpf:
                  user[0].tipoDeUsuario === "Pessoa Física"
                    ? user[0].cpf
                    : user[0].cnpj,
                nome:
                  user[0].tipoDeUsuario === "Pessoa Física"
                    ? user[0].nome
                    : user[0].razaoSocial,
              },
            });
            const wallet = await getWalletById(user[0].id);
            setPagador({ ...user[0], ...wallet, qrcode: data });

            setOpen(true);
            setLoading(false);
          } catch (error) {
            console.error(error);
            alert.setOptions({
              open: true,
              message: error.message,
              type: "error",
              time: 3000,
            });
          }
          setLoading(false);
        }
      } else {
        setLoading(false);
        alert.setOptions({
          open: true,
          message: "Necessário preencher todos os campos obrigatórios!",
          type: "error",
          time: 3000,
        });
      }
    } catch (error) {
      alert.setOptions({
        open: true,
        message: error,
        type: "error",
        time: 3000,
      });
    }
  };
  const generateCode = (data) => {
    history.push({ state: { data }, pathname: "/paymentplugpix" });
  };

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <Row className="justify-content-center mt-5">
            <Col xs={4}>
              <div className="menu-button">
                <span>QR CODE PIX</span>
                <form
                  onSubmit={(e) => {
                    submit(e);
                    e.preventDefault();
                  }}
                  className="form-pix"
                >
                  <label>
                    Informe o valor a Receber
                    <MoneyFormat
                      required={true}
                      name="value"
                      className="big-price"
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          if (e.target.value > 0) {
                            setValor(e.target.value);
                          }
                        } else {
                          setValor(e.target.value);
                        }
                      }}
                      value={valor}
                    />
                  </label>
                  <label>
                    IDPLUG de quem está pagando (Obrigatório)
                    <input type="text" name="idplug" required />
                  </label>
                  <label>
                    Descrição (Opcional)
                    <input type="text" name="description" />
                  </label>
                  <button type="submit">
                    {loading ? (
                      <div className="spinner">
                        <CircularProgress />
                      </div>
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="comprovante">
          <h2>Confirme os dados</h2>
          <hr />
          {pagador && (
            <div className="mt-3 mb-2">
              <div>
                <b>
                  <div>Pagante</div>
                </b>
                <div>{pagador.nome}</div> <div>IDPlug:{pagador.idPlug}</div>
              </div>
            </div>
          )}
          <hr className="mt-4" />
          {user && (
            <div className="my-2">
              <div className="d-flex flex-column">
                <b>
                  <div>Favorecido</div>
                </b>
                <div>{user.nome || user.razaoSocial}</div>
              </div>
              <div>CNPJ: {user.cnpj}</div>
            </div>
          )}
          <hr />
          <div className="mt-1 d-flex justify-content-center flex-column align-items-center">
            VALOR A PAGAR
            <span className="big-price">{priceFormat(valor)}</span>
          </div>
          <div className="d-flex justify-content-center">
            <button
              type="button"
              onClick={() => generateCode(pagador.qrcode.data)}
            >
              Gerar QR CODE
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default QrCodePlug;
