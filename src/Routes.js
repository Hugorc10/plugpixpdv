import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HeaderLogged from "./components/Header";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import QrCode from "./pages/QrCode";
import QrCodePlug from "./pages/QrCodePlug";
import Boleto from "./pages/Boleto";
import Payment from "./pages/Payment";
import PaymentPlugPix from "./pages/PaymentPlugPix";
import CashbackDireto from "./pages/cashbackDireto";
import Success from "./pages/Success";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

const Routes = () => (
  <BrowserRouter>
    <HeaderLogged />
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/reset-passsword" component={ResetPassword} />
      <AuthProvider>
        <PrivateRoute exact path="/" component={Homepage} />
        <PrivateRoute exact path="/qrcode" component={QrCode} />
        <PrivateRoute exact path="/qrcodeplug" component={QrCodePlug} />
        <PrivateRoute exact path="/cashback-direto" component={CashbackDireto} />
        <PrivateRoute exact path="/boleto" component={Boleto} />
        <PrivateRoute exact path="/payment" component={Payment} />
        <PrivateRoute exact path="/paymentplugpix" component={PaymentPlugPix} />
        <PrivateRoute exact path="/success" component={Success} />
      </AuthProvider>
    </Switch>
  </BrowserRouter>
);

export default Routes;
