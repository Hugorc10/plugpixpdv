import React, { useContext, useState, createContext } from "react";

const ModalContext = createContext();

const ModalProvider = (props) => {
  const [open, setOpenModal] = useState(false);
  const [content, setContent] = useState(null);
  const [header, setHeader] = useState(null);
  const [action, setAction] = useState(null);
  const [type, setType] = useState(null);

  const setOpen = (value) => {
    window.document.body.style.overflow = "hidden";
    window.document.getElementById("root").style.overflow = "hidden";
    setOpenModal(value);
  };

  return (
    <ModalContext.Provider
      value={{
        open,
        setOpen,
        content,
        setContent,
        header,
        setHeader,
        action,
        setAction,
        type,
        setType,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModal must be used within a provider ModalProvider");

  return { ...context };
};

export default ModalProvider;
