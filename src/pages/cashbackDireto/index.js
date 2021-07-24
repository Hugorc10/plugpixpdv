import React, { useEffect, useState } from "react";
import { Container, Col } from "reactstrap";
import { Background } from "./styled";
import { getWallet, userData, getStoreCompleted, getUserByIdplug, getWalletByUid } from "../../util/fire-functions";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";
import { MoneyFormat } from "../../util/functions";
import { useAlert } from "../../components/alert/alertContext";
import { functions } from "../../config/Fire";
import TextField from "@material-ui/core/TextField";

function CashbackDireto() {
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState({ value: 0 });
  const [loadingButton, setLoadingButton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [walletTranfer, setWalletTransfer] = useState(null);
  const [myWalletData, setMyWalletData] = useState(null);
  const [storesList, setStoresList] = useState(null);
  const [plugId, setPlugId] = useState(null);
  const [user, setUser] = useState(null);
  const history = useHistory();
  const alert = useAlert();

  useEffect(() => {
    (async () => {
      const myWallet = await getWallet();
      const userTemp = await userData();
      const stores = await getStoreCompleted();
      const userPromise = stores.map((item) => item.usuario.get());
      const userResult = await Promise.all(userPromise);
      // userResult.forEach(item => console.log('-----',item.data()))
      setStoresList(stores.map((item, i) => ({ ...item, user: userResult[i].data() })));
      setUser(userTemp);
      setMyWalletData(myWallet);
      window.scrollTo(0, 0);
    })();
  }, []);

  const submit = async () => {
    if (payment.value > 0 && myWalletData.saldoTotalDisponivel >= payment.value) {
      try {
        setLoadingButton(true);
        const getUserByIdPlug = await getUserByIdplug(plugId);
        setWalletTransfer(getUserByIdPlug[0]);
        let res;
        if (getUserByIdPlug) {
          const wallet = await getWalletByUid(getUserByIdPlug[0].id);
          console.log(getUserByIdPlug);
          const callable = functions.httpsCallable("pagamentos-transferir");
          res = await callable({
            idFavorecido: wallet.id,
            value: payment.value,
            descricao: payment.description || "",
            tipoDeTransacao: "pagamento",
          });
        } else {
          alert.setOptions({
            open: true,
            message: "Usuário não encontrado",
            type: "error",
            time: 3000,
          });
        }
        setLoadingButton(false);
        if (res && res.error) {
          alert.setOptions({
            open: true,
            message: res.error,
            type: "error",
            time: 3000,
          });
        } else if (res && !res.error) {
          alert.setOptions({
            open: true,
            message: "Pagamento Realizado com Sucesso",
            type: "success",
            time: 5000,
          });
          setOpenModal(res);
          setLoadingButton(false);
          history.push("/");
        }
      } catch (error) {
        setLoadingButton(false);
        console.error(">>>", error);
        alert.setOptions({
          open: true,
          message: error.message,
          type: "error",
          time: 3000,
        });
      }
    } else if (myWalletData.saldoTotalDisponivel < walletTranfer?.valor) {
      alert.setOptions({
        open: true,
        message: "Saldo insuficiente!",
        type: "error",
        time: 3000,
      });
    } else {
      alert.setOptions({
        open: true,
        message: "Valor deve ser maior que 0 Reais",
        type: "error",
        time: 3000,
      });
    }
  };

  // const Header = () => {
  //   return (
  //     <HeaderStyle>
  //       <HeaderDefault title="">
  //         <div className="title-logo">{/* <img className="img-fluid" src={logoGreen} alt="cashback" /> */}</div>
  //       </HeaderDefault>
  //       <HeaderStyled className="header">
  //         <div className="saldo">
  //           <small className="saldo-label m-0">Saldo Total disponível</small>
  //           <div className="price d-flex">
  //             <p>R$</p>
  //             <div className="saldoValue">{priceFormat(myWalletData ? myWalletData.saldoTotalDisponivel : 0).substr(2)}</div>
  //           </div>
  //         </div>
  //       </HeaderStyled>
  //     </HeaderStyle>
  //   );
  // };

  return (
    <Background>
      {loading ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          (
          <Container className="d-flex justify-content-center">
            <Col xs={4} className="mt-4 ">
              <div className="menu-button ">
                <span>Cashback Direto</span>
                <label className="valor card-transfer text-center d-flex flex-column align-items-center">
                  <h5>IDPLUG</h5>
                  <h5>do Cliente</h5>
                  <TextField
                    required={true}
                    className="no-border white-color"
                    style={{
                      width: "55%",
                      // height: "28px",
                      padding: "0",
                    }}
                    onChange={(e) => {
                      setPlugId(e.target.value);
                    }}
                    value={plugId}
                  />
                  {walletTranfer && (
                    <div className="data-user">
                      <span>Titular:{walletTranfer.nome}</span>
                      {/* <span>Card nº:{walletTranfer?.nomeDaLoja}</span> */}
                    </div>
                  )}
                  Informe o valor
                  <TextField
                    required={true}
                    className="no-border white-color"
                    style={{
                      width: "55%",
                      // height: "28px",
                      padding: "0",
                    }}
                    InputProps={{
                      inputComponent: MoneyFormat,
                    }}
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        if (e.target.value > 0) {
                          setPayment({
                            ...payment,
                            value: parseFloat(e.target.value),
                          });
                        }
                      }
                    }}
                    value={payment.value}
                  />
                  <TextField
                    required={true}
                    className="no-border description"
                    type="text"
                    placeholder="Descrição Opcional"
                    onChange={(e) => {
                      setPayment({ ...payment, description: e.target.value });
                    }}
                    style={{
                      width: "100%",
                      // height: "28px",
                      padding: "0",
                    }}
                  />
                  <Col xs={12} className="swith-input center mt-3 form-pix ">
                    <button
                      disabled={!!loading}
                      theme="secondary"
                      onClick={() => {
                        submit();
                      }}
                    >
                      {loading ? (
                        <div className="spinner">
                          <Spinner />
                        </div>
                      ) : (
                        "Confirmar"
                      )}
                    </button>
                  </Col>
                </label>
              </div>
            </Col>
          </Container>
        </>
      )}
    </Background>
  );
}

export default CashbackDireto;
