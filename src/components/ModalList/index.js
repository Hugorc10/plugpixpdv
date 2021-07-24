import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { RiUserAddLine } from "react-icons/ri";
import { firestore } from "../../config/Fire";
import { getFirestoreCollectionDataByAttribute } from "../../util/fire-functions";

import "./style.scss";

const ModalList = ({ setOpen, userProp }) => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const userType = userProp[0];
  const userData = userProp[1];

  useEffect(() => {
    if (userType != 'turnPJ'){
      (async () => {
        setLoading(true);
        const users = (await getFirestoreCollectionDataByAttribute('usuarios','tipoDeUsuario', 'Pessoa Jurídica')) || [];
        setUsers(
          users
            .map((item) => {
              return {
                ...item,
              };
            })
        );
        setLoading(false);
      })()
    }
  }, []);

  const submit = async (user) => {
    userType === 'turnPJ' ?
      user.tipoDeUsuario = 'Pessoa Jurídica'
    :
      user.tipoDeUsuario = userType
    ;
    await firestore.collection("usuarios").doc(user.uid).update(user);
    setOpen(false);
  };
  
  return (
    userType == 'turnPJ' ?
    <>
      <div className="turn-pj modal-container">
        <h2>Tornar PJ</h2>
        <ul className="list-body">
          <li className="list-item">
            <div className="name">
              <span>Tornar este usuário Pessoa Jurídica?</span>
            </div>
            <div></div>
            <div className="upgrade">
              <span>
                <Button
                  onClick={() => submit(userData)}
                  className="view-cities m-0"
                >
                  <RiUserAddLine />
                </Button>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </>
    :
    <>
      {loading && (
        <div>
          <CircularProgress />
        </div>
      )}

      {users && !loading && (
        <>
          <div className="permission modal-container">
            <h2>Permissões</h2>
            <ul className="list-body">
              {users.map((user, index) => {
                return (
                  <li className="list-item" key={index}>
                    <div className="name">
                      <span>{user.nome}</span>
                    </div>

                    <div className="situation">
                      {user && <span>{user.tipoDeUsuario}</span>}
                    </div>
                    <div className="upgrade">
                      <span>
                        <Button
                          onClick={() => submit(user)}
                          className="view-cities"
                        >
                          <RiUserAddLine />
                        </Button>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};
export default ModalList;
