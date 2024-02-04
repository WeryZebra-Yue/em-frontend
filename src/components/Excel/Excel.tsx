import {
  Box,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./Excel.module.css";
import Button from "../Button";
import { addExaminer } from "../../services/admin.service";
import { dismissToastie, toastify } from "../../utils/general.helper";
function Excel(props: any) {
  const [examiner, setExaminer] = useState<any>([]);
  const [confirmation, setConfirmation] = useState<any>([]);
  useEffect(() => {
    setConfirmation(
      Array.from({ length: props.examiner.length }, () => {
        return true;
      })
    );
    console.log(
      Array.from({ length: props.examiner.length }, () => {
        return true;
      })
    );
  }, [props.examiner]);
  useEffect(() => {
    let temp = examiner;
    setExaminer(temp);
  }, [props.examiner]);

  return (
    <Dialog
      open={props.open}
      // onClose={props.onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "rgb(233, 233, 233)",
        },
      }}
      // size
      maxWidth="xl"
    >
      <DialogTitle
        style={{
          paddingBottom: 0,
        }}
      >
        Bulk Add
        <DialogContentText>Please click checkmark to confirm</DialogContentText>
      </DialogTitle>
      <Box className="modalBox" sx={{ overflowX: "scroll" }}>
        {
          examiner && (
            <>
              <table className={styles.table}>
                <tr>
                  <th>Department</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>College Email</th>
                  <th>Personal Email</th>
                  <th>Institute</th>
                  <th>Role</th>
                  <th>IFSC</th>
                  <th>Bank Name</th>
                  <th>Account Number</th>
                  <th>Remarks</th>
                  {/* <th>Confirm</th> */}
                </tr>

                {props.examiner &&
                  props.examiner.map((item: any) => {
                    return (
                      <tr
                        style={{
                          background:
                            item.remarks && item.remarks.length > 0
                              ? "rgba(255, 0, 0, 0.1)"
                              : "",
                        }}
                      >
                        <td align="left">
                          <input
                            type="text"
                            defaultValue={item.e_id}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          {" "}
                          <input
                            type="text"
                            defaultValue={item.personalDetails.name}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          {" "}
                          <input
                            type="text"
                            defaultValue={item.personalDetails.phonenumber}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          <input
                            type="text"
                            defaultValue={item.personalDetails.collegeemail}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          {" "}
                          <input
                            type="text"
                            defaultValue={item.personalDetails.personalEmail}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          <input
                            type="text"
                            defaultValue={item.instituteDetails.institutename}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          {" "}
                          <input
                            type="text"
                            defaultValue={item.instituteDetails.role}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          {" "}
                          <input
                            type="text"
                            defaultValue={item.bankDetails.ifscCode}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          {" "}
                          <input
                            type="text"
                            defaultValue={item.bankDetails.bankName}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          {" "}
                          <input
                            type="text"
                            defaultValue={item.bankDetails.accountNumber}
                            className={styles.td}
                          />
                        </td>
                        <td align="left">
                          {item.remarks &&
                            item.remarks.map((item: any) => {
                              return (
                                <li
                                  style={{
                                    padding: "5px",
                                    borderRadius: "5px",
                                    minWidth: "200px",
                                  }}
                                >
                                  {item}
                                </li>
                              );
                            })}
                        </td>
                        <td align="left">
                          {/* <Checkbox
                            disabled={item.remarks && item.remarks.length > 0}
                            checked={
                              item.remarks &&
                              item.remarks.length > 0 &&
                              confirmation[examiner.indexOf(item)]
                            }
                            color="success"
                            onChange={(e) => {
                              let temp = confirmation;
                              temp[examiner.indexOf(item)] = e.target.checked;
                              setConfirmation(temp);
                            }}
                          /> */}
                        </td>
                      </tr>
                    );
                  })}
              </table>
            </>
          )
          // e_id: item.Code,
          // personalDetails: {
          //   name: item.Name,
          //   phonenumber: item.Mobile,
          //   collegeemail: item["Institute Mail"],
          //   personalEmail: item["Personal Email"],
          // },
          // instituteDetails: {
          //   institutename: item.Institute,
          //   role: item["Role of faculty"],
          // },
          // bankDetails: {
          //   ifscCode: item.IFSC,
          //   bankName: item["Bank Name"],
          //   accountNumber: item["Account No."],
          //   branch: item.Branch,
          // },
        }
      </Box>
      <DialogActions>
        <Button
          className={styles.cancel}
          style={{
            marginRight: "10px",
            background: "var(--danger)",
          }}
          onClick={() => {
            props.onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          className={styles.confirm}
          variant="outlined"
          style={{
            background: "var(--primary)",
          }}
          disabled={
            confirmation.filter((item: any) => {
              return item === false;
            }).length > 0
          }
          onClick={async () => {
            const examiner = props.examiner;
            for (let i = 0; i < confirmation.length; i++) {
              if (confirmation[i] !== false) {
                toastify(`Adding examiners`, "info", {
                  loading: true,
                  autoClose: false,
                });
                console.log(examiner[i]);
                const task = await addExaminer({
                  user: examiner[i],
                });
                if (task) {
                  // props.setExaminers([...props.examiners, examiner[i]]);
                  // localStorage.setItem(
                  //   "examiners",
                  //   JSON.stringify([...props.examiners, examiner[i]])
                  // );

                  props.onClose();
                  dismissToastie();
                  toastify(
                    "Examiner added successfully. It'll be updated on refresh.",
                    "success",
                    {
                      autoClose: 1000,
                    }
                  );
                }
              }
            }
            // props.onClose();

            // if (task) {
            //   newData.push(res);
            //   setExaminers([...examiners, res]);
            //   localStorage.setItem(
            //     "examiners",
            //     JSON.stringify([...examiners, res])
            //   );
            //   toastify("Examiner added successfully.", "success", {
            //     autoClose: 1000,
            //   });
            // }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Excel;
