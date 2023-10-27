import styles from "./Header.module.css";
import logo from "../../assets/General/Images/logo.png";
import { useNavigate } from "react-router-dom";
function FHeader() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={styles.header}
        style={{
          position: "unset",
          top: 0,
          left: 0,
        }}
      >
        <img onClick={() => navigate("/dashboard")} src={logo} />
      </div>
    </>
  );
}

export default FHeader;
