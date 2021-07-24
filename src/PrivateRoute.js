import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import { useHistory } from "react-router-dom";
//PrivateRoute carrega o RouteComponent e o resto dos componentes e exibe o componente certo dependendo
//de existir ou não um usuario logado
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  //pega o RouteComponent e o resto dos componentes
  const data = useContext(AuthContext); //verifica se existe usuario logado
  const history = useHistory();
  const user = JSON.parse(window.localStorage.getItem("@plugpixweb/authData"));

  const blackList = {
    "Gerente Regional": "/agencies",
  };

  useEffect(() => {
    if (blackList[user.userType] === history.location.pathname) {
      history.push("/");
    }
  }, [history.location.pathname]);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        data && !!data.currentUser ? ( //se existe usuario logado
          <>
            <div className="main-content">
              <RouteComponent {...routeProps} />
            </div>
          </> //renderiza o RouteComponent (no caso, a Home)
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: routeProps.location } }}
          /> //senão, redireciona pra Login
        )
      }
    />
  );
};

export default PrivateRoute;
