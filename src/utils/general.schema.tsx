import {
  SearchRounded,
  CancelRounded,
  FilterListRounded,
  HighlightOffOutlined,
} from "@mui/icons-material";
import styles from "../../src/pages/Dashboard/Dashboard.module.css";

export const MetricTable: {
  Header: MetricHeader;
  Props: any;
} = {
  Header: {
    eid: {
      header: "ID",
    },
    "personalDetails.name": {
      header: "Name",
    },
    mobile: {
      header: "Mobile",
      hide: true,
    },
    "instituteDetails.institutename": {
      header: "Institute",
    },
    personal_email: {
      header: "Personal Email",
    },
    "personalDetails.collegeemail": {
      header: "Institute Mail",
    },
    "instituteDetails.role": {
      header: "Role of faculty",
    },
  },
  Props: {
    muiTableProps: {
      className: styles.table,
    },
    muiTableHeadRowProps: {
      className: styles.tableRow,
    },
    enableColumnOrdering: true,
    enableGrouping: true,
    enablePinning: true,
    enableRowSelection: true,
    initialState: {
      columnVisibility: {
        mobile: false,
        personal_email: false,
        "personalDetails.collegeemail": false,
        "instituteDetails.role": false,
      },
      sorting: [
        {
          id: "eid",
          desc: false,
        },
      ],
    },
    muiTableHeadCellFilterTextFieldProps: {
      style: {
        textTransform: "capitalize",
      },
      InputLabelProps: {
        style: {
          marginLeft: "1rem",
        },
      },
    },
    muiTablePaginationProps: {
      showLastButton: false,
      showFirstButton: false,
      className: styles.pagination,
      rowsPerPageOptions: [10, 50, 100],
    },
    enableRowActions: true,
    enableSelectAll: false,
    muiTableBodyRowProps: ({ row }: any) => ({
      className: styles.tableRow,
      onClick: () => row.toggleSelected(),
    }),
    icons: {
      SearchIcon: () => <SearchRounded />,
      SearchOffIcon: () => <CancelRounded />,
      FilterListIcon: () => <FilterListRounded />,
      CancelIcon: () => <HighlightOffOutlined fontSize="small" />,
      ClearAllIcon: () => <HighlightOffOutlined fontSize="small" />,
      CloseIcon: () => <HighlightOffOutlined fontSize="small" />,
    },
  },
};

export interface MetricHeader {
  [key: string]: {
    header: string;
    filterVariant?: string;
    hide?: boolean;
    filterSelectOptions?: string[];
    enableColumnFilter?: boolean;
    enableSorting?: boolean;
  };
}

export const _input = {
  e_id: {
    label: "Institute Code",
    type: "select",
    placeholder: "Enter Institute Code",
    category: ["SOE", "SON", "SOP", "SLM"],
  },

  "personalDetails.name": {
    label: "Name",
    type: "text",
    placeholder: "Enter Name",
  },
  "personalDetails.phonenumber": {
    label: "Contact Number",
    type: "number",
    placeholder: "Enter Contact Number",
  },
  "personalDetails.personalEmail": {
    label: "Personal Email",
    type: "email",
    placeholder: "Enter Personal Email",
  },
  "personalDetails.collegeemail": {
    label: "Institute Email",
    type: "email",
    placeholder: "Enter Institute Email",
  },
  "personalDetails.areaofinterest": {
    label: "Area of interest",
    type: "multiple",
    placeholder: "Enter Area of Interest",
  },
  "instituteDetails.institutename": {
    label: "Institute Name",
    type: "institute",
    placeholder: "Enter Institute Name",
  },
  "instituteDetails.role": {
    label: "Category",
    type: "select",
    placeholder: "Enter Category",
    category: [
      "N/A",
      "Teaching Assistant",
      "Assistant professor",
      "Associate professor",
      "Professor",
      "HOD",
      "Principal",
      "Director",
    ],
  },
  roles: {
    label: "Roles",
    type: "checkbox",
    placeholder: "Enter Roles",
    category: ["Examiner", "Paper setter", "Expert"],
  },
  "documents.rcbook": {
    label: "RC Book (PDF / IMAGE^)",
    type: "file",
    placeholder: "Enter RC Book (PDF / IMAGE^)",
  },
  "documents.drivinglicenes": {
    label: "Driving Licence (PDF / IMAGE^)",
    type: "file",
    placeholder: "Enter Driving Licence (PDF / IMAGE^)",
  },
  "bankDetails.bankName": {
    label: "Bank Name",
    type: "text",
    placeholder: "Enter Bank Name",
  },
  "bankDetails.accountNumber": {
    label: "Account No.",
    type: "text",
    placeholder: "Enter Account No.",
  },
  "bankDetails.branch": {
    label: "Branch",
    type: "text",
    placeholder: "Enter Branch",
  },
  "bankDetails.ifscCode": {
    label: "IFSC Code",
    type: "text",
    placeholder: "Enter IFSC Code",
  },
  "documents.passbook": {
    label: "Bank passbook (PDF / IMAGE^)",
    type: "file",
    placeholder: "Enter Bank passbook (PDF / IMAGE^)",
  },
  "documents.cheque": {
    label: "Cancelled cheque (PDF / IMAGE^)",
    type: "file",
    placeholder: "Enter Cancelled cheque (PDF / IMAGE^)",
  },
};
