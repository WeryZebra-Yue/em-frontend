import { Cookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header/FHeader";
import { MetricTable } from "../../utils/general.schema";
import { getAllExaminers, getUniversities } from "../../services/admin.service";

import styles from "./Dashboard.module.css";
import Button from "../../components/Button";
import MaterialReactTable from "material-react-table";

import { SET_LOADING } from "../../redux/Auth/AuthActions";
import { cleanify, excel } from "../../utils/general.helper";

function Dashboard() {
  const dispatch = useDispatch();
  const [examiners, setExaminers] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [rowSelection, setRowSelection] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      console.log("fetching");
      dispatch({
        type: SET_LOADING,
        payload: true,
      });
      const cookie = new Cookies();
      const _universities = await getUniversities();
      const _examiner = await getAllExaminers(cookie.get("token-ex"));
      if (!localStorage.getItem("examiners"))
        localStorage.setItem("examiners", JSON.stringify(_examiner));
      if (!localStorage.getItem("universities"))
        localStorage.setItem("universities", JSON.stringify(_universities));

      setExaminers(JSON.parse(localStorage.getItem("examiners") || "{}"));
      setUniversities(JSON.parse(localStorage.getItem("universities") || "{}"));

      dispatch({
        type: SET_LOADING,
        payload: false,
      });
    }
    if (
      !localStorage.getItem("examiners") ||
      !localStorage.getItem("universities")
    )
      fetchData();
    else {
      setExaminers(JSON.parse(localStorage.getItem("examiners") || "{}"));
      setUniversities(JSON.parse(localStorage.getItem("universities") || "{}"));
      console.log(examiners);
    }
  }, []);
  return (
    <div>
      <Header />
      <MaterialReactTable
        data={examiners}
        columns={useMemo(
          () =>
            Object.entries(MetricTable.Header).map(([accessor, value]) => ({
              ...value,
              accessorKey: accessor,
            })) as any,
          []
        )}
        state={{ rowSelection }}
        selectedRows={rowSelection}
        onRowSelectionChange={setRowSelection}
        renderTopToolbarCustomActions={() => (
          <div className={styles.topToolbar}>
            <Button variant="outlined">Import from Excel</Button>
            <Button
              variant="outlined"
              onClick={() => {
                const cleaned = cleanify(
                  Object.keys(rowSelection).length > 0
                    ? Object.keys(rowSelection).map(
                        (key) => examiners[parseInt(key)]
                      )
                    : examiners
                );
                excel(cleaned, "examiners");
              }}
            >
              Export to Excel
            </Button>
          </div>
        )}
        {...MetricTable.Props}
      />
    </div>
  );
}

export default Dashboard;
