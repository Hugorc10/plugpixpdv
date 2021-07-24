import styled from "styled-components";

export const HeaderStyle = styled.div`
  .header {
    margin-top: 0px !important;
  }
  .header-back {
    height: 50px;
    .title-logo {
      right: 0;
    }
    img {
      max-width: 70px;
    }
  }
`;
export const HeaderStyled = styled.div`
  margin-top: 50px;
  .title-logo {
    /* width: 60%; */
    position: absolute;
    display: flex;
    background-color: #0069b8;
    border-radius: 12px 0 0 12px;
    padding: 8px 3px 8px 10px;
    color: #29f5a0;
    right: 0;
    top: 55px;
    align-items: center;
    max-width: 45%;
    img {
      max-width: 50px;
      height: 50px;
      display: block;
      margin-right: 10px;
    }
    p {
      margin: 0;
    }
    span {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .title {
        font-size: 1.3em;
        margin: 0;
        line-height: 1;
      }
    }
  }

  .saldoValue {
    font-size: 2.2em;
    line-height: 1.1;
  }
`;

export const Background = styled.div`
  font-family: inherit;
  margin-bottom: 80px;
  .white-color {
    background-color: #fff;
    width: auto;
    border-radius: 5px;
    margin-bottom: 15px;
  }
  .data-user {
    border: 1px solid #00529e;
    width: 100%;
    padding: 15px;
    border-radius: 4px;
    margin: 15px;
  }
  .select {
    color: #28eca3;
    text-align: center;
    & .lupa {
      position: absolute;
      display: block;
      width: 20px;
      height: 20px;
      z-index: 9999999999999;
      top: 8px;
      left: 8px;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .MuiAutocomplete-inputRoot {
      padding: 2px 15px 0 35px !important;
      position: relative;
      input {
        font-family: inherit;
        color: #3a9dd9;
        ::-webkit-input-placeholder {
          /* Edge */
          color: #026ac4;
          font-weight: 900;
        }
        :-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          font-weight: 900;
          color: #026ac4;
        }
        ::placeholder {
          font-weight: 900;
          color: #026ac4;
        }
      }
    }
  }
  .MuiAutocomplete-root {
    position: relative;
    .MuiFormControl-root {
      margin-top: 0;
    }
    & .MuiAutocomplete-inputRoot {
      font-family: "Roboto";
      font-size: 1em;
      text-align: left;
      padding: 8px 15px;
      height: 100%;
      display: flex;
      background-color: #fff;
      border-radius: 6px;
    }
  }
  .card-transfer {
    color: #00529e;
    background-color: #29f5a0;
    border-radius: 8px;
    padding: 15px;
    .description {
      input {
        font-family: inherit;
        font-size: 1em;
        text-align: left;
        padding: 8px 15px;
        height: 100%;
        display: flex;
      }
      border-radius: 6px;
      height: 35px;
      background-color: #fff;
    }
    input {
      color: #00529e;
      text-align: center;
      border: none;
      font-family: inherit;
      font-size: 1.8em;
    }
    .MuiInputBase-root {
      &:after,
      &:before {
        display: none;
      }
    }
  }
  .qr-reader {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid #399ad5;
    border-radius: 20px;
    padding: 15px 0;
    width: 50%;
    margin: 0 auto;
  }
  .color-green.spinner {
    color: #2beaa6;
  }
  .border-top-left {
    width: 30px;
    border-left: 7px solid #29f5a0;
    border-top: 7px solid #29f5a0;
    height: 30px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .border-top-right {
    width: 30px;
    border-right: 7px solid #29f5a0;
    border-top: 7px solid #29f5a0;
    height: 30px;
    position: absolute;
    right: 0;
    top: 0;
  }
  .border-bottom-left {
    width: 30px;
    border-left: 7px solid #29f5a0;
    border-bottom: 7px solid #29f5a0;
    height: 30px;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .border-bottom-right {
    width: 30px;
    border-right: 7px solid #29f5a0;
    border-bottom: 7px solid #29f5a0;
    height: 30px;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .card-data {
    background-color: #2beaa6;
    padding: 15px 0;
    border-radius: 8px;
    box-shadow: 0 0 8px -1px #6f6f6f;
    padding: 15px 30px;
    color: #399ad5;
    hr {
      margin-top: 0;
      margin-bottom: 0rem;
      border: 0;
      border-top: 1px solid rgb(57 154 213);
    }
    small {
      line-height: 1;
    }
    .uppercase {
      text-transform: uppercase;
    }
    input {
      color: #399ad5;
      font-weight: bold;
      font-size: 1.5rem;
      text-align: center;
    }

    .MuiInput-underline:before {
      border-bottom: 1px solid rgb(57 154 213);
    }
    .description-field input {
      font-size: 12px !important;
      padding: 10px 5px 10px 15px;
      text-align: left;
      background-color: #fff;
      border-radius: 5px;
    }
    button {
      color: #2beaa6;
      border-radius: 8px;
      letter-spacing: 2px;
      font-size: 24px;
    }
  }

  .spinner {
    width: 100%;
    height: calc(100vh - 30px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #399ad5;
  }
  min-height: 100vh;
  .qr-cam {
    .cam {
      width: 60% !important;
      margin: 30px auto 0;
    }
    border: 8px solid #29f5a0;
    border-radius: 8px;
    background-color: #29f5a0;
    margin-bottom: 18px;
    div {
      box-shadow: none !important;
      border: none !important;
    }
  }
  .qr-field {
    padding: 4px;
    margin: 0px auto 200px;

    .description-qr {
      display: flex;
      flex-direction: column;
      height: 40px;
      align-items: center;
      justify-content: center;
      padding: 10px 10px 0;
      small {
        font-family: "Roboto-Bold";
        color: #399ad5;
        line-height: 1;
        font-size: 0.9em;
      }
    }
  }
  .card-template {
    width: 80%;
    margin: 0 auto;
    position: relative;
    .name-card {
      color: #fff;
      position: absolute;
      font-size: 1.3em;
      text-align: left;
      left: 15px;
      bottom: 40px;
    }
  }

  .card-img {
    border-radius: 20px;
  }
`;
export const H5 = styled.h5`
  color: #399ad5;
  font-size: 18px;
  font-family: "Roboto";
  margin-top: -8px;
  display: block;
  margin-bottom: 7px;
`;
export const HeaderCustom = styled.div`
  .action-item {
    width: 25%;
    display: flex;
    height: auto;
    flex-direction: column;
    align-items: center;
    color: #196abb;
    background-color: #28eca3;
    font-size: 11px;
    border-radius: 8px;
    position: absolute;
    z-index: 1;
  }

  .action-item img {
    max-width: 100%;
    /* background-color: #000; */
    /* border: 15px solid #000; */
    /* padding: 20px 25px; */
    border-radius: 8px;
    padding: 5px 20px 0 20px;
  }
  .saldos {
    display: flex;
    grid-template-columns: 1fr 10px 1fr;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    width: 100%;
  }
  .saldo h5 {
    font-family: sans-serif;
    font-size: 1.2em;
  }
  .saldo.green {
    color: #32ff00;
  }
  .saldo.yellow {
    color: #fff200;
  }
  .saldo span {
    font-family: system-ui;
    font-size: 10px;
    font-weight: 600;
  }
  .saldo div {
    font-family: system-ui;
    font-size: 10px;
    font-weight: 600;
  }
  .price div {
    font-size: 54px;
    font-family: inherit;
    line-height: 1;
  }

  .price {
    display: grid;
    grid-template-columns: 10% 90%;
  }
  .saldo-label {
    font-family: system-ui;
    font-weight: 100;
    font-size: 13px;
  }

  .price small {
    font-size: 17px;
    font-family: "Roboto";
  }
  .price div {
    font-size: 40px;
    font-family: inherit;
    line-height: 1;
  }

  .price {
    display: grid;
    grid-template-columns: 10% 90%;
  }

  .price small {
    font-size: 17px;
    font-family: "Roboto";
  }

  .saldo-label {
    font-family: system-ui;
    font-weight: 100;
    font-size: 13px;
  }

  .acumulado {
    border: 3px solid #28eca3;
    border-radius: 8px;
    padding: 2px 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 80%;
    float: right;
    position: absolute;
    right: -23px;
  }

  .acumulado small {
    color: #28eca3;
    text-transform: uppercase;
    line-height: 1;
  }

  .acumulado div {
    font-size: 20px;
    line-height: 1.3;
  }
`;
export const ExtractItem = styled.div`
  display: grid;
  grid-template-columns: 17% 50% 20%;
  grid-gap: 20px;
  margin-bottom: 15px;
`;
export const DateExtract = styled.div`
  position: relative;
  &:after {
    height: 35px;
    width: 2px;
    background-color: #399ad5;
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 42%;
    transform: translateY(-50%);
  }
`;
export const Day = styled.div`
  font-size: 32px;
  font-family: "Roboto";
  color: #399ad5;
  line-height: 1;
  text-align: center;
`;
export const Month = styled.div`
  text-align: center;
  color: #399ad5;
  line-height: 1;
`;
export const Store = styled.div`
  color: #399ad5;
  font-size: 14px;
`;
export const Status = styled.div`
  font-size: 12px;
  font-family: "Roboto";
  color: #399ad5;
  line-height: 1;
`;
export const PriceExtract = styled.div`
  color: #399ad5;
  font-size: 16px;
`;
export const LojaExtract = styled.div``;
