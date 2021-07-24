import React, { useState, useEffect } from "react";
import "./styled.scss";
import { Container, Col, Row } from "reactstrap";
import pix from "../../assets/images/logo_pix.png";
import plug from "../../assets/images/logo_plugpix.png";
import logo from "../../assets/images/logo_cashback.png";
import { Link } from "react-router-dom";
import boleto from "../../assets/images/boleto-icon.png";
import { firestore } from "../../config/Fire";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useModal } from "../../components/modal/modalContext";
import cashbackdireto from "../../assets/images/cashbackdireto.png";
import moment from "moment";
import {
  Background,
  HeaderCustom,
  H5,
  Modal,
  ExtractItem,
  DateExtract,
  Day,
  Month,
  Store,
  Status,
  PriceExtract,
  LojaExtract,
  ListDate,
  LayoutCustom,
} from "./styled";
import { priceFormat, getWallet } from "../../util/functions";
import TabPanel from "../../components/Tabs/TabPanel";

const Homepage = () => {
  const user = JSON.parse(window.localStorage.getItem("@plugpixweb/authData"));
  const [wallet, setWallet] = useState(null);
  const [dates, setDates] = useState([]);
  const [tab, setTab] = useState(0);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const modal = useModal();

  useEffect(() => {
    (async () => {
      try {
        const carteiras = await getWallet();
        setWallet(carteiras || null);
        const dates = [];
        carteiras.extrato.forEach((item) => {
          const d = `${moment(item.transacao.data.seconds * 1000).format("MMM")}`;
          if (!dates.find((el) => el === d)) {
            dates.push(d);
          }
        });
        setDates(dates);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const sort = (a, b) => {
    if (a.transacao.data.seconds < b.transacao.data.seconds) {
      return 1;
    }
    if (a.transacao.data.seconds > b.transacao.data.seconds) {
      return -1;
    }
    // a deve ser igual a b
    return 0;
  };
  console.log(wallet);
  return (
    <>
      <Container>
        <Row className="menu">
          <Col xs={12}>
            <Row className="justify-content-center">
              <Col xs={12} className="justify-content-center">
                <h5 className="text-center mt-3">
                  <b>Loja: {user.razaoSocial}</b>
                </h5>
              </Col>
            </Row>
            <Row className="justify-content-center mt-5">
              <Col xs={3}>
                <Link to="/qrcode">
                  <button className="menu-button">
                    <span>QR CODE PIX</span>
                    <div>
                      <img alt="pix-button" src={pix} />
                    </div>
                  </button>
                </Link>
              </Col>
              <Col xs={3}>
                <Link to="/qrcodeplug">
                  <button className="menu-button">
                    <span>QR CODE PLUGPIX</span>
                    <div>
                      <img alt="pix-button" src={plug} />
                    </div>
                  </button>
                </Link>
              </Col>
              <Col xs={3}>
                <Link to="/boleto">
                  <button className="menu-button">
                    <span>Cobrança</span>
                    <div>
                      <img alt="pix-button" src={boleto} />
                    </div>
                  </button>
                </Link>
              </Col>
              <Col xs={3}>
                <Link to="/cashback-direto">
                  <button className="menu-button">
                    <span>Cashback Direto</span>
                    <div>
                      <img alt="menu" src={cashbackdireto} className="img-fluid" />
                    </div>
                  </button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Background>
        <h1>Extrato de transações</h1>
        <Container>
          <Row>
            <AppBar position="static">
              <Tabs
                value={tab}
                onChange={(event, newValue) => {
                  setTab(newValue);
                }}
                className="simpletabs wallet"
              >
                <Tab label="Tudo" id={`simple-tab-1`} />
                <Tab label="Entrada" id={`simple-tab-2`} />
                <Tab label="Saída" id={`simple-tab-3`} />
              </Tabs>
            </AppBar>
          </Row>
          <div className="tabs-content">
            <TabPanel value={tab} index={0}>
              {wallet && wallet.extrato && wallet.extrato.length ? (
                <>
                  {wallet.extrato
                    .sort((a, b) => sort(a, b))
                    .map((item, i) => (
                      <ExtractItem key={i} onClick={() => setCurrentTransaction(item.transacao)}>
                        <DateExtract>
                          {/* <Day>
                            {moment(
                              new Date(item.transacao.data.seconds * 1000)
                            ).format("D")}
                          </Day> */}
                          <Month>{moment(new Date(item.transacao.data.seconds * 1000)).format("DD/MM/YYYY [às] HH:mm:ss")}</Month>
                        </DateExtract>
                        <LojaExtract>
                          <Store>{item.transacao.favorecido}</Store>
                          <Status>{item.transacao.tipoDeTransacao} </Status>
                        </LojaExtract>
                        <PriceExtract>{priceFormat(item.transacao.valor)}</PriceExtract>
                      </ExtractItem>
                    ))}
                </>
              ) : (
                <div>Sem transações</div>
              )}
            </TabPanel>

            <TabPanel value={tab} index={1}>
              {wallet && wallet.extrato && wallet.extrato.length ? (
                <>
                  {wallet.extrato
                    .sort((a, b) => sort(a, b))
                    .filter((item) => {
                      const transaction = item.transacao;
                      const walletRef = firestore.collection("carteirasDigitais").doc(wallet.id);

                      if (transaction.admDoc && walletRef.isEqual(transaction.admDoc)) {
                        return true;
                      }
                      if (transaction.gerenteDoc && walletRef.isEqual(transaction.gerenteDoc)) {
                        return true;
                      }
                      if (transaction.favorecidoDoc && walletRef.isEqual(transaction.favorecidoDoc)) {
                        return true;
                      }
                      if (transaction.supervisorDoc && walletRef.isEqual(transaction.supervisorDoc)) {
                        return true;
                      }
                      if (transaction.vendedorDoc && walletRef.isEqual(transaction.vendedorDoc)) {
                        return true;
                      }
                      return false;
                    })
                    .map((item, i) => (
                      <ExtractItem key={i} onClick={() => setCurrentTransaction(item.transacao)}>
                        <DateExtract>
                          {/* <Day>
                            {moment(
                              new Date(item.transacao.data.seconds * 1000)
                            ).format("D")}
                          </Day> */}
                          <Month>{moment(new Date(item.transacao.data.seconds * 1000)).format("DD/MM/YYYY [às] HH:mm:ss")}</Month>
                        </DateExtract>
                        <LojaExtract>
                          <Store>{item.transacao.favorecido}</Store>
                          <Status>{item.transacao.tipoDeTransacao} </Status>
                        </LojaExtract>
                        <PriceExtract>{priceFormat(item.transacao.valor)}</PriceExtract>
                      </ExtractItem>
                    ))}
                </>
              ) : (
                <div>Sem transações</div>
              )}
            </TabPanel>
            <TabPanel value={tab} index={2}>
              {wallet && wallet.extrato && wallet.extrato.length ? (
                <>
                  {wallet.extrato
                    .sort((a, b) => sort(a, b))
                    .filter((item) => {
                      const transaction = item.transacao;
                      const walletRef = firestore.collection("carteirasDigitais").doc(wallet.id);
                      if (!!transaction && transaction.titularDoc) return walletRef.isEqual(transaction.titularDoc);
                    })
                    .map((item, i) => (
                      <ExtractItem key={i} onClick={() => setCurrentTransaction(item.transacao)}>
                        <DateExtract>
                          {/* <Day>
                            {moment(
                              new Date(item.transacao.data.seconds * 1000)
                            ).format("D")}
                          </Day> */}
                          <Month>{moment(new Date(item.transacao.data.seconds * 1000)).format("DD/MM/YYYY [às] HH:mm:ss")}</Month>
                        </DateExtract>
                        <LojaExtract>
                          <Store>{item.transacao.favorecido}</Store>
                          <Status>{item.transacao.tipoDeTransacao} </Status>
                        </LojaExtract>
                        <PriceExtract>{priceFormat(item.transacao.valor)}</PriceExtract>
                      </ExtractItem>
                    ))}
                </>
              ) : (
                <div>Sem transações</div>
              )}
            </TabPanel>
          </div>
        </Container>
      </Background>
      {/* <Container>
        <Row className="justify-content-center mt-3">
          <Col xs={5} className="d-flex justify-content-center mt-3">
            <img alt="logo" src={logo} className="img-fluid w-50 mt-4" />
          </Col>
        </Row>
      </Container> */}
    </>
  );
};

export default Homepage;
