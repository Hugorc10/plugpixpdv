import React, { useState } from "react";
import { useModal } from "./modalContext";
import {
  ModalBackground,
  ModalBox,
  ModalButton,
  ModalBody,
  ModalHeader,
  Icon,
  RotateCamera,
} from "./styled";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import ImagePreview from "./imagePreview";

function Modal() {
  const modal = useModal();
  const [image, setImage] = useState(null);
  const [cameraEnviroment, setCameraEnviroment] = useState(false);
  const close = () => {
    setImage(null);
    modal.setOpen(false);
    window.document.body.style.overflow = "auto";
    window.document.getElementById("root").style.overflow = "auto";
  };

  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    setImage(dataUri);
  }

  if (!modal.open) return null;
  return (
    <>
      <ModalBackground className={modal.type} onClick={close} />
      <ModalBox className={modal.type}>
        {/* <ModalClose onClick={close}>X</ModalClose> */}
        {!!modal.header && <ModalHeader>{modal.header}</ModalHeader>}
        {!!modal.content && (
          <ModalBody className={`${!modal.type ? "no-icon" : ""}`}>
            {modal.type && <Icon className={modal.type || ""} />}
            {modal.content}
            {modal.type === "camera" && (
              <Camera
                imageType="IMAGE_TYPES.JPG"
                onTakePhoto={(dataUri) => {
                  handleTakePhoto(dataUri);
                }}
              />
            )}
          </ModalBody>
        )}
        {modal.type === "camera" && (
          <>
            {image ? (
              <>
                <ImagePreview dataUri={image} isFullscreen={false} />
                <div className="d-flex justify-content-center w-100 button-previews">
                  <button
                    className="button-photo"
                    type="button"
                    onClick={() => setImage(null)}
                  >
                    REPETIR
                  </button>
                  <button
                    className="button-photo"
                    type="button"
                    onClick={() => {
                      if (modal.action.click) {
                        modal.action.click(image);
                        close();
                      }
                    }}
                  >
                    ENVIAR
                  </button>
                </div>
              </>
            ) : (
              <>
                <Camera
                  idealFacingMode={
                    cameraEnviroment
                      ? FACING_MODES.ENVIRONMENT
                      : FACING_MODES.USER
                  }
                  isImageMirror={!cameraEnviroment}
                  isFullscreen={false}
                  idealResolution={{ width: 640, height: 480 }}
                  onTakePhoto={(dataUri) => {
                    handleTakePhoto(dataUri);
                  }}
                />
                <RotateCamera
                  type="button"
                  onClick={() => setCameraEnviroment((prev) => !prev)}
                />
              </>
            )}
          </>
        )}
        {!!modal.action && modal.action.title && (
          <ModalButton
            type="button"
            onClick={(e) =>
              modal.action.click ? modal.action.click() : close()
            }
          >
            {modal.action.title}
          </ModalButton>
        )}
      </ModalBox>
    </>
  );
}

export default Modal;
