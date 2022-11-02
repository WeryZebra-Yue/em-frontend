import React from "react";
import styles from "./Header.module.css";
import logo from "../../Assets/General/Images/logo.png";
import { useHistory } from "react-router-dom";
function Header() {
  const history = useHistory();
  return (
    <div className={styles.Header}>
      <div>
        <img
          onClick={() => {
            history.push("/");
          }}
          src={logo}
        />
      </div>
    </div>
  );
}

export default Header;
