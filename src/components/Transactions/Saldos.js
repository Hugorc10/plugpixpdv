import React, { useEffect, useState } from "react";
import { priceFormat } from "../../util/functions.js";
import { getFirestoreCollectionDataByAttribute } from "../../util/fire-functions";
// import { Container } from './styles';

const Saldos = (props) => {
  const [userWallet, setUserWallet] = useState([]);

  useEffect(() => {
    async function fetchExtractData() {
      const walletData = await getFirestoreCollectionDataByAttribute(
        "carteirasDigitais",
        "idUsuario",
        props.userId
      );
      // console.log(walletData);
      setUserWallet(walletData[0]);
    }

    fetchExtractData();
  }, []);
  return (
    <div className="balances-grid">
      <div className="list-bg">
        <div className="list-header">
          <div className="titular">Saldo Total</div>
          <div className="favorecido">Saldo Cashback</div>
          <div className="valor">Saldo Depósito</div>
        </div>
        <ul className="list-body">
          <li className="list-item">
            <div className="titular">
              {userWallet ? priceFormat(userWallet.saldoTotalDisponivel) : "-"}
            </div>
            <div className="titular">
              {userWallet ? priceFormat(userWallet.saldoCashback) : "-"}
            </div>
            <div className="titular">
              {userWallet
                ? priceFormat(
                    userWallet.saldoTotalDisponivel - userWallet.saldoCashback
                  )
                : "-"}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Saldos;
