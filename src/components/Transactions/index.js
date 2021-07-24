import React, { useEffect, useState } from "react";
import {
  getTrasactions,
  getTrasactionsPendent,
  aproveTransaction,
  getFirestoreCollectionDataByAttribute,
} from "../../util/fire-functions";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { priceFormat, returnDate } from "../../util/functions";
import { FaEdit } from "react-icons/fa";
import Modal from "../../components/Modal";

import "./styles.css";

const Transactions = (props) => {
  const [userWallet, setUserWallet] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

  const openModalTrasaction = (transactionItem, id) => {
    if (id) {
      setSelectedTransactionId(id);
    } else {
      setSelectedTransactionId(null);
    }
    setOpen(true);
    setSelectedTransaction(transactionItem);
  };

  const approveTransaction = async (item, id) => {
    try {
      await aproveTransaction(item, id);
      alert.setOptions({
        open: true,
        message: "Transação Aprovada.",
        type: "success",
        time: 15000,
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      alert.setOptions({
        open: true,
        message: "Erro ao aprovar Transação",
        type: "error",
        time: 15000,
      });
    }
  };

  return (
    <>
      {userWallet && (
        <>
          <section className="section single-client-bottom">
            <h2 className="section-title">Extrato</h2>
            <div className="list-bg">
              <div className="list-header">
                <div className="titular">Titular</div>
                <div className="favorecido">Favorecido</div>
                <div className="valor">Valor</div>
                <div className="veja-mais">Veja mais</div>
              </div>
              <ul className="list-body">
                {userWallet.extrato ? (
                  userWallet.extrato.map((i, k) => {
                    return (
                      <li key={k} className="list-item">
                        <div className="titular">{i.transacao.titular}</div>
                        <div className="favorecido">
                          {i.transacao.favorecido}
                        </div>
                        <div className="valor">
                          {priceFormat(i.transacao.valor)}
                        </div>
                        <div className="veja-mais">
                          <Button
                            onClick={() => openModalTrasaction(i, i.id)}
                            className="view-cities"
                          >
                            <Link to="#">
                              <FaEdit />
                            </Link>
                          </Button>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <>
                    <li className="list-item nothing-found">
                      Nenhuma transação encontrada.
                    </li>
                  </>
                )}
              </ul>
            </div>
          </section>{" "}
          <Modal open={open} setOpen={setOpen}>
            {selectedTransaction && (
              <div className="comprovante">
                <div className="title">
                  <h4>Dados da Transação</h4>
                  <small>
                    {returnDate(selectedTransaction.transacao.data.seconds)}
                  </small>
                </div>

                <div className="table ">
                  <div className="header-table">
                    <ul>
                      <li>Nome do Titular</li>
                      <li>Agência do Titular</li>
                      <li>Conta do Titular</li>
                      <li>{`${
                        selectedTransaction.transacao.titularCpnj
                          ? "CNPJ do Titular"
                          : "CPF do Titular"
                      }`}</li>
                    </ul>
                    <hr />
                    <ul>
                      <li>Nome do Favorecido:</li>
                      <li>Agência do Favorecido:</li>
                      <li>Conta do Favorecido:</li>
                      <li>{`${
                        selectedTransaction.transacao.favorecidoCnpj
                          ? "CNPJ do Favorecido"
                          : "CPF do Favorecido"
                      }:`}</li>
                    </ul>
                    <hr />
                    <ul>
                      <li>
                        <b>Valor:</b>
                      </li>
                    </ul>
                  </div>
                  <div className="body-table">
                    <ul>
                      <li>{selectedTransaction.transacao.titular}</li>
                      <li>{selectedTransaction.transacao.agenciaTitular}</li>
                      <li>{selectedTransaction.transacao.contaTitular}</li>
                      <li>
                        {selectedTransaction.transacao.titularCpf ||
                          selectedTransaction.transacao.titularCpnj}
                      </li>
                    </ul>
                    <hr />
                    <ul>
                      <li>{selectedTransaction.transacao.favorecido}</li>
                      <li>{selectedTransaction.transacao.agenciaFavorecido}</li>
                      <li>{selectedTransaction.transacao.contaFavorecido}</li>
                      <li>
                        {selectedTransaction.transacao.titularCpnj ||
                          selectedTransaction.transacao.titularCpf}
                      </li>
                    </ul>
                    <hr />
                    <ul>
                      <li>
                        <b>
                          {priceFormat(selectedTransaction.transacao.valor)}
                        </b>
                      </li>
                    </ul>
                  </div>
                </div>
                {selectedTransactionId && (
                  <div className="button">
                    <Button
                      onClick={() =>
                        approveTransaction(
                          selectedTransaction.transacao,
                          selectedTransactionId
                        )
                      }
                      className="view-cities"
                    >
                      Aprovar Transação
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

export default Transactions;
