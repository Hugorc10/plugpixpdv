import React, { useState } from "react";
import "./styled.scss";
import { useHistory } from "react-router-dom";
import QRCode from "qrcode.react";
import { MdReportProblem } from "react-icons/md";
import { firestore } from "../../config/Fire";
import { useAlert } from "../../components/alert/alertContext";
import CircularProgress from "@material-ui/core/CircularProgress";

const PaymentPlugPix = () => {
  const user = JSON.parse(window.localStorage.getItem("@plugpixweb/authData"));
  const { location } = useHistory();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const alert = useAlert();

  const paymentVerify = async () => {
    if (location.state.data) {
      setLoading(true);
      const res = await firestore
        .collection("transacoesPendentes")
        .doc(location.state.data.uid)
        .get();
      const { status } = res.data();
      if (status === "paga") {
        alert.setOptions({
          open: true,
          message: "Pagamento Confirmado",
          type: "success",
          time: 3000,
        });
        setLoading(false);
        history.push("/");
      } else if (status === "pendente") {
        alert.setOptions({
          open: true,
          message: "Pagamento ainda pendente",
          type: "error",
          time: 3000,
        });
        setLoading(false);
      }
    }
  };

  console.log(location.state);
  return (
    <>
      {location && location.state && location.state.data ? (
        <>
          <div className="qr-reader">
            <h3 className="m-0">Leia com o app do seu banco</h3>
            <QRCode
              renderAs="svg"
              size={250}
              className="mt-2"
              value={location.state.data.uid}
            />
            <small className="mt-2">
              <b>(!) ATENÇÃO SR. CAIXA:</b>
            </small>

            <small className="mt-0">
              O cliente pagante irá ler o QR CODE gerado usando a função PAGAR
              COM PIX no app do banco onde ele tem saldo. Após isso click em
              CONCLUIR.
            </small>
          </div>
          <button
            className="update"
            type="submit"
            onClick={() => paymentVerify()}
          >
            {loading ? (
              <div className="spinner spinner-blue">
                <CircularProgress />
              </div>
            ) : (
              "Verificar Pagamento"
            )}
          </button>
        </>
      ) : (
        <div className="problem d-flex justify-content-center flex-column align-items-center">
          <MdReportProblem />
          Nenhum QRCode encontrado
        </div>
      )}
    </>
  );
};

export default PaymentPlugPix;
