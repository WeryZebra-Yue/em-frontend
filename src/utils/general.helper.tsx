import { toast } from "react-toastify";
import { Alert, AlertColor } from "@mui/material";

export const toastify = (message: string, type: AlertColor, props?: any) => {
  toast(
    <>
      <Alert
        severity={type}
        style={{
          borderRadius: "10px",
          fontWeight: "600",
        }}
        sx={{ width: "100%" }}
        aria-label={`${message}`}
        aria-activedescendant={`${message}`}
      >
        {message}
      </Alert>
    </>,
    {
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
      // top right bottom left
      position: "bottom-right",

      ...props,
    }
  );
};

export const dismissToastie = () => {
  toast.dismiss();
};
