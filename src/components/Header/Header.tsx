import styles from "./Header.module.css";
import logo from "../../Assets/General/Images/logo.png";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={styles.header}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <img onClick={() => navigate("/")} src={logo} />
      </div>
    </>
  );
}

export default Header;
