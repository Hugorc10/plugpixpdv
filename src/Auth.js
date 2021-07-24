import React, { useEffect, useState } from "react";
import fire from "./config/Fire";
import { useAlert } from "./components/alert/alertContext";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Container, Row, Col } from "reactstrap";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const alert = useAlert();
  const history = useHistory();

  useEffect(() => {
    try {
      fire.auth().onAuthStateChanged(async (user) => {
        if (user) {
          setCurrentUser(user);
          await getData(user);
          setPending(false);
        } else {
          history.push("/login");
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  async function getData(user) {
    try {
      const userData = await fire
        .firestore()
        .collection("usuarios")
        .doc(user.uid)
        .get();
      console.log(userData.data());
      const authData = {
        agency:
          userData.data().tipoDeUsuario !== "ADM Master"
            ? userData.data().agencia
            : null,
        userType: userData.data().tipoDeUsuario,
        razaoSocial: userData.data().razaoSocial,
        cnpj: userData.data().cnpj,
      };
      if (authData.userType !== "Pessoa Jurídica") {
        fire.auth().signOut();
        alert.setOptions({
          open: true,
          message: "Você não possui acesso a esse aplicativo PlugPix",
          type: "error",
          time: 15000,
        });
      }
      localStorage.setItem("@plugpixweb/authData", JSON.stringify(authData));

      return userData.data();
    } catch (err) {
      console.error("Algo de errado aconteceu :(", err);
      return err;
    }
  }

  if (pending) {
    return (
      <Container>
        <Row>
          <Col
            xs={12}
            className="d-flex justify-content-center h-100 my-5 spinner"
          >
            <CircularProgress />
          </Col>
        </Row>
      </Container>
    );
  }
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
