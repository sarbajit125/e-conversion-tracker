import { RegularTextfieldProps } from "@/layouts/ComponentsStyle";
import React from "react";
import { ErrorMessage, useField } from "formik";
function RegularTextfield({
  id,
  additionalStyle,
  label,
  leftView,
  ...rest
}: RegularTextfieldProps) {
  const [field, { touched, error }] = useField(id);
  return (
    <div className={additionalStyle?.div}>
      <label htmlFor={id}>{label}</label>
      <div className="relative mb-2 mt-2">
        {leftView != undefined ? (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            {leftView}
          </div>
        ) : null}
        <input
          type="text"
          id={id}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...field}
          {...rest}
        />
      </div>
      <ErrorMessage
        name={id}
        component="div"
        className="text-red-600 text-sm "
      />
    </div>
  );
}
export default RegularTextfield;
