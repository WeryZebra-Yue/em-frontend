import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Header from "../../components/Header/FHeader";
import { _input } from "../../utils/general.schema";
import {
  addExaminer,
  getUniversities,
  updateExaminer,
} from "../../services/admin.service";

import styles from "./View.module.css";

import { SET_LOADING } from "../../redux/Auth/AuthActions";
import { Autocomplete, Checkbox } from "@mui/material";
import {
  AddCircleRounded,
  DownloadForOfflineRounded,
  PersonAddRounded,
  RemoveCircleRounded,
  UpdateRounded,
} from "@mui/icons-material";
import Button from "../../components/Button";
import { dismissToastie, toastify } from "../../utils/general.helper";
import { uploadImage } from "../../services/storage.service";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function View() {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [_id = null, setId] = useState<any>(null);
  const [newExaminer, setNewExaminer] = useState<any>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [areaofinterest, setAreaofinterest] = useState<any[]>([]);
  const [_area, setArea] = useState<any>("");
  useEffect(() => {
    console.log(id);
    async function fetchData() {
      dispatch({
        type: SET_LOADING,
        payload: true,
      });
      const _universities = await getUniversities();
      if (!localStorage.getItem("universities"))
        localStorage.setItem("universities", JSON.stringify(_universities));
      setUniversities(JSON.parse(localStorage.getItem("universities") || "{}"));
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
    }
    if (!localStorage.getItem("examiners")) fetchData();
    else
      setUniversities(JSON.parse(localStorage.getItem("universities") || "{}"));
    if (id) {
      const _examiners = JSON.parse(localStorage.getItem("examiners") || "{}");
      const examiner = _examiners.filter(
        (examiner: any) =>
          examiner?.eid?.toString()?.toLowerCase() ===
          id?.toString()?.toLowerCase()
      );
      if (examiner.length === 0) {
        navigate("/add");
      } else {
        const _temp = { ...examiner[0] };
        setId(examiner[0]._id);
        Object.entries(examiner[0]).map(([accessor, value]: any) => {
          if (accessor === "roles") return;
          if (typeof value === "object") {
            Object.entries(value).map(([subkey, subvalue]: any) => {
              if (typeof subvalue === "object") return;
              _temp[`${accessor}.${subkey}`] = subvalue;
            });
          }
          delete _temp[accessor];
        });
        setAreaofinterest(_temp?.areaofinterest || []);
        setNewExaminer(_temp);
      }
    } else {
      setNewExaminer({
        e_id: "SOE",
      });
    }

    window.onbeforeunload = () => true;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return (
    <div>
      <Header />
      {newExaminer && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className={styles.title}>New Examiner</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "center",
              backgroundColor: "#e9e9e9",
              padding: "20px",
              borderRadius: "10px",
              margin: "10px",
            }}
          >
            <form>
              {Object.entries(_input).map(([accessor, value]: any) => {
                return (
                  <div
                    hidden={value.hide}
                    style={{
                      marginBottom: "10px",
                      marginLeft: "20px",
                      marginRight: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>{value.label}</div>
                    {value.type === "select" ? (
                      <select
                        name={accessor}
                        id={accessor}
                        defaultValue={newExaminer[accessor]}
                        className={styles.select}
                        onChange={(e) => {
                          setNewExaminer({
                            ...newExaminer,
                            [accessor]: e.target.value,
                          });
                        }}
                      >
                        {value?.category.map((cate: any) => (
                          <option value={cate}>{cate}</option>
                        ))}
                      </select>
                    ) : value.type === "institute" ? (
                      <Autocomplete
                        className="custom-autocomplete"
                        options={Object.values(universities)}
                        getOptionLabel={(option: any) => option.name}
                        renderInput={(params) => (
                          <div ref={params.InputProps.ref}>
                            <input
                              type="text"
                              {...params.inputProps}
                              placeholder="Institute Name"
                              className={styles.inputBox}
                              value={newExaminer[accessor]}
                            />
                          </div>
                        )}
                        // value={"P P Savani School of Engoineering, Kosamba"}
                        onChange={(e, value) => {
                          console.log(e);
                          setNewExaminer({
                            ...newExaminer,
                            [accessor]: value.name,
                          });
                          console.log({ [accessor]: value.name });
                        }}
                      />
                    ) : value.type === "multiple" ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {areaofinterest.map((area: any) => (
                          <div className={styles.areaofinterest}>
                            <div className={styles.areaofinterestText}>
                              {area}
                            </div>
                            <div
                              onClick={() => {
                                setAreaofinterest(
                                  areaofinterest.filter((a) => a !== area)
                                );
                              }}
                            >
                              <RemoveCircleRounded
                                fontSize="small"
                                style={{
                                  cursor: "pointer",
                                  color: "#B23B3B",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        <div style={{}} className={styles.wrapperArea}>
                          <input
                            required
                            type="text"
                            id={accessor}
                            defaultValue={_area}
                            onChange={(e) => {
                              setArea(e.target.value);
                            }}
                            placeholder={value.label}
                            className={styles.inputBox}
                          />
                          <AddCircleRounded
                            onClick={() => {
                              setAreaofinterest([...areaofinterest, _area]);
                              setArea("");
                              setNewExaminer({
                                ...newExaminer,
                                [accessor]: [...areaofinterest, _area],
                              });
                            }}
                            style={{
                              cursor: "pointer",
                              color: "#3BB23B",
                            }}
                          />
                        </div>
                      </div>
                    ) : value.type === "checkbox" ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {value?.category?.map((cate: any) => (
                          <div
                            className={styles.areaofinterest}
                            onClick={() => {
                              console.log(
                                newExaminer[accessor]
                                  .map((a: any) => a.toLowerCase())
                                  ?.includes(cate.toLowerCase()),
                                cate
                              );
                            }}
                          >
                            <div>{cate}</div>
                            <div>
                              <Checkbox
                                defaultChecked={newExaminer[accessor]
                                  ?.map((a: any) => a?.toLowerCase())
                                  ?.includes(cate?.toLowerCase())}
                                onChange={(e) => {
                                  if (e.target.checked)
                                    if (newExaminer[accessor])
                                      setNewExaminer({
                                        ...newExaminer,
                                        [accessor]: [
                                          ...newExaminer[accessor],
                                          cate,
                                        ],
                                      });
                                    else
                                      setNewExaminer({
                                        ...newExaminer,
                                        [accessor]: [cate],
                                      });
                                  else
                                    setNewExaminer({
                                      ...newExaminer,
                                      [accessor]: newExaminer[accessor].filter(
                                        (a: any) => a !== cate
                                      ),
                                    });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          required
                          id={accessor}
                          defaultValue={
                            value.type === "file" ? "" : newExaminer[accessor]
                          }
                          type={value.type}
                          className={styles.inputBox}
                          placeholder={value.label}
                          onChange={(e) => {
                            setNewExaminer({
                              ...newExaminer,
                              [accessor]:
                                value.type === "file"
                                  ? e.target.files
                                    ? e.target.files[0]
                                    : null
                                  : e.target.value,
                            });
                          }}
                          {...(value.type === "number" && {
                            max: 10,
                          })}
                          {...(value.type === "file" && {
                            multiple: false,
                            accept: "image/*,application/pdf",
                          })}
                        />
                        {value.type === "file" && (
                          <DownloadForOfflineRounded
                            style={{
                              cursor: newExaminer[accessor]
                                ? "pointer"
                                : "default",
                              color: newExaminer[accessor]
                                ? "#3BB23B"
                                : "inherit",
                            }}
                            onClick={async () => {
                              if (newExaminer[accessor]) {
                                toastify("Downloading file", "info", {
                                  autoClose: false,
                                  loading: true,
                                });

                                const response = await axios.get(
                                  newExaminer[accessor],
                                  {
                                    responseType: "arraybuffer",
                                  }
                                );
                                dismissToastie();
                                toastify("Downloaded file", "success", {
                                  autoClose: 1000,
                                });
                                const blob = new Blob([response.data], {
                                  type: newExaminer[accessor].includes(".pdf")
                                    ? "application/pdf"
                                    : "image/jpeg",
                                });
                                const link = document.createElement("a");
                                link.href = window.URL.createObjectURL(blob);
                                link.download = newExaminer[accessor].includes(
                                  ".pdf"
                                )
                                  ? `${accessor}.pdf`
                                  : `${accessor}.jpeg`;
                                link.click();
                              }
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <Button
                variant="outlined"
                style={{
                  width: "100%",
                  marginTop: "20px",
                  backgroundColor: "#ffaa46",
                }}
                onClick={async () => {
                  try {
                    const _temp = { ...newExaminer };
                    const _examiners = JSON.parse(
                      localStorage.getItem("examiners") || "{}"
                    );
                    Object.entries(_input).map(([accessor]: any) => {
                      if (accessor.includes(".")) {
                        const [key, subkey] = accessor.split(".");
                        if (_temp[key]) _temp[key][subkey] = _temp[accessor];
                        else {
                          _temp[key] = {
                            [subkey]: _temp[accessor],
                          };
                        }
                        delete _temp[accessor];
                      }
                    });
                    _examiners.map((examiner: any) => {
                      if (id) return;
                      if (!_temp?.personalDetails?.name)
                        throw new Error("Please enter name");
                      if (!_temp?.personalDetails?.collegeemail)
                        throw new Error("Please enter institute email");
                      if (!_temp?.personalDetails?.phonenumber)
                        throw new Error("Please enter contact number");
                      if (!_temp?.personalDetails?.personalEmail)
                        throw new Error("Please enter personal email");

                      if (
                        examiner?.personalDetails?.name
                          ?.toString()
                          .toLowerCase()
                          .replace(/\s/g, "") ===
                        _temp?.personalDetails?.name
                          ?.toString()
                          .toLowerCase()
                          .replace(/\s/g, "")
                      ) {
                        toastify("Name exists", "warning");
                      }
                      if (
                        examiner?.personalDetails?.collegeemail
                          ?.toString()
                          .toLowerCase()
                          .replace(/\s/g, "") ===
                        _temp?.personalDetails?.collegeemail
                          ?.toString()
                          .toLowerCase()
                          .replace(/\s/g, "")
                      )
                        throw new Error("Institute Email already exists");
                      if (
                        examiner?.personalDetails?.phonenumber
                          ?.toString()
                          .toLowerCase()
                          .replace(/\s/g, "") ===
                        _temp?.personalDetails?.phonenumber
                          ?.toString()
                          .toLowerCase()
                          .replace(/\s/g, "")
                      )
                        throw new Error("Contact Number already exists");
                      if (
                        examiner?.personalDetails?.personalEmail
                          ?.toString()
                          .toLowerCase()
                          .replace(/\s/g, "") ===
                        _temp?.personalDetails?.personalEmail
                          ?.toString()
                          .toLowerCase()
                          .replace(/\s/g, "")
                      )
                        throw new Error("Personal Email already exists");
                      if (
                        _temp?.documents?.bankDetails?.accountNumber &&
                        examiner?.documents?.bankDetails?.accountNumber ===
                          _temp?.documents?.bankDetails?.accountNumber
                      )
                        throw new Error("Account Number already exists");
                    });
                    let upload_len = Object.entries(_temp.documents).filter(
                      ([acc, value]: any) => {
                        console.log(acc, value);
                        return value;
                      }
                    ).length;
                    if (upload_len > 0)
                      toastify("Please do not close the tab", "info", {
                        autoClose: false,
                      });
                    // console.log(_temp.documents);
                    if (upload_len === 0) {
                      dismissToastie();
                      toastify("Updating examiner", "info", {
                        autoClose: false,
                        loading: true,
                      });
                      if (id) {
                        await updateExaminer({
                          user: {
                            eid: id,
                            e_id: _temp?.e_id ? _temp?.e_id : "SOE",
                            id: _id,
                            ..._temp,
                          },
                        });
                        dismissToastie();
                        toastify("Examiner updated", "success");
                      } else {
                        await addExaminer({
                          user: _temp,
                        });
                        dismissToastie();
                        toastify("Examiner added", "success");
                      }
                      navigate("/dashboard");
                      return;
                    }
                    Object.entries(_temp.documents).map(
                      async ([accessor, value]: any, index: number) => {
                        if (value && value?.name) {
                          const uploads = toastify(
                            `Uploading files ${index + 1} of ${upload_len}`,
                            "info",
                            {
                              autoClose: false,
                            }
                          );
                          const uploadTask = await uploadImage(value);
                          _temp.documents[accessor] = uploadTask
                            ? uploadTask[0]
                            : null;
                          dismissToastie(uploads);
                          toastify(
                            `Uploaded files ${index + 1} of ${upload_len}`,
                            "success",
                            {
                              autoClose: false,
                            }
                          );
                        }
                        if (index === upload_len - 1 || upload_len === 0) {
                          dismissToastie();
                          if (upload_len > 0)
                            toastify("All files uploaded", "success");
                          dismissToastie();
                          toastify("Updating examiner", "info", {
                            autoClose: false,
                            loading: true,
                          });
                          if (id) {
                            await updateExaminer({
                              user: {
                                eid: id,
                                e_id: _temp?.e_id ? _temp?.e_id : "SOE",
                                id: _id,
                                ..._temp,
                              },
                            });
                            dismissToastie();
                            toastify("Examiner updated", "success");
                          } else {
                            await addExaminer({
                              user: _temp,
                            });
                            dismissToastie();
                            toastify("Examiner added", "success");
                          }
                          navigate("/dashboard");
                        }
                      }
                    );
                  } catch (e: any) {
                    toastify(e.message, "error");
                  }
                }}
                startIcon={id ? <UpdateRounded /> : <PersonAddRounded />}
              >
                {id ? "Update" : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default View;
