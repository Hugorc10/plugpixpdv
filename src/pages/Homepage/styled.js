import styled from "styled-components";
import info from "../../assets/svg/info.svg";

export const Modal = styled.div`
  position: absolute;
  top: 0;
  z-index: 9999999;
  background-color: #000000b5;
  bottom: 0;
  width: 100%;
  padding: 20px;
`;
export const LayoutCustom = styled.div`
  .content-base {
    max-height: 64vh !important;
  }
`;
export const Background = styled.div`
  h1 {
    background-color: #0069b8;
    color: #fff;
    text-align: center;
    padding: 15px;
    margin: 30px 0;
  }

  .list-dates-extract {
    padding-top: 50px;
    padding-bottom: 10px;
  }

  .action {
    padding: 3px;
  }
  .buttons-float {
    position: absolute;
    top: -2.5rem;
    width: 100%;
    z-index: 2;
  }
  .action-item {
    /* width: 25%; */
    display: flex;
    height: 0;
    align-items: center;
    color: #196abb;
    background-color: #04f69d;
    font-size: 11px;
    border-radius: 8px;
    position: relative;
    z-index: 1;
    overflow: hidden;
    padding-bottom: 80%;
  }

  .action-item img {
    max-width: 100%;
    border-radius: 8px;
    padding: 15px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .blue-text {
    h6 {
      font-size: 1.1em;
    }
    p {
      font-size: 0.7em;
      margin: 0;
    }
  }
  .content-height {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .tabs-content {
    overflow: auto;
    background-color: transparent;
  }
  .MuiBox-root {
    padding: 10px 0px;
  }
  background: #e6e7e8;
  h5 {
    color: #399ad5;
  }
  a,
  a:hover {
    color: #000;
    text-decoration: none;
  }
  .MuiTabs-flexContainer {
    width: 100%;
  }
  .MuiAppBar-root {
    background-color: #e6e7e8;
    color: #399ad5;
    box-shadow: none;
    z-index: 0;
  }

  .MuiTabs-flexContainer {
    justify-content: space-around;
  }

  .MuiTabs-flexContainer button {
    text-transform: capitalize;
    font-family: "Roboto";
    font-size: 1.05rem;
    display: flex;
    align-items: flex-end;
    padding-bottom: 0;
    min-height: 10px;
  }

  .MuiTabs-indicator {
    background-color: #399ad5 !important;
    height: 5px;
    top: 35px;
    /* width: 14%!important; */
  }

  .MuiTabs-flexContainer {
    border-bottom: 5px solid #d2d2d2;
  }
`;
export const H5 = styled.h5`
  color: #399ad5;
  font-size: 12px;
  font-family: "Roboto";
`;
export const HeaderCustom = styled.div`
  height: 100%;
  max-height: 24%;

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
    &:before {
      content: url(${info});
      position: absolute;
      top: 3px;
      left: 5px;
    }
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
  grid-template-columns: 17% 40% 30%;
  grid-gap: 20px;
  margin-bottom: 15px;
  border-bottom: 1px solid #d2d2d2;
  align-items: center;
  padding: 15px 0;
`;
export const DateExtract = styled.div`
  position: relative;
  /* &:after {
    height: 35px;
    width: 2px;
    background-color: #399ad5;
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 42%;
    transform: translateY(-50%);
  } */
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
  text-transform: capitalize;
`;
export const PriceExtract = styled.div`
  color: #399ad5;
  font-size: 16px;
  overflow: hidden;
  text-align: right;
`;
export const ListDate = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0;
  width: 100%;
  .item-date {
    background-color: #399ad5;
    color: #fff;
    font-size: 9px;
    border-radius: 50%;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 7px -3px #000;
    margin-left: 5px;
  }
`;
export const LojaExtract = styled.div``;
