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
export const AssignmentTable: {
  Header: MetricHeader;
  Props: any;
} = {
  Header: {
    eid: {
      header: "ID",
    },
    "formDetails.date": {
      header: "Date",
    },
    "formDetails.conveyer": {
      header: "Conveyer",
    },
    "formDetails.course": {
      header: "Course",
    },
    "formDetails.code": {
      header: "Code",
    },
    "formDetails.semester": {
      header: "Semester",
    },
    "formDetails.degree": {
      header: "Degree",
    },
    "travelDetails.mode": {
      header: "Mode",
      hide: true,
    },
    "travelDetails.city": {
      header: "City",
    },
    "travelDetails.kilometres": {
      header: "Kilometres",
    },
    "travelDetails.da": {
      header: "DA",
    },
    "travelDetails.ta": {
      header: "TA",
    },
    "travelDetails.manual": {
      header: "Manual",
    },
    "payDetails.total": {
      header: "Total",
    },

    // eid: {
    //   header: "ID",
    // },
    // "personalDetails.name": {
    //   header: "Name",
    // },
    // mobile: {
    //   header: "Mobile",
    //   hide: true,
    // },
    // "instituteDetails.institutename": {
    //   header: "Institute",
    // },
    // personal_email: {
    //   header: "Personal Email",
    // },
    // "personalDetails.collegeemail": {
    //   header: "Institute Mail",
    // },
    // "instituteDetails.role": {
    //   header: "Role of faculty",
    // },
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
        "travelDetails.mode": false,
        // city
        "travelDetails.city": false,
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
    // enableRowActions: true,
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
// https://ppsudb.vercel.app/ta-da.html?school=School+of+Engineering&institute=P+P+Savani+School+of+Engineering%2C+Kosamba&course=tEST&examiner=+Karm+Balar&contact=8866393303&email=karm.balar%40ssasit.ac.in&degree=12&semester=123&code=21&mode=Car&date=19%2F11%2F2023&travelled=P+P+Savani+School+of+Engineering%2C+Kosamba&city=232&bank=State+Bank+of+India&branch=123&account=test&ifsc=1&kilometres=0&ta=0&da=200&total=200&conveyer=VARUN+THUMMAR
export const form_input = {
  required: {
    e_id: {
      label: "Institute Code",
      type: "select",
      placeholder: "Enter Institute Code",
      category: ["SOE", "SON", "SOP", "SLM"],
      required: true,
      holder: "school",
    },
    "personalDetails.name": {
      label: "Name",
      type: "text",
      placeholder: "Enter Name",
      required: true,
      holder: "examiner",
    },
    "personalDetails.phonenumber": {
      label: "Contact Number",
      type: "number",
      placeholder: "Enter Contact Number",
      required: true,
      holder: "contact",
    },
    "personalDetails.collegeemail": {
      label: "Institute Email",
      type: "email",
      placeholder: "Enter Institute Email",
      required: true,
      holder: "email",
    },

    "instituteDetails.institutename": {
      label: "Institute Name",
      type: "institute",
      placeholder: "Enter Institute Name",
      required: true,
      holder: "institute",
    },

    "bankDetails.bankName": {
      label: "Bank Name",
      type: "text",
      placeholder: "Enter Bank Name",
      required: true,
      holder: "bank",
    },
    "bankDetails.accountNumber": {
      label: "Account No.",
      type: "text",
      placeholder: "Enter Account No.",
      required: true,
      holder: "account",
    },
    "bankDetails.branch": {
      label: "Branch",
      type: "text",
      placeholder: "Enter Branch",
      required: true,
      holder: "branch",
    },
    "bankDetails.ifscCode": {
      label: "IFSC Code",
      type: "text",
      placeholder: "Enter IFSC Code",
      required: true,
      holder: "ifsc",
    },
  },
  form: {
    "formDetails.date": {
      label: "Date of assessment",
      type: "date",
      placeholder: "Enter Date of travel",
      required: true,
      holder: "date",
    },
    "formDetails.conveyer": {
      label: "Subject Conveyer",
      type: "text",
      placeholder: "Enter Conveyer",
      required: true,
      holder: "conveyer",
    },
    "formDetails.course": {
      label: "Course",
      type: "text",
      placeholder: "Enter Course",
      required: true,
      holder: "course",
    },
    "formDetails.code": {
      label: "Subject Code",
      type: "text",
      placeholder: "Enter Subject Code",
      required: true,
      holder: "code",
    },
    "formDetails.semester": {
      label: "Semester",
      type: "text",
      placeholder: "Enter Semester",
      required: true,
      holder: "semester",
    },
    "formDetails.degree": {
      label: "Degree",
      type: "text",
      placeholder: "Enter Degree",
      required: true,
      holder: "degree",
    },
  },
  travelled: [
    {
      "travelDetails.mode": {
        label: "Mode of travel",
        type: "select",
        placeholder: "Enter Mode of travel",
        category: ["Car", "Bus", "Train", "Flight"],
        holder: "mode",
      },
      "instituteDetails.institutename": {
        label: "Travelled from",
        type: "text",
        placeholder: "Enter Travelled from",
        holder: "travelled",
      },
      "travelDetails.city": {
        label: "City",
        type: "text",
        placeholder: "Enter City",
        holder: "city",
      },
      "travelDetails.kilometres": {
        label: "Kilometres",
        type: "number",
        placeholder: "Enter Kilometres",
        holder: "kilometres",
        disable: true,
      },
      "travelDetails.da": {
        label: "Daily Allowance",
        type: "number",
        placeholder: "Enter DA",
        holder: "da",
        disable: true,
        required: true,
      },
      "travelDetails.ta": {
        label: "Travel Allowance",
        type: "text",
        placeholder: "Enter TA",
        holder: "ta",
        disable: true,
      },
    },
    {
      "travelDetails.manual": {
        label: "Manual Fare",
        type: "text",
        placeholder: "Enter Manual",
        required: false,
      },
    },
  ],
  payment: {
    "payDetails.total": {
      label: "Total",
      type: "number",
      placeholder: "Enter Total",
      holder: "total",
      required: true,
      hide: true,
    },
  },
};
export const titles = {
  required: "Required missing Details*",
  form: "Assigning Details",
  travelled: "Travelling Details",
};
