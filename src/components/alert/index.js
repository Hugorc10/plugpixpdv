import React from "react";
import { useAlert } from "./alertContext";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert() {
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const alert = useAlert();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    alert.setOptions({
      open: false,
      type: "success",
      time: 1500,
    });
  };
  if (!alert.options.open) return null;
  return (
    <>
      <Snackbar
        open={alert.options.open}
        autoHideDuration={alert.options.time}
        onClose={handleClose}
      >
        <Alert severity={alert.options.type}>{alert.options.message}</Alert>
      </Snackbar>
    </>
  );
}

export default Alert;
