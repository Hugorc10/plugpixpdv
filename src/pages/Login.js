import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import { Link } from "react-router-dom";
import fire from "../config/Fire";
import { AuthContext } from "../Auth";
import logo from "../assets/images/logo_cashback.png";
import { useAlert } from "../components/alert/alertContext";
import { Col, Container, Row } from "reactstrap";

const Login = ({ history }) => {
  const alert = useAlert();
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault(); //pra não recarregar a pagina qnd clicar em Login

      //pegar os inputs email e password do form (target = form, elements = lista de elementos do form)
      const { email, password } = event.target.elements;

      try {
        //tenta chamar a funcao da api do firebase passando email e password do const acima
        await fire
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/"); //se der certo, redireciona pra pagina inicial
      } catch (error) {
        //TODO
        console.log(error);
        alert.setOptions({
          open: true,
          message: error.message,
          type: "error",
          time: 2000,
        });
      }
    },
    [history]
  );

  const data = useContext(AuthContext);

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col xs={12}>
            <div className="login-wrapper">
              <div className="credentials-card">
                <form onSubmit={handleLogin}>
                  <input
                    id="email"
                    name="email"
                    variant="outlined"
                    placeholder="E-mail"
                    type="email"
                  />
                  <input
                    id="password"
                    name="password"
                    variant="outlined"
                    placeholder="Senha"
                    type="password"
                  />
                  <Link
                    className="mt-0"
                    to="reset-passsword"
                    className="resetPassLink"
                  >
                    Esqueceu sua senha?
                  </Link>
                  <button type="submit">Entrar</button>
                  {/* <a href="signup">Cadastre-se</a> */}
                </form>
                <img alt="logo" src={logo} className="img-fluid w-50 mt-4" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(Login);
