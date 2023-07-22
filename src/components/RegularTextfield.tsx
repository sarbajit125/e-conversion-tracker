import { RegularTextfieldProps } from "@/layouts/ComponentsStyle";
import React from "react";
import { useField } from 'formik'
function RegularTextfield({
  id,
  additionalStyle,
  label,
  ...rest
}: RegularTextfieldProps) {
  const [field, { touched, error }] = useField(id)
  return ( 
    <div className={additionalStyle?.div}>
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
        {...field}
        {...rest}
      />
       {touched && error && (
        <div className="text-red-600 text-sm mt-0.5">{error}</div>
      )}
    </div>
  );
}
export default RegularTextfield;
