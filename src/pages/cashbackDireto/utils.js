import firebase from "firebase";
import fire, { functions } from "../../services/Fire";
import { getWallet } from "../../services/db";
import axios from "axios";

const DIGITAL_WALLETS = "carteirasDigitais";
const db = fire.firestore();
db.settings({
  timestampsInSnapshots: true,
});
const BALANCE_TOTAL_AVALAIBLE = "saldoTotalDisponivel";
const TRANSFER = "transacoes";
const SENDER = "titular";
const SENDER_NAME = "nomeTitular";
const SEND_AGENCY = "agenciaTitular";
const SEND_ACCOUNT = "contaTitular";
const FAVORED = "favorecido";
const FAVORED_NAME = "nomeFavorecido";
const FAVORED_AGENCY = "agenciaFavorecido";
const FAVORED_ACCOUNT = "contaFavorecido";
const FAVORED_CPF = "cpf";
const DESCRIPTION = "descricao";
const TRANSFER_VALUE = "valorDaTransferencia";
const TYPE_OF_TRANSFER = "tipoDeTransacao";
const DATE_OF_TRANSFER = "dataDaTransacao";
const REFERENCE_TRANSFER = "referenciaDeTransacao";
const TRANSFER_UNIT = "transacoes";
// const CARD = "cartao";
// const ID = "id";
// const URL = "url";
// const ID_USER = "idUsuario";
// const AGENCY = "agencia";
// const ACCOUNT = "conta";
// const BALANCE_CASHBACK = "saldoCashback";
// const ACCUMULATED_CASHBACK = "saldoCashbackAcumulado";
// const HAVE_PHYSICAL_CARD = "temCartaoFisico";
// const NAME_USER = "nomeUsuario";
// const CPF = "cpf";
// const CNPJ = "cnpj";
const EXTRACT = "extrato";
const TYPE_OF_TRANSFER_BANK_TRANFER = "Transferência bancária";
const ID_TRANFER = "idDaTransferencia";
const { FieldValue } = firebase.firestore;

export const tranfer = async (value, idFavored, description) => {
  try {
    const callable = functions.httpsCallable("pagamentos-transferir");
    const res = await callable({
      idFavorecido: idFavored,
      value,
      descricao: description,
    });
    return res;
  } catch (error) {
    return { error: error.message || "Erro ao realizar Transação" };
  }
};

export const transactionPf2PF = (favoredWalletId, value, description) => {
  db.runTransaction(async (transaction) => {
    const myWalletId = await getWallet();
    const accountsReference = db.collection(DIGITAL_WALLETS);

    const senderDocumentReference = accountsReference.doc(myWalletId.id);
    const favoredDocumentReference = accountsReference.doc(favoredWalletId);
    const senderSnapshot = await transaction.get(senderDocumentReference);

    const favoredDocumentSnapshot = await transaction.get(
      favoredDocumentReference
    );
    if (value <= senderSnapshot.data()[BALANCE_TOTAL_AVALAIBLE]) {
      transaction.update(senderDocumentReference, {
        [BALANCE_TOTAL_AVALAIBLE]:
          senderSnapshot.data()[BALANCE_TOTAL_AVALAIBLE] - value,
      });
      transaction.update(favoredDocumentReference, {
        [BALANCE_TOTAL_AVALAIBLE]:
          favoredDocumentSnapshot.data()[BALANCE_TOTAL_AVALAIBLE] + value,
      });
      const transation = db.collection(TRANSFER).doc();

      const sender = db.collection(DIGITAL_WALLETS).doc(myWalletId.id);
      const favored = db.collection(DIGITAL_WALLETS).doc(favoredWalletId);

      transation.set({
        [ID_TRANFER]: transation.id,
        [SENDER_NAME]: senderSnapshot.data().nomeUsuario,
        [SEND_AGENCY]: senderSnapshot.data().agencia,
        [SEND_ACCOUNT]: senderSnapshot.data().conta,
        [SENDER]: sender,
        [FAVORED_NAME]: favoredDocumentSnapshot.data().nomeUsuario,
        [FAVORED_AGENCY]: favoredDocumentSnapshot.data().agencia,
        [FAVORED_ACCOUNT]: favoredDocumentSnapshot.data().conta,
        [FAVORED_CPF]: favoredDocumentSnapshot.data().cpf,
        [FAVORED]: favored,
        [DESCRIPTION]: description,
        [TRANSFER_VALUE]: value,
        [TYPE_OF_TRANSFER]: TYPE_OF_TRANSFER_BANK_TRANFER,
        [DATE_OF_TRANSFER]: new Date(
          firebase.firestore.Timestamp.now().seconds * 1000
        ).toLocaleDateString(),
      });

      const documentTransfer = await transation.get();
      transaction.update(sender, {
        [EXTRACT]: FieldValue.arrayUnion(
          ...[
            {
              [TRANSFER_UNIT]: documentTransfer.data(),
              [REFERENCE_TRANSFER]: transation,
            },
          ]
        ),
      });
      transaction.update(favored, {
        [EXTRACT]: FieldValue.arrayUnion(
          ...[
            {
              [TRANSFER_UNIT]: documentTransfer.data(),
              [REFERENCE_TRANSFER]: transation,
            },
          ]
        ),
      });
    }
  });
};
