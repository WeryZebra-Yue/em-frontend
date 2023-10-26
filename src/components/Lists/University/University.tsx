import { useEffect, useState } from "react";
import styles from "./University.module.css";
import { updateUniversity } from "../../../services/admin.service";
import { toastify } from "../../../utils/general.helper";
import Button from "../../Button";

function University({ name, distance, index, _id, _setDistance }: any) {
  const [loading, setLoading] = useState(false);
  const [distance_, setDistance] = useState<string | null>(distance);
  useEffect(() => {});
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (loading) return;
          setLoading(true);
          console.log(distance_, distance);
          if (distance_ === distance) {
            setLoading(false);
            toastify("No changes made", "info");
            return;
          }
          await updateUniversity({
            _id: _id,
            distance: distance_,
          })
            .then(() => {
              setLoading(false);
              _setDistance(distance_);
              toastify("Updated Successfully", "success");
            })
            .catch(() => {
              setLoading(false);
              toastify("Something went wrong", "error");
            });
        }}
      >
        <div className={styles.component}>
          <div className={styles.lable + " "}>{index + 1}.</div>
          <div
            className={styles.inputBox}
            id="email"
            placeholder="Name"
            style={{
              textAlign: "left",
              margin: "10px",
              marginBottom: "20px",
            }}
          >
            {name}
          </div>

          <input
            required
            type={"text"}
            className={styles.inputBox}
            placeholder="Distance"
            defaultValue={distance}
            onChange={(e) => setDistance(e.target.value)}
            id="distance"
          />
          <Button
            className={styles.button + " "}
            variant={"outlined"}
            type={"submit"}
          >
            Change
          </Button>
        </div>
      </form>
    </div>
  );
}

export default University;
