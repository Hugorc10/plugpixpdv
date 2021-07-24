import React from "react";
import IMask from "imask";
import fire, { functions, firestore } from "../config/Fire";
import moment from "moment";
import NumberFormat from "react-number-format";

export const priceFormat = (number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
};

export const getWallet = async () => {
  const user = await fire.auth().currentUser;
  // const currentUser = await db.collection("usuarios").doc(user.uid);
  if (user) {
    const carteiras = await firestore.collection("carteirasDigitais");

    const myWallet = await carteiras.where("idUsuario", "==", user.uid).get();
    let arr = null;
    myWallet.forEach((doc) => {
      arr = {
        ...{ id: doc.id },
        ...doc.data(),
      };
    });
    return arr;
  }
  return null;
};
export const sendMail = async (params) => {
  try {
    const callable = functions.httpsCallable("enviar_boleto");
    const res = await callable({
      ...params,
    });
    return res;
  } catch (error) {
    alert.setOptions({
      open: true,
      message: "Erro ao gerar Boleto",
      type: "error",
      time: 2000,
    });
  }
};
export const MoneyFormat = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      fixedDecimalScale={true}
      decimalScale={2}
      isNumericString
      prefix="R$ "
      allowEmptyFormatting={false}
      allowNegative={false}
    />
  );
};

export const maskInput = ({
  type = null,
  pattern = null,
  value = 0,
  scale = 2,
}) => {
  if (type) {
    switch (type) {
      case "agencia":
        return IMask.createMask({
          mask: "0000",
        }).resolve(value.toString());
      default:
        return value.toString();
    }
  }

  if (pattern) {
    return IMask.createMask({
      mask: pattern,
    }).resolve(value);
  }

  return value;
};

export const getWalletNumbers = async (data) => {
  await firestore
    .collection("regioes")
    .doc(data.id)
    .update({
      carteiraAtual: `${parseFloat(data.carteiraAtual) + 1}`,
    });
  return `${parseFloat(data.carteiraAtual) + 1}`;
};

export const returnDate = (timestamp) => {
  return moment(new Date(timestamp * 1000)).format("DD/MM/YYYY [às] HH:mm");
};

export const userType = (type) => {
  switch (type) {
    case "Pessoa Jurídica":
      return "PJ";
    case "Pessoa Física":
      return "PF";
    case "ADM Master":
      return "Administrador Master";
    case "Gerente Regional":
      return "Gerente Regional";
    default:
      break;
  }
};

function calculateIdentity(str, weight) {
  let sum = 0;

  for (let i = str.length - 1, digit; i >= 0; i -= 1) {
    digit = parseInt(str.substring(i, i + 1), 10);
    sum += digit * weight[weight.length - str.length + i];
  }

  sum = 11 - (sum % 11);
  return sum > 9 ? 0 : sum;
}

function cpfValidate(str) {
  const weight = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  const cpf = str.replace(/\D/g, "");

  if (cpf === null || cpf.length !== 11) return false;

  const digit1 = calculateIdentity(cpf.substring(0, 9), weight);
  const digit2 = calculateIdentity(cpf.substring(0, 9) + digit1, weight);

  return cpf === cpf.substring(0, 9) + digit1.toString() + digit2.toString();
}
const invalidCpfList = [
  "00000000000",
  "11111111111",
  "22222222222",
  "33333333333",
  "44444444444",
  "55555555555",
  "66666666666",
  "77777777777",
  "88888888888",
  "99999999999",
];
export const isCPF = (value) => {
  if (value && value.length) {
    if (invalidCpfList.includes(value.replace(/\D/g, ""))) {
      return false;
    }
    return !!cpfValidate(value);
  }
  return false;
};
