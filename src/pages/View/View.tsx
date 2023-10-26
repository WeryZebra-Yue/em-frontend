import { Cookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header/FHeader";
import { MetricTable, _input } from "../../utils/general.schema";
import { getAllExaminers, getUniversities } from "../../services/admin.service";

import styles from "./View.module.css";
import Button from "../../components/Button";
import MaterialReactTable from "material-react-table";

import { SET_LOADING } from "../../redux/Auth/AuthActions";
import { cleanify, excel } from "../../utils/general.helper";
import { Autocomplete } from "@mui/material";
import { AddCircleRounded, RemoveCircleRounded } from "@mui/icons-material";

function Dashboard() {
  const dispatch = useDispatch();
  // const [newExaminer, setNewExaminer] = useState<any>({});
  const [universities, setUniversities] = useState<any[]>([]);
  const [areaofinterest, setAreaofinterest] = useState<any[]>([]);
  const [_area, setArea] = useState<any>("");
  useEffect(() => {
    async function fetchData() {
      console.log("fetching");
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
  }, []);
  useEffect(() => {
    console.log();
  }, []);
  return (
    <div>
      <Header />
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
                      className={styles.select}
                      onChange={(e) => {
                        console.log(e.target.value);
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
                          />
                        </div>
                      )}
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
                          <div>{area}</div>
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fff",
                          borderRadius: "5px",
                          paddingRight: "10px",
                        }}
                      >
                        <input
                          required
                          type="text"
                          id={accessor}
                          value={_area}
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
                          }}
                          style={{
                            cursor: "pointer",
                            color: "#3BB23B",
                          }}
                        />
                      </div>
                      {/* <Button
                        variant="outlined"
                        onClick={() => {
                          if (_area === "") return;
                          setAreaofinterest([...areaofinterest, _area]);
                          setArea("");
                        }}
                      >
                        Add
                      </Button> */}
                    </div>
                  ) : (
                    <input
                      required
                      type={value.type}
                      className={styles.inputBox}
                      placeholder={value.label}
                      id={accessor}
                      onChange={(e) => {
                        console.log(e.target.value);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
