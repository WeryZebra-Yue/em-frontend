import * as xlsx from "xlsx";
import { toast } from "react-toastify";
import { Alert, AlertColor } from "@mui/material";
export const toastify = (message: string, type: AlertColor, props?: any) => {
  toast(
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
export const excel = (data: any[], name: string) => {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, ws, "SheetJS");
  xlsx.writeFile(wb, `${name}.xlsx`);
};

export const dismissToastie = () => {
  toast.dismiss();
};
