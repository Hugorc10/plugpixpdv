import React, { useContext, useState, createContext } from "react";

const AlertContext = createContext();

const ModalProvider = (props) => {
  const [options, setOptions] = useState({
    open: false,
    type: "success",
    time: 3000,
  });

  return (
    <AlertContext.Provider
      value={{
        options,
        setOptions,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error("useModal must be used within a provider ModalProvider");

  return { ...context };
};

export default ModalProvider;
