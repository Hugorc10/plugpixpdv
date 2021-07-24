import React, { useState, useEffect } from "react";
import "./styled.scss";
import { Container, Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { MoneyFormat, priceFormat, sendMail } from "../../util/functions";
import Modal from "@material-ui/core/Modal";
import { useAlert } from "../../components/alert/alertContext";
import { functions } from "../../config/Fire";
import FormGroup from "@material-ui/core/FormGroup";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getBillets } from "../../util/fire-functions";
import moment from "moment";
import axios from "axios";
import fileDownload from "js-file-download";

const Boleto = () => {
  const user = JSON.parse(window.localStorage.getItem("@plugpixweb/authData"));
  const [open, setOpen] = useState(false);
  const [openBillets, setOpenBillets] = useState(false);
  const [valor, setValor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBilletAction, setLoadingBilletAction] = useState(false);
  const [loadingBilletDownload, setLoadingBilletDownload] = useState(false);
  const [loadingAllBilletAction, setLoadingAllBilletAction] = useState(false);
  const [loadingAllBilletDownload, setLoadingAllBilletDownload] = useState(
    false
  );
  const [pagador, setPagador] = useState(null);
  const [switchButton, setSwitch] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [billets, setBillets] = useState(null);

  const alert = useAlert();

  useEffect(() => {
    (async () => {
      const respBillets = await getBillets();
      setBillets(respBillets);
      console.log(respBillets);
    })();
  }, [loading]);
  const submit = async (e) => {
    const {
      nome,
      descricao,
      money,
      email,
      cpf,
      idplug,
      juros,
      multa,
    } = e.target.elements;
    if (
      nome.value &&
      descricao.value &&
      money.value &&
      email.value &&
      cpf.value &&
      switchButton
    ) {
      setLoading(true);
      if (switchButton !== "oneTime" && quantity) {
        setPagador({
          nome: nome.value,
          cpf: cpf.value,
          email: email.value,
          idPlug: idplug.value,
          descricao: descricao.value,
          juros: juros?.value || null,
          multa: multa?.value || null,
        });
        setOpen(true);
      } else if (switchButton === "oneTime") {
        setPagador({
          nome: nome.value,
          cpf: cpf.value,
          email: email.value,
          idPlug: idplug.value,
        });
        setOpen(true);
      } else {
        alert.setOptions({
          open: true,
          message: "Defina a quantidade de Boletos!",
          type: "error",
          time: 3000,
        });
      }
      setLoading(false);
    } else {
      setLoading(false);
      alert.setOptions({
        open: true,
        message: "Necessário preencher todos os campos obrigatórios!",
        type: "error",
        time: 3000,
      });
    }
  };
  const generateBillets = async () => {
    try {
      setLoading(true);
      const callable = functions.httpsCallable(
        "depositos-emitirboletosrecorrentes"
      );
      const { data } = await callable({
        valor: parseFloat(valor),
        jurosAtraso: parseFloat(pagador.juros) || null,
        multaAtraso: parseFloat(pagador.multa) || null,
        quantidade: parseFloat(quantity) || 1,
        intervaloDias: (() => {
          switch (switchButton) {
            case "oneTime":
              return 1;
            case "sevenDays":
              return 7;
            case "fiveteenDays":
              return 15;
            case "thirtyDays":
              return 30;
            default:
              return 1;
          }
        })(),
        descricao: pagador.descricao,
        devedor: {
          nome: pagador.nome,
          email: pagador.email,
          cpf: pagador.cpf,
          idPlug: pagador.idPlug || null,
        },
      });
      setOpenBillets({ boletos: data.data });
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("ERRO ao gerar boletos", error);
    }
  };

  const getStatus = (billet) => {
    if (billet.state === "SETTLED") {
      return "Compensado";
    } else if (moment().isSameOrBefore(billet.dueDate)) {
      return "Em Aberto";
    } else {
      return "Vencido";
    }
  };
  const downloadBillet = async (billet, index, total) => {
    try {
      setLoadingBilletDownload(index);
      const params = {
        download: true,
        template: "qrBillet",
        agency: "---",
        idPlug: billet.debtor.idPlug || "---",
        account: "---",
        txId: billet.debtor.taxId,
        ...billet,
        email: billet.debtor.email,
        debtor: {
          ...billet.debtor,
          identify: billet.debtor.cpf || billet.debtor.cnpj,
          name: billet.debtor.nome,
          address: {
            city: "",
            neighborhood: "",
            state: "",
            street: "",
            zipCode: "",
          },
        },
        qrCode: billet.qrCode,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_FUNCTIONS}/enviar_boleto`,
        {
          data: params,
        },
        {
          responseType: "arraybuffer", // responseType,
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          },
        }
      );
      fileDownload(
        response.data,
        `${billet.debtor.nome} - Parcelamento (BOLETO ${index} de ${total}).pdf`
      );
      alert.setOptions({
        open: true,
        message: "Download Realizado com Sucesso!",
        type: "success",
        time: 3000,
      });
      setLoadingBilletDownload(false);
    } catch (error) {
      console.error(error);
      setLoadingBilletDownload(false);
    }
  };
  const actionAllBillets = async (type, billetsList) => {
    const fetch = type === "download" ? downloadBillet : sendEmail;
    const loadingByType =
      type === "download"
        ? setLoadingAllBilletDownload
        : setLoadingAllBilletAction;
    try {
      loadingByType(true);
      const reqs = billetsList.map((item, i) => {
        return fetch(item, i + 1, billetsList.length);
      });
      await Promise.all(reqs);
      loadingByType(false);
    } catch (error) {
      console.error(error);
      loadingByType(false);
    }
  };
  const sendEmail = async (billet, index, total) => {
    try {
      setLoadingBilletAction(index);
      const params = {
        template: "qrBillet",
        subject: `Parcelamento com boleto(BOLETO ${index} de ${total}) `,
        agency: "---",
        idPlug: billet.debtor.idPlug || "---",
        account: "---",
        txId: billet.debtor.taxId,
        ...billet,
        email: billet.debtor.email,
        debtor: {
          ...billet.debtor,
          identify: billet.debtor.cpf || billet.debtor.cnpj,
          name: billet.debtor.nome,
          address: {
            city: "",
            neighborhood: "",
            state: "",
            street: "",
            zipCode: "",
          },
        },
        qrCode: billet.qrCode,
      };
      await axios.post(`${process.env.REACT_APP_FUNCTIONS}/enviar_boleto`, {
        data: params,
      });
      alert.setOptions({
        open: true,
        message: "Enviado para Email do Cliente!",
        type: "success",
        time: 3000,
      });
      setLoadingBilletAction(false);
    } catch (error) {
      console.error(error);
      setLoadingBilletAction(false);
    }
  };
  return (
    <Container className="boleto-page">
      <Row>
        <Col xs={12}>
          <Row className="justify-content-center mt-5">
            <Col xs={8}>
              <div className="menu-button-boleto">
                <span className="title">Nova Cobrança</span>
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
                      name="money"
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
                  <Row>
                    <Col lg={6}>
                      <label>
                        Nome de quem será cobrado*
                        <input type="text" name="nome" required />
                      </label>
                    </Col>
                    <Col lg={6}>
                      <label>
                        E-mail de quem será cobrado*
                        <input type="email" name="email" required />
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <label>
                        CPF*
                        <input type="text" name="cpf" required />
                      </label>
                    </Col>
                    <Col lg={6}>
                      <label>
                        Descrição breve do serviço ou produto
                        <input type="text" name="descricao" required />
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <label>
                        IDPLUG (Se for cliente PlugPix)
                        <input type="text" name="idplug" />
                      </label>
                    </Col>
                    {/* <Col lg={4}>
                      <label>
                        Data de vencimento
                        <input type="text" name="idplug" required />
                      </label>
                    </Col> */}
                    <Col lg={3}>
                      <label className="d-flex">
                        Juros atraso (%)
                        <input type="number" step="0.1" name="juros" />
                      </label>
                    </Col>
                    <Col lg={3}>
                      <label>
                        Multa atraso (R$)
                        <input type="number" step="0.1" name="multa" />
                      </label>
                    </Col>
                  </Row>
                  <label>Informe a frequêcia da conbrança*</label>
                  <Row>
                    <Col xs={6}>
                      <FormGroup>
                        <label htmlFor="oneTime" className="switch-frequency">
                          <input
                            type="checkbox"
                            hidden
                            id="oneTime"
                            name="frequency"
                            value="oneTime"
                            checked={switchButton === "oneTime"}
                            onChange={(e) => {
                              !e.target.checked
                                ? setSwitch(null)
                                : setSwitch(e.target.value);
                            }}
                          />
                          <div className="switch" />
                          Uma vez
                        </label>

                        <label htmlFor="sevenDays" className="switch-frequency">
                          <input
                            type="number"
                            min="0"
                            value={switchButton === "sevenDays" ? quantity : 0}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                          <input
                            type="checkbox"
                            hidden
                            id="sevenDays"
                            name="frequency"
                            value="sevenDays"
                            checked={switchButton === "sevenDays"}
                            onChange={(e) => {
                              !e.target.checked
                                ? setSwitch(null)
                                : setSwitch(e.target.value);
                            }}
                          />
                          <div className="switch" />
                          Semanal(a cada 7 dias)
                        </label>
                      </FormGroup>
                    </Col>

                    <Col xs={6}>
                      <label
                        htmlFor="fiveteenDays"
                        className="switch-frequency"
                      >
                        <input
                          type="number"
                          min="0"
                          value={switchButton === "fiveteenDays" ? quantity : 0}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                        <input
                          type="checkbox"
                          hidden
                          id="fiveteenDays"
                          name="frequency"
                          value="fiveteenDays"
                          checked={switchButton === "fiveteenDays"}
                          onChange={(e) => {
                            !e.target.checked
                              ? setSwitch(null)
                              : setSwitch(e.target.value);
                          }}
                        />
                        <div className="switch" />
                        Quinzenal (a cada 15 dias)
                      </label>

                      <label htmlFor="thirtyDays" className="switch-frequency">
                        <input
                          type="number"
                          min="0"
                          value={switchButton === "thirtyDays" ? quantity : 0}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                        <input
                          type="checkbox"
                          hidden
                          id="thirtyDays"
                          name="frequency"
                          value="thirtyDays"
                          checked={switchButton === "thirtyDays"}
                          onChange={(e) => {
                            !e.target.checked
                              ? setSwitch(null)
                              : setSwitch(e.target.value);
                          }}
                        />
                        <div className="switch" />
                        Mensal(a cada 30 dias)
                      </label>
                    </Col>
                  </Row>

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
        <Col xs={12} className="mt-3">
          <h1>Cobranças geradas</h1>
          {billets && billets.length ? (
            <ul className="boletos-list">
              {billets.map((billet) => {
                return (
                  <li
                    key={billet.id}
                    className="boleto-item"
                    onClick={() => {
                      // setBillet({ wallet: myWalletData, user: user, billet });

                      setOpenBillets(billet);
                    }}
                  >
                    <div>
                      Devedor
                      <small>{billet.boletos[0].debtor.nome}</small>
                    </div>

                    {billet.intervaloDias && (
                      <div>
                        Periódo de cobrança
                        <small>{billet.intervaloDias} Dias</small>
                      </div>
                    )}

                    <div>
                      Descrição
                      {billet.descricao && (
                        <small class="description">{billet.descricao}</small>
                      )}
                    </div>

                    <div>
                      Quantidade de boletos gerados
                      <small>{billet.boletos.length} vezes</small>
                    </div>
                    <div>
                      Valor
                      <small>{priceFormat(billet.boletos[0].value)}</small>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div></div>
          )}
        </Col>
      </Row>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
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
                  <div>Titular</div>
                </b>
                <div>{pagador.nome}</div>
              </div>
              {pagador.idPlug && <div>IDPlug:{pagador.idPlug}</div>}
              <div>CPF:{pagador.cpf}</div>
              <div>E-mail:{pagador.email}</div>
            </div>
          )}
          <hr className="mt-4" />
          <div className="my-2">
            <div className="d-flex flex-column">
              <b>
                <div>Favorecido</div>
              </b>
              <div>{user.razaoSocial}</div>
            </div>
            <div>CNPJ: {user.cnpj}</div>
          </div>
          {switchButton !== "oneTime" && (
            <>
              <hr />
              <div className="my-2">
                <div className="d-flex flex-column">
                  <b>
                    <div>Recorrência</div>
                  </b>
                  <div>
                    {(() => {
                      switch (switchButton) {
                        case "oneTime":
                          return "Uma vez";
                        case "sevenDays":
                          return "Sete Dias";
                        case "fiveteenDays":
                          return "Quinzenal";
                        case "thirtyDays":
                          return "Mensal";
                        default:
                          return "Nenhuma";
                      }
                    })()}
                  </div>
                </div>
                <div>Quantidade de boletos: {quantity}</div>
              </div>
            </>
          )}
          <hr />
          <div className="mt-1 d-flex justify-content-center flex-column align-items-center">
            VALOR A PAGAR
            <span className="big-price">{priceFormat(valor)}</span>
          </div>
          <div className="d-flex justify-content-center">
            <button type="button" onClick={() => generateBillets()}>
              {loading ? (
                <div className="spinner">
                  <CircularProgress />
                </div>
              ) : (
                "Gerar QR CODE"
              )}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={!!openBillets}
        onClose={() => {
          setOpenBillets(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="list-billet">
          <h2>Boletos gerados</h2>
          {openBillets && openBillets.boletos?.length && (
            <div className="mt-3 mb-2">
              <div>
                <ul className="boletos-list">
                  {openBillets.boletos.map((billet, i) => {
                    return (
                      <li key={billet.id} className="boleto-item">
                        <label className={`${getStatus(billet)}`}>
                          {getStatus(billet)}
                        </label>
                        <div>
                          Devedor
                          <small>{billet.debtor.name}</small>
                        </div>
                        <div>
                          Vencimento <br />
                          {moment(billet.dueDate).format("DD/MM/YYYY")}
                        </div>
                        <div>
                          Ordem do Boleto
                          <small>
                            {`${
                              openBillets.boletos.length === 1
                                ? "Único boleto"
                                : i + 1 + "º"
                            }`}{" "}
                            Boleto
                          </small>
                        </div>
                        <div>
                          Valor
                          <small>{priceFormat(billet.value)}</small>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              sendEmail(
                                billet,
                                i + 1,
                                openBillets.boletos.length
                              );
                            }}
                            type="button"
                          >
                            {loadingBilletAction === i + 1 &&
                            !loadingAllBilletAction ? (
                              <div className="spinner">
                                <CircularProgress />
                              </div>
                            ) : (
                              "Enviar Boleto"
                            )}
                          </button>
                          <button
                            onClick={() => {
                              downloadBillet(
                                billet,
                                i + 1,
                                openBillets.boletos.length
                              );
                            }}
                            className="mt-2"
                            type="button"
                          >
                            {loadingBilletDownload === i + 1 &&
                            !loadingAllBilletDownload ? (
                              <div className="spinner">
                                <CircularProgress />
                              </div>
                            ) : (
                              "Baixar Boleto"
                            )}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/* {pagador.idPlug && <div>IDPlug:{pagador.idPlug}</div>}
                <div>CPF:{pagador.cpf}</div>
                <div>E-mail:{pagador.email}</div> */}
            </div>
          )}

          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="mr-3"
              onClick={() => {
                actionAllBillets("email", openBillets.boletos);
              }}
            >
              {!!loadingAllBilletAction === true ? (
                <div className="spinner">
                  <CircularProgress />
                </div>
              ) : (
                "Enviar todos os boletos"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                actionAllBillets("download", openBillets.boletos);
              }}
            >
              {!!loadingAllBilletDownload === true ? (
                <div className="spinner">
                  <CircularProgress />
                </div>
              ) : (
                "Baixar todos os boletos"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default Boleto;
