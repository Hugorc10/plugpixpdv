import styled from "styled-components";
import exclamation from "../../assets/svg/exclamacao.svg";
import check from "../../assets/svg/check.svg";
import cancel from "../../assets/svg/cancel.svg";

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 60%);
  z-index: 99998;
  &.camera {
    background-color: #000;
  }
`;

export const ModalBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80vw;
  min-height: 15vh;
  margin-left: -35vw;
  -webkit-transform: translateY(-50%, -50%);
  -ms-transform: translateY(-50%, -50%);
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 99999;
  border-radius: 5px;
  padding: 15px;
  margin: 0 auto;
  &.camera {
    max-height: 100vh;
    overflow: hidden;
    width: 100vw;
    padding: 0;
    margin: 0;
    position: fixed;
    background-color: transparent;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .demo-image-preview {
    position: relative;
    text-align: center;
  }

  .demo-image-preview > img {
    width: 768px;
  }

  @media (max-width: 768px) {
    .demo-image-preview > img {
      width: 100%;
    }
  }

  /* fullscreen enable by props */
  .demo-image-preview-fullscreen > img {
    width: 100vw;
    height: 100vh;
  }
  .button-photo {
    order: none;
    background: #fff;
    border-radius: 4px;
    margin: 0 auto;
    font-weight: 700;
    padding: 10px 20px;
    display: block;
    position: relative;
  }
  .button-previews {
    position: absolute;
    bottom: 15px;
  }
`;

export const ModalHeader = styled.div`
  text-align: left;
  color: #000;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 20px;
`;
export const ModalClose = styled.div`
  text-align: end;
  margin-bottom: 30px;
  cursor: pointer;
`;
export const ModalBody = styled.div`
  text-align: left;
  color: #000;
  font-size: 20px;
  padding: 0px 0 0 40px;
  position: relative;
`;

export const Icon = styled.span`
  &.error {
    background: url(${cancel});
    background-repeat: no-repeat;
  }
  &.warning {
    background: url(${exclamation});
    background-repeat: no-repeat;
  }
  &.success {
    background: url(${check});
    background-repeat: no-repeat;
  }
  text-align: center;
  color: #000;
  display: block;
  height: 25px;
  width: 25px;
  background-repeat: no-repeat;
  position: absolute;
  text-align: center;
  color: #000;
  left: 0;
  top: 3px;
`;
export const ModalButton = styled.button`
  float: right;
  border: none;
  border-radius: 2px;
  font-size: 25px;
  padding: 5px 15px;
  margin-top: 30px;
  box-shadow: 2px 4px 7px -5px black;
`;
