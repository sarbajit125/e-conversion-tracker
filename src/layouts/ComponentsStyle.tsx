interface RegularTextfieldProps extends HTMLInputElement {
    label: string;
    value: string;
    additionalStyle?: RegularTextfieldStyles;
    isError?: boolean
    errMsg?: string
  }
  
  interface RegularTextfieldStyles {
      div?: string
      input?: string
      label?: string
  }