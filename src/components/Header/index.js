import React, { useState, useEffect } from "react";
import "./styles.css";
import logo from "../../assets/images/logo_plugpix_vender.png";
import { Container, Row, Col } from "reactstrap";
import fire from "../../config/Fire";
import { useLocation } from "react-router-dom";

const HeaderLogged = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      setUser(JSON.parse(window.localStorage.getItem("@plugpixweb/authData")));
    }, 300);
  }, [location.pathname]);

  return (
    <header className="header-logged">
      <Container>
        <Row className="justify-content-center">
          <Col xs={5}>
            <a href="/">
              <img src={logo} className="header img-fluid" alt="logo" />
            </a>
          </Col>
          {!!user && (
            <button
              className="btn-logout"
              onClick={() => {
                window.localStorage.removeItem("@plugpixweb/authData");
                fire.auth().signOut();
              }}
              type="submit"
            >
              Sair
            </button>
          )}
        </Row>
      </Container>
    </header>
  );
};

export default HeaderLogged;
