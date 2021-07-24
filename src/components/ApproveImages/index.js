import React, { useState, useEffect } from "react";
import { firestore } from "../../config/Fire";
import {
  setNewCollectionDoc,
  sendNotification,
  getRegiobyAgency,
} from "../../util/fire-functions";
import { Col, Row } from "reactstrap";
import { getWalletNumbers } from "../../util/functions";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import "./styles.css";

const ApproveImages = (props) => {
  const userData = props.userData;
  const userId = props.userId;
  function setUserData(userData) {
    props.setUserData(userData);
  }

  const [openModal, setOpenModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const handleOpen = (img, url) => {
    setImageModal({ img, url });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const approve = async (img, url) => {
    const temp = userData;

    const imgValue = imageModal.img || img;

    switch (imgValue) {
      case "end":
        temp.fotosDosDocumentos.fotoDoComprovanteDeEndereco = "Aprovado";
        break;
      case "doc":
        temp.fotosDosDocumentos.fotoDoDocumento = "Aprovado";
        break;
      case "self":
        temp.fotosDosDocumentos.fotoDoUsuario = "Aprovado";
        break;
      case "logo":
        temp.fotosDosDocumentos.imagemDaLogoMarca = "Aprovado";
        break;
      default:
        break;
    }
    if (
      userData.fotosDosDocumentos.fotoDoComprovanteDeEndereco === "Aprovado" &&
      userData.fotosDosDocumentos.fotoDoDocumento === "Aprovado" &&
      userData.fotosDosDocumentos.fotoDoUsuario === "Aprovado"
    ) {
      temp.situacao = "Aprovado";
    }

    setUserData({ ...temp });
    await firestore.collection("usuarios").doc(userId).update(userData);
    handleClose();
  };

  const reprove = async (img, url) => {
    const temp = userData;

    const imgValue = imageModal.img || img;
    switch (imgValue) {
      case "end":
        temp.fotosDosDocumentos.fotoDoComprovanteDeEndereco = "Reprovado";
        break;
      case "doc":
        temp.fotosDosDocumentos.fotoDoDocumento = "Reprovado";
        break;
      case "self":
        temp.fotosDosDocumentos.fotoDoUsuario = "Reprovado";
        break;
      case "logo":
        temp.fotosDosDocumentos.imagemDaLogoMarca = "Reprovado";
        break;
      default:
        break;
    }
    // imageModal.img === "end"
    //   ? (temp.fotosDosDocumentos.fotoDoComprovanteDeEndereco = "Reprovado")
    //   : imageModal.img === "doc"
    //   ? (temp.fotosDosDocumentos.fotoDoDocumento = "Reprovado")
    //   : (temp.fotosDosDocumentos.fotoDoUsuario = "Reprovado");
    temp.situacao = "Pendente";

    setUserData({ ...temp });
    await firestore.collection("usuarios").doc(userId).update(userData);
    await sendNotification(
      "Alguns dos seus documentos não passaram na nossa análise. Por favor entre no nosso aplicativo e reenvie os que forem necessários.",
      userId,
      "Houve um problema com seus documentos"
    );
    handleClose();
  };

  const createWallet = async () => {
    const aux = userData;
    aux.situacao = "Aprovado";
    const agency = await getRegiobyAgency(userData.agencia);
    const walletData =
      userData.tipoDeUsuario === "Pessoa Física"
        ? {
            agencia: userData.agencia,
            conta: await getWalletNumbers(agency),
            cpf: userData.cpf,
            idUsuario: userId,
            nomeUsuario: userData.nome,
            saldoCashback: 0,
            saldoCashbackAcumulado: 0,
            saldoTotalDisponivel: 0,
            temCartaoFisico: "Não solicitado",
            tipoDeUsuario: userData.tipoDeUsuario,
            usuario: firestore.collection("usuarios").doc(userId),
          }
        : {
            agencia: userData.agencia,
            conta: await getWalletNumbers(agency),
            cnpj: userData.cnpj,
            idUsuario: userId,
            nomeUsuario: userData.nome,
            razaoSocial: userData.razaoSocial,
            saldoCashback: 0,
            saldoCashbackAcumulado: 0,
            saldoTotalDisponivel: 0,
            temCartaoFisico: "Não solicitado",
            tipoDeUsuario: userData.tipoDeUsuario,
            usuario: firestore.collection("usuarios").doc(userId),
          };
    setNewCollectionDoc("carteirasDigitais", walletData, userId);
    setUserData(aux);
    window.location.reload();
  };

  const Buttons = ({ user, keyValue, img, url }) => {
    return (
      <div className="modal-buttons">
        {(user.fotosDosDocumentos[keyValue] === "Enviado" ||
          user.fotosDosDocumentos[keyValue] === "Reprovado") && (
          <Button
            className="approve"
            onClick={() => {
              approve(img, url);
            }}
          >
            Aprovar
          </Button>
        )}
        {user.fotosDosDocumentos[keyValue] === "Aprovado" && (
          <Button
            className="reprove"
            onClick={() => {
              reprove(img, url);
            }}
          >
            Reprovar
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="section">
        {userData && userData.fotosDosDocumentos ? (
          <>
            <div className="client-images">
              {userData &&
                userData.fotosDosDocumentos &&
                (userData.fotosDosDocumentos.urlFotoDoComprovanteDeEndereco ||
                  userData.fotosDosDocumentos
                    .urFotoDoComprovanteDeEndereco) && (
                  <div className="client-image">
                    <h3>Comprovante de Endereço</h3>
                    <Button
                      onClick={() =>
                        handleOpen(
                          "end",
                          userData.fotosDosDocumentos
                            .urlFotoDoComprovanteDeEndereco
                        )
                      }
                      className={
                        userData.fotosDosDocumentos
                          .fotoDoComprovanteDeEndereco === "Enviado"
                          ? "alert"
                          : userData.fotosDosDocumentos
                              .fotoDoComprovanteDeEndereco === "Reprovado"
                          ? "fail"
                          : "success"
                      }
                    >
                      <img
                        src={
                          userData.fotosDosDocumentos
                            .urlFotoDoComprovanteDeEndereco
                        }
                        alt="Foto de endereço"
                      />{" "}
                      <p>
                        {
                          userData.fotosDosDocumentos
                            .fotoDoComprovanteDeEndereco
                        }
                      </p>
                    </Button>
                    <Buttons
                      img={"end"}
                      url={
                        userData.fotosDosDocumentos
                          .urlFotoDoComprovanteDeEndereco
                      }
                      user={userData}
                      keyValue={"fotoDoComprovanteDeEndereco"}
                    />
                  </div>
                )}
              {userData &&
                userData.fotosDosDocumentos &&
                userData.fotosDosDocumentos.urlFotoDoDocumento && (
                  <div className="client-image">
                    <h3>Documento</h3>
                    <Button
                      onClick={() =>
                        handleOpen(
                          "doc",
                          userData.fotosDosDocumentos.urlFotoDoDocumento
                        )
                      }
                      className={
                        userData.fotosDosDocumentos.fotoDoDocumento ===
                        "Enviado"
                          ? "alert"
                          : userData.fotosDosDocumentos.fotoDoDocumento ===
                            "Reprovado"
                          ? "fail"
                          : "success"
                      }
                    >
                      <img
                        src={userData.fotosDosDocumentos.urlFotoDoDocumento}
                        alt="Foto do documento"
                      />
                      <p>{userData.fotosDosDocumentos.fotoDoDocumento}</p>
                    </Button>
                    <Buttons
                      img={"doc"}
                      url={userData.fotosDosDocumentos.urlFotoDoDocumento}
                      user={userData}
                      keyValue={"fotoDoDocumento"}
                    />
                  </div>
                )}
              {userData &&
                userData.fotosDosDocumentos &&
                userData.fotosDosDocumentos.urlFotoDoUsuario && (
                  <div className="client-image">
                    <h3>Foto do Usuário</h3>
                    <Button
                      onClick={() =>
                        handleOpen(
                          "self",
                          userData.fotosDosDocumentos.urlFotoDoUsuario
                        )
                      }
                      className={
                        userData.fotosDosDocumentos.fotoDoUsuario === "Enviado"
                          ? "alert"
                          : userData.fotosDosDocumentos.fotoDoUsuario ===
                            "Reprovado"
                          ? "fail"
                          : "success"
                      }
                    >
                      <img
                        src={userData.fotosDosDocumentos.urlFotoDoUsuario}
                        alt="Selfie"
                      />{" "}
                      <p>
                        {userData.fotosDosDocumentos.fotoDoUsuario === "Enviado"
                          ? "Em análise"
                          : userData.fotosDosDocumentos.fotoDoUsuario ===
                            "Reprovado"
                          ? "Reprovado"
                          : "Aprovado"}
                      </p>
                    </Button>
                    <Buttons
                      img={"self"}
                      url={userData.fotosDosDocumentos.urlFotoDoUsuario}
                      user={userData}
                      keyValue={"fotoDoUsuario"}
                    />
                  </div>
                )}
              {userData &&
                userData.fotosDosDocumentos &&
                userData.fotosDosDocumentos.urlImagemDaLogoMarca && (
                  <div className="client-image">
                    <h3>Logomarca</h3>
                    <Button
                      onClick={() =>
                        handleOpen(
                          "logo",
                          userData.fotosDosDocumentos.urlImagemDaLogoMarca
                        )
                      }
                      className={
                        userData.fotosDosDocumentos.imagemDaLogoMarca ===
                        "Enviado"
                          ? "alert"
                          : userData.fotosDosDocumentos.imagemDaLogoMarca ===
                            "Reprovado"
                          ? "fail"
                          : "success"
                      }
                    >
                      <img
                        src={userData.fotosDosDocumentos.urlImagemDaLogoMarca}
                        alt="Selfie"
                      />
                      <p>
                        {userData.fotosDosDocumentos.imagemDaLogoMarca ===
                        "Enviado"
                          ? "Em análise"
                          : userData.fotosDosDocumentos.imagemDaLogoMarca ===
                            "Reprovado"
                          ? "Reprovado"
                          : "Aprovado"}
                      </p>
                    </Button>
                    <Buttons
                      img={"logo"}
                      url={userData.fotosDosDocumentos.urlImagemDaLogoMarca}
                      user={userData}
                      keyValue={"imagemDaLogoMarca"}
                    />
                  </div>
                )}
            </div>
            {userData.fotosDosDocumentos.fotoDoComprovanteDeEndereco ===
              "Aprovado" &&
            userData.fotosDosDocumentos.fotoDoDocumento === "Aprovado" &&
            userData.fotosDosDocumentos.fotoDoUsuario === "Aprovado" &&
            !userData.possuiCarteira ? (
              <>
                {userData.tipoDeUsuario === "Pessoa Jurídica" && (
                  <div className="create-wallet">
                    <p>Finalizar e criar a Carteira Digital deste cliente</p>
                    <Button
                      className="button-supervisor"
                      disabled
                      onClick={() => createWallet()}
                    >
                      Tornar supervisor
                    </Button>
                    <Button
                      className="button-loja"
                      onClick={() => {
                        props.handleOpen("Loja");
                      }}
                    >
                      Tornar Loja e Finalizar
                    </Button>
                  </div>
                )}
                {userData.tipoDeUsuario === "Pessoa Física" && (
                  <div className="create-wallet">
                    <p>Finalizar e criar a Carteira Digital deste cliente</p>
                    <Button
                      className="button-supervisor"
                      onClick={() => createWallet()}
                    >
                      Criar Carteira Digital
                    </Button>
                  </div>
                )}
              </>
            ) : null}
          </>
        ) : null}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="default-modal"
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className="modal-container">
              <div className="modal-image">
                <img src={imageModal.url} alt="imagem" />
              </div>
              <div className="modal-buttons">
                <Button className="approve" onClick={() => approve()}>
                  Aprovar
                </Button>
                <Button className="reprove" onClick={() => reprove()}>
                  Reprovar
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
      </section>
    </>
  );
};

export default ApproveImages;
