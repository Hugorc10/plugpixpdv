import React from "react";
import Alert from "./components/alert";
import ModalContext from "./components/modal/modalContext";
import AlertContext from "./components/alert/alertContext";
import Routes from "./Routes";
import Modal from "./components/modal";

import "./App.scss";

const App = () => (
  <ModalContext>
    <AlertContext>
      <Routes />
      <Alert />
      <Modal />
    </AlertContext>
  </ModalContext>
);

export default App;
