import React from "react";

function RegularTextfield({
  id,
  value,
  required,
  placeholder,
  additionalStyle,
  label,
}: RegularTextfieldProps) {
  return (
    <div className={additionalStyle?.div}>
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        name={id}
        id={id}
        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={on}
      />
    </div>
  );
}
export default RegularTextfield;
