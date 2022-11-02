import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./Popup.module.css";
import Loader from "react-loader";
function ImagePopup({ open, link, closePopup }) {
  const [Load, setLoad] = React.useState(false);
  async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "image file name here";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <Popup
      open={open}
      onClose={closePopup}
      contentStyle={{
        // background: "none",
        borderRadius: "10px",
        minWidth: "50%",
      }}
      modal
    >
      {/* crps */}
      <div className={styles.popupWrapper}>
        <div className={styles.close}>
          <button onClick={closePopup}>&times;</button>
        </div>
        <img
          className={styles.popupimage}
          src={link}
          alt="img"
          onLoad={() => {
            setLoad(true);
          }}
          lazyload="true"
        />
      </div>
      <Loader loaded={Load} />
      <div className={styles.download}>
        <button
          onClick={() => {
            downloadImage(link);
          }}
          className={styles.downloadbutton}
        >
          Download
        </button>
      </div>
    </Popup>
  );
}

export default ImagePopup;
