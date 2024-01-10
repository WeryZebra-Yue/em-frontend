import * as xlsx from "xlsx";
import { toast } from "react-toastify";
import { Alert, AlertColor, CircularProgress } from "@mui/material";
export const toastify = (message: string, type: AlertColor, props?: any) => {
  return toast(
    <>
      <Alert
        severity={type}
        style={{
          borderRadius: "10px",
          fontWeight: "600",
        }}
        sx={{ width: "100%" }}
        aria-label={`${message}`}
        aria-activedescendant={`${message}`}
        icon={
          props?.loading ? (
            <CircularProgress
              color="inherit"
              size="1.1rem"
              thickness={6}
              style={{
                marginTop: "3px",
              }}
            />
          ) : (
            ""
          )
        }
      >
        {message}
      </Alert>
    </>,
    {
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
      // top right bottom left
      position: "bottom-right",

      ...props,
    }
  );
};
export const cleanify = (objs: any) => {
  let index = 0;
  const cleaned = objs.map((obj: any) => {
    index++;
    return {
      "Sr. No.": index,
      "Institute Code": obj?.e_id,
      "External Faculty Name": obj?.personalDetails?.name,
      "External Faculty's Contact No.": obj?.personalDetails?.phonenumber,
      Institute: obj?.instituteDetails?.institutename,
      "College Email ID": obj?.personalDetails?.collegeemail,
      "Personal Email ID": obj?.personalDetails?.personalEmail,
      "Bank Name": obj?.documents?.bankDetails?.bankName,
      "Bank Account No.": obj?.documents?.bankDetails?.accountNumber,
      "IFSC Code": obj?.documents?.bankDetails?.ifscCode,
      Branch: obj?.documents?.bankDetails?.branch,
      "Role of Faculty": obj?.instituteDetails?.role,
    };
  });
  return cleaned;
};
// {
//   "_id": "656570df9d3f584ea5559ab9",
//   "formDetails": {
//       "date": "2023-11-28",
//       "conveyer": "VARUN THUMMAR",
//       "course": "Computer Engineering",
//       "code": "SECE04042",
//       "semester": "7",
//       "degree": "Degree"
//   },
//   "travelDetails": {
//       "mode": "Car",
//       "city": " Ahmedabad",
//       "kilometres": 241,
//       "da": 200,
//       "ta": 4820,
//       "manual": 0,
//       "institute": "Nirma Univeristy, Ahmedabad"
//   },
//   "payDetails": {
//       "total": 5020
//   },
//   "__v": 0
// }
export const cleanifyAssignment = (objs: any) => {
  const cleaned = objs.map((obj: any) => {
    return {
      "Sr. No.": obj?.formDetails?.code,
      Date: obj?.formDetails?.date,
      Conveyer: obj?.formDetails?.conveyer,
      Course: obj?.formDetails?.course,
      Semester: obj?.formDetails?.semester,
      Degree: obj?.formDetails?.degree,
      Mode: obj?.travelDetails?.mode,
      City: obj?.travelDetails?.city,
      Kilometres: obj?.travelDetails?.kilometres,
      DA: obj?.travelDetails?.da,
      TA: obj?.travelDetails?.ta,
      Manual: obj?.travelDetails?.manual,
      Institute: obj?.travelDetails?.institute,
      Total: obj?.payDetails?.total,
    };
  });
  return cleaned;
};

export const excel = (data: any[], name: string) => {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, ws, "SheetJS");
  xlsx.writeFile(wb, `${name}.xlsx`);
};

export const dismissToastie = (_id?: any) => {
  if (_id) toast.dismiss(_id);
  else toast.dismiss();
};
