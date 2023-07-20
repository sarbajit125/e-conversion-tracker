import { RegularTextfieldProps } from "@/layouts/ComponentsStyle";
import React from "react";

function RegularTextfield({
  id,
  additionalStyle,
  label,
  register,
  ...rest
}: RegularTextfieldProps) {
  return (
    <div className={additionalStyle?.div}>
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
        {...register(id)}
       {...rest}
      />
    </div>
  );
}
export default RegularTextfield;
