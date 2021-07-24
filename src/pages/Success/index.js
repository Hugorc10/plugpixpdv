import React, { useState } from "react";
import "./styled.scss";
import { Container, Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import QRCode from "qrcode.react";
import { MdReportProblem } from "react-icons/md";

const Success = () => {
  const user = JSON.parse(window.localStorage.getItem("@plugpixweb/authData"));
  const { location } = useHistory();

  return (
    <>
      <div className="qr-reader-success">
        <h3 className="m-0">Pagamento Efetuado com Sucesso</h3>
      </div>
      <button className="update" type="submit">
        Nova Venda
      </button>
    </>
  );
};

export default Success;
