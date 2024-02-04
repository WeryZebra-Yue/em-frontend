import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import Button from "../Button";
import { dismissToastie, toastify } from "../../utils/general.helper";
import { AssignmentRounded } from "@mui/icons-material";

import { addAssign, updateExaminer } from "../../services/admin.service";
import { form_input } from "../../utils/general.schema";
import {
  InputEle,
  ORDivider,
  SimpleDivider,
  Title,
} from "../InputEle/InputEle";
import styles from "./Form.module.css";
function Form(props: any) {
  const [total, setTotal] = useState<any>(0);
  const [_area, setArea] = useState<any>("");
  const [examiner, setExaminer] = useState<any>(null);
  const [oldExaminer, setOldExaminer] = useState<any>(null);
  const [universities, setUniversities] = useState<any>({});
  const [areaofinterest, setAreaofinterest] = useState<any>(
    examiner?.areaofinterest || []
  );
  const [_id = null, setId] = useState<any>(null);
  useEffect(() => {
    if (!(props.examiner && props.universities)) return;
    const _temp = { ...props.examiner };
    setId(props.examiner._id);
    setUniversities(props.universities);
    Object.entries(props.examiner).map(([accessor, value]: any) => {
      if (accessor === "roles") return;
      if (accessor === "e_id") return;
      if (typeof value === "object") {
        Object.entries(value).map(([subkey, subvalue]: any) => {
          if (typeof subvalue === "object") return;
          _temp[`${accessor}.${subkey}`] = subvalue;
        });
      }
      delete _temp[accessor];
    });
    _temp["travelDetails.manual"] = 0;
    _temp["travelDetails.city"] =
      _temp["instituteDetails.institutename"]?.split(",")[1];
    _temp["travelDetails.kilometres"] = props?.universities?.find(
      (uni: any) => uni.name === _temp["instituteDetails.institutename"]
    )?.distance;
    if (_temp["travelDetails.kilometres"]) {
      _temp["travelDetails.ta"] =
        parseFloat(_temp["travelDetails.kilometres"]) * 20;
      console.log(_temp["travelDetails.ta"]);
    } else _temp["travelDetails.ta"] = 0;
    _temp["travelDetails.da"] = 200;
    _temp["payDetails.total"] =
      _temp["travelDetails.ta"] + _temp["travelDetails.da"];
    setTotal(_temp["payDetails.total"]);
    setAreaofinterest(_temp?.areaofinterest || []);
    setExaminer(_temp);
    setOldExaminer(_temp);
  }, [props.examiner, props.universities]);
  useEffect(() => {
    return () => {
      if (!examiner) return;
      if (examiner["travelDetails.manual"]) {
        setTotal(
          parseInt(examiner["travelDetails.manual"]) +
            parseInt(examiner["travelDetails.da"])
        );
        return;
      }
    };
  }, [examiner ? examiner["travelDetails.manual"] : null]);
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "rgb(233, 233, 233)",
        },
      }}
    >
      <DialogTitle
        style={{
          paddingBottom: 0,
        }}
      >
        Assigning
        <DialogContentText>
          Please re-check the information below before assigning.
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Title title="Required missing Details*" />
        {props.examiner && examiner && (
          <form
            onSubmit={async (e: any) => {
              e.preventDefault();
              console.log(examiner);
              try {
                let url = "/ta-da.html?";
                const _temp = { ...examiner };
                const _updates: any = props.examiner;
                Object.entries(form_input.required).map(
                  ([accessor, value]: any) => {
                    if (accessor.includes(".")) {
                      const [key, subkey] = accessor.split(".");
                      if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                      else {
                        _updates[key] = {
                          ..._updates[key],
                          [subkey]: _temp[accessor],
                        };
                      }
                    }

                    url += `${value.holder}=${_temp[accessor]}&`;
                    console.log(url);
                    delete _temp[accessor];
                  }
                );
                // console.log(
                //   JSON.stringify(_updates) === JSON.stringify(props.examiner),
                //   _updates,
                //   props.examiner
                // );
                // if (
                //   JSON.stringify(_updates) === JSON.stringify(props.examiner)
                // ) {
                //   toastify("No update for examiner", "info");
                // } else {
                toastify("Updating examiner", "info", {
                  loading: true,
                  autoClose: false,
                });
                await updateExaminer({
                  user: {
                    id: _id,
                    ..._updates,
                  },
                });
                dismissToastie();
                toastify("Examiner updated", "success");
                // }

                Object.entries(form_input.form).map(
                  ([accessor, value]: any) => {
                    if (accessor.includes(".")) {
                      const [key, subkey] = accessor.split(".");
                      if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                      else {
                        _temp[key] = {
                          [subkey]: _temp[accessor],
                        };
                      }
                      url += `${value.holder}=${_temp[accessor]}&`;
                      delete _temp[accessor];
                    }
                  }
                );
                Object.entries(form_input.travelled[0]).map(
                  ([accessor, value]: any) => {
                    if (accessor.includes(".")) {
                      const [key, subkey] = accessor.split(".");
                      if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                      else {
                        _temp[key] = {
                          [subkey]: _temp[accessor],
                        };
                      }

                      if (value.holder === "mode") {
                        url += `${value.holder}=${
                          _temp[accessor] == undefined ? "Car" : _temp[accessor]
                        }&`;
                      } else url += `${value.holder}=${_temp[accessor]}&`;
                      delete _temp[accessor];
                    }
                  }
                );
                Object.entries(form_input.travelled[1]).map(
                  ([accessor, value]: any) => {
                    if (accessor.includes(".")) {
                      const [key, subkey] = accessor.split(".");
                      if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                      else {
                        _temp[key] = {
                          [subkey]: _temp[accessor],
                        };
                      }
                      url += `${value.holder}=${_temp[accessor]}&`;
                      delete _temp[accessor];
                    }
                  }
                );
                Object.entries(form_input.payment).map(
                  ([accessor, value]: any) => {
                    if (accessor.includes(".")) {
                      const [key, subkey] = accessor.split(".");
                      if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                      else {
                        _temp[key] = {
                          [subkey]: _temp[accessor],
                        };
                      }
                      url += `${value.holder}=${_temp[accessor]}&`;
                      delete _temp[accessor];
                    }
                  }
                );
                const assignment = {
                  eid: props.examiner.eid,
                  formDetails: {
                    ..._temp["formDetails"],
                  },
                  travelDetails: {
                    ..._temp["travelDetails"],
                    mode:
                      _temp["travelDetails"]["mode"] == undefined
                        ? "Car"
                        : _temp["travelDetails"]["mode"],
                    institute:
                      props.examiner["instituteDetails"]["institutename"],
                    manual: parseInt(_temp["travelDetails"]["manual"]) || 0,
                  },
                  payDetails: {
                    total: total,
                  },
                };
                // toastify("Assigning examiner", "info", {
                //   loading: true,
                //   autoClose: false,
                // });
                // await addAssign(assignment);
                url += `travelled=${_updates["instituteDetails"]["institutename"]}&`;
                url += `conveyer=${assignment["formDetails"]["conveyer"]}&`;
                props.onClose();
                dismissToastie();
                toastify("Examiner assigned", "success");
                window.open(url, "_blank");
              } catch (e: any) {
                console.log(e);
                toastify(e.message, "error");
              }
              // assigning details
            }}
          >
            {Object.entries(form_input.required).map(
              ([accessor, value]: any) => (
                <InputEle
                  _area={_area}
                  value={value}
                  display={true}
                  required={true}
                  setArea={setArea}
                  accessor={accessor}
                  examiner={examiner}
                  setExaminer={setExaminer}
                  oldExaminer={oldExaminer}
                  universities={universities}
                  areaofinterest={areaofinterest}
                  setAreaofinterest={setAreaofinterest}
                />
              )
            )}
            <SimpleDivider />
            <Title title="Assigning Details" />
            {Object.entries(form_input.form).map(([accessor, value]: any) => {
              return (
                <InputEle
                  _area={_area}
                  value={value}
                  required={true}
                  setArea={setArea}
                  accessor={accessor}
                  examiner={examiner}
                  setExaminer={setExaminer}
                  oldExaminer={oldExaminer}
                  universities={universities}
                  areaofinterest={areaofinterest}
                  setAreaofinterest={setAreaofinterest}
                />
              );
            })}
            <SimpleDivider />
            <Title title="Travelling Details" />
            {Object.entries(form_input.travelled[0]).map(
              ([accessor, value]: any) => (
                <InputEle
                  _area={_area}
                  value={value}
                  required={true}
                  setArea={setArea}
                  accessor={accessor}
                  examiner={examiner}
                  setExaminer={setExaminer}
                  oldExaminer={oldExaminer}
                  universities={universities}
                  areaofinterest={areaofinterest}
                  fixed={!(value.disable ? false : true)}
                  setAreaofinterest={setAreaofinterest}
                />
              )
            )}
            <ORDivider />
            {Object.entries(form_input.travelled[1]).map(
              ([accessor, value]: any) => (
                <InputEle
                  _area={_area}
                  value={value}
                  required={value.required}
                  setArea={setArea}
                  accessor={accessor}
                  examiner={examiner}
                  setExaminer={setExaminer}
                  oldExaminer={oldExaminer}
                  universities={universities}
                  areaofinterest={areaofinterest}
                  setAreaofinterest={setAreaofinterest}
                />
              )
            )}
            <SimpleDivider />
            <Title title="Payment Details" />

            <div
              style={{
                display: "flex",
                marginBottom: "10px",
                marginLeft: "20px",
                marginRight: "20px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className={styles.inputLabel}>Total</div>
              <input
                required
                disabled
                id={"payDetails.total"}
                className={styles.inputBox}
                value={`
                ${
                  parseInt(examiner["travelDetails.manual"])
                    ? `${
                        parseInt(examiner["travelDetails.manual"]) +
                        parseInt(examiner["travelDetails.da"])
                      }(Manual Fare)`
                    : examiner["payDetails.total"]
                }`}
              />
            </div>
            <div className={styles.wrapper}>
              <Button
                type="submit"
                value="Submit"
                variant="outlined"
                className={styles.button}
                startIcon={<AssignmentRounded />}
                // onClick={async (e: any) => {
                //   // e.preventDefault();
                //   console.log(e);
                //   try {
                //     const _temp = { ...examiner };
                //     const _updates: any = props.examiner;
                //     Object.entries(form_input.required).map(
                //       ([accessor]: any) => {
                //         if (accessor.includes(".")) {
                //           const [key, subkey] = accessor.split(".");
                //           if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                //           else {
                //             _updates[key] = {
                //               ..._updates[key],
                //               [subkey]: _temp[accessor],
                //             };
                //           }
                //         }
                //         delete _temp[accessor];
                //       }
                //     );
                //     if (
                //       JSON.stringify(_updates) ===
                //       JSON.stringify(props.examiner)
                //     ) {
                //       toastify("No update for examiner", "info");
                //     } else {
                //       toastify("Updating examiner", "info", {
                //         loading: true,
                //         autoClose: false,
                //       });
                //       await updateExaminer({
                //         user: {
                //           id: _id,
                //           ..._updates,
                //         },
                //       });
                //       dismissToastie();
                //       toastify("Examiner updated", "success");
                //     }

                //     Object.entries(form_input.form).map(([accessor]: any) => {
                //       if (accessor.includes(".")) {
                //         const [key, subkey] = accessor.split(".");
                //         if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                //         else {
                //           _temp[key] = {
                //             [subkey]: _temp[accessor],
                //           };
                //         }
                //         delete _temp[accessor];
                //       }
                //     });
                //     Object.entries(form_input.travelled[0]).map(
                //       ([accessor]: any) => {
                //         if (accessor.includes(".")) {
                //           const [key, subkey] = accessor.split(".");
                //           if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                //           else {
                //             _temp[key] = {
                //               [subkey]: _temp[accessor],
                //             };
                //           }
                //           delete _temp[accessor];
                //         }
                //       }
                //     );
                //     Object.entries(form_input.travelled[1]).map(
                //       ([accessor]: any) => {
                //         if (accessor.includes(".")) {
                //           const [key, subkey] = accessor.split(".");
                //           if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                //           else {
                //             _temp[key] = {
                //               [subkey]: _temp[accessor],
                //             };
                //           }
                //           delete _temp[accessor];
                //         }
                //       }
                //     );
                //     Object.entries(form_input.payment).map(
                //       ([accessor]: any) => {
                //         if (accessor.includes(".")) {
                //           const [key, subkey] = accessor.split(".");
                //           if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                //           else {
                //             _temp[key] = {
                //               [subkey]: _temp[accessor],
                //             };
                //           }
                //           delete _temp[accessor];
                //         }
                //       }
                //     );
                //     const assignment = {
                //       eid: props.examiner.eid,
                //       formDetails: {
                //         ..._temp["formDetails"],
                //       },
                //       travelDetails: {
                //         ..._temp["travelDetails"],
                //         mode:
                //           _temp["travelDetails"]["mode"] == undefined
                //             ? "Car"
                //             : _temp["travelDetails"]["mode"],
                //         institute:
                //           props.examiner["instituteDetails"]["institutename"],
                //         manual: parseInt(_temp["travelDetails"]["manual"]) || 0,
                //       },
                //       payDetails: {
                //         total: total,
                //       },
                //     };
                //     console.log(assignment);
                //   } catch (e: any) {
                //     console.log(e);
                //     toastify(e.message, "error");
                //   }
                //   // assigning details
                // }}
              >
                Update & Assign
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default Form;
