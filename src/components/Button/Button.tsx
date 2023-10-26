import { Button as MUIButton, Tooltip } from "@mui/material";

import styles from "./Button.module.css";
import { useState } from "react";

function Button(props: any) {
  const [, setInnerWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setInnerWidth(window.innerWidth);
  });
  return (
    <Tooltip
      title={window.innerWidth < 770 || props.show ? props.id : ""}
      sx={{
        fontFamily: "Poppins",
      }}
    >
      <MUIButton
        id={props.id}
        type={props.type}
        className={
          styles.button +
          " " +
          props.className +
          " " +
          (props.round ? styles.round : "") +
          " " +
          (props.notselected ? styles.notselected : "") +
          " " +
          (props.error ? styles.error : "") +
          " " +
          (props.disabled ? styles.disabled : "") +
          " " +
          (props.responsive && window.innerWidth < 770 ? styles.responsive : "")
        }
        style={props.style}
        onClick={props.onClick}
        variant={props.variant}
        disabled={props.disabled}
        children={
          props.responsive && window.innerWidth < 770
            ? props.startIcon
            : props.children
        }
        startIcon={
          props.responsive && window.innerWidth < 770 ? null : props.startIcon
        }
        endIcon={
          props.responsive && window.innerWidth < 770 ? null : props.endIcon
        }
        autoFocus={props.autoFocus}
        aria-label={props.ariaLabel}
        hidden={props.hidden}
      />
    </Tooltip>
  );
}

export default Button;
