import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import { Link } from "react-router-dom";
import fire from "../config/Fire";
import { AuthContext } from "../Auth";
import logo from "../assets/images/logo_plugpix_cashback_azulescuro.png";
import TextField from "@material-ui/core/TextField";
import { useAlert } from "../components/alert/alertContext";

const ResetPassword = ({ history }) => {
  const alert = useAlert();
  const [send, setSend] = useState(false);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault(); //pra não recarregar a pagina qnd clicar em Login

      //pegar os inputs email e password do form (target = form, elements = lista de elementos do form)
      const { email } = event.target.elements;

      try {
        //tenta chamar a funcao da api do firebase passando email e password do const acima
        await fire.auth().sendPasswordResetEmail(email.value);
        setSend(true);
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

  return (
    <>
      <div className="login-wrapper">
        <div className="credentials-card">
          <img alt="logo" src={logo} className="img-fluid w-50" />

          {!send && (
            <form onSubmit={handleLogin}>
              Digite seu E-mail
              <TextField
                id="email"
                name="email"
                variant="outlined"
                label="E-mail"
                type="email"
                className="mb-1"
              />
              <Link to="/login" className="resetPassLink">
                Voltar para o Login
              </Link>
              <button type="submit">Entrar</button>
              {/* <a href="signup">Cadastre-se</a> */}
            </form>
          )}
          {send && (
            <div className="d-flex flex-column">
              <span className="mt-3">
                Enviamos um link no seu e-mail para que você possa alterar sua
                senha!
              </span>

              <Link to="/login" className="mt-2 resetPassLink">
                Voltar para o Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(ResetPassword);
