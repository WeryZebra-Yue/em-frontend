import {
  AddCircleRounded,
  DownloadForOfflineRounded,
  RemoveCircleRounded,
} from "@mui/icons-material";
import styles from "./InputEle.module.css";
import { dismissToastie, toastify } from "../../utils/general.helper";
import axios from "axios";
import { Autocomplete, Checkbox } from "@mui/material";
const InputEle = ({
  accessor,
  value,
  examiner,
  setExaminer,
  oldExaminer,
  universities,
  areaofinterest,
  setAreaofinterest,
  _area,
  setArea,
  display = false,
  fixed = false,
  required = true,
}: any) => {
  const isDisplay = display
    ? !oldExaminer[accessor]
      ? "flex"
      : "none"
    : "flex";
  return (
    <div
      style={{
        display: isDisplay,
        marginBottom: "10px",
        marginLeft: "20px",
        marginRight: "20px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      key={accessor}
    >
      {isDisplay !== "none" && (
        <>
          <div>{value.label}</div>
          {value.type === "select" ? (
            <select
              required
              name={accessor}
              id={accessor}
              defaultValue={examiner[accessor]}
              className={styles.select}
              onChange={(e) => {
                setExaminer({
                  ...examiner,
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
              renderInput={(params: any) => (
                <div ref={params.InputProps.ref}>
                  <input
                    required={required}
                    type="text"
                    {...params.inputProps}
                    placeholder="Institute Name"
                    className={styles.inputBox}
                    value={examiner[accessor]}
                  />
                </div>
              )}
              onChange={(e: any, value: any) => {
                console.log(e);
                setExaminer({
                  ...examiner,
                  [accessor]: value.name,
                });
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
                  <div className={styles.areaofinterestText}>{area}</div>
                  <div
                    onClick={() => {
                      setAreaofinterest(
                        areaofinterest.filter((a: any) => a !== area)
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
                  required={required}
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
                    setExaminer({
                      ...examiner,
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
                      examiner[accessor]
                        .map((a: any) => a.toLowerCase())
                        ?.includes(cate.toLowerCase()),
                      cate
                    );
                  }}
                >
                  <div>{cate}</div>
                  <div>
                    <Checkbox
                      defaultChecked={examiner[accessor]
                        ?.map((a: any) => a?.toLowerCase())
                        ?.includes(cate?.toLowerCase())}
                      onChange={(e) => {
                        if (e.target.checked)
                          if (examiner[accessor])
                            setExaminer({
                              ...examiner,
                              [accessor]: [...examiner[accessor], cate],
                            });
                          else
                            setExaminer({
                              ...examiner,
                              [accessor]: [cate],
                            });
                        else
                          setExaminer({
                            ...examiner,
                            [accessor]: examiner[accessor].filter(
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
                required={required}
                id={accessor}
                disabled={fixed}
                defaultValue={value.type === "file" ? "" : examiner[accessor]}
                type={value.type}
                className={styles.inputBox}
                placeholder={value.label}
                onChange={(e) => {
                  setExaminer({
                    ...examiner,
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
                {...(fixed && {
                  value: examiner[accessor],
                })}
              />
              {value.type === "file" && (
                <DownloadForOfflineRounded
                  style={{
                    cursor: examiner[accessor] ? "pointer" : "default",
                    color: examiner[accessor] ? "#3BB23B" : "inherit",
                  }}
                  onClick={async () => {
                    if (examiner[accessor]) {
                      toastify("Downloading file", "info", {
                        autoClose: false,
                        loading: true,
                      });

                      const response = await axios.get(examiner[accessor], {
                        responseType: "arraybuffer",
                      });
                      dismissToastie();
                      toastify("Downloaded file", "success", {
                        autoClose: 1000,
                      });
                      const blob = new Blob([response.data], {
                        type: examiner[accessor].includes(".pdf")
                          ? "application/pdf"
                          : "image/jpeg",
                      });
                      const link = document.createElement("a");
                      link.href = window.URL.createObjectURL(blob);
                      link.download = examiner[accessor].includes(".pdf")
                        ? `${accessor}.pdf`
                        : `${accessor}.jpeg`;
                      link.click();
                    }
                  }}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export const SimpleDivider = () => {
  return (
    <div
      style={{
        height: "2px",
        width: "100%",
        backgroundColor: "gray",
        marginTop: "20px",
        borderRadius: "100%",
      }}
    ></div>
  );
};
export const ORDivider = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          height: "2px",
          width: "100%",
          backgroundColor: "gray",
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "100%",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      ></div>
      <div
        style={{
          color: "gray",
        }}
      >
        OR
      </div>
      <div
        style={{
          height: "2px",
          width: "100%",
          backgroundColor: "gray",
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "100%",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      ></div>
    </div>
  );
};
const Title = ({ title }: any) => {
  return (
    <h3
      style={{
        padding: "20px",
        margin: "10px",
        fontSize: "17px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {" "}
      {title}{" "}
    </h3>
  );
};
export { InputEle, Title };
