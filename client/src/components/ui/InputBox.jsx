import clsx from "clsx";
import { ErrorMessage, Field, useField } from "formik";
import { useState } from "react";

function InputBox({ as, disabled, name, placeholder, label, type }) {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  // local state to prevent form rerendering
  const [value, setValue] = useState(field.value);

  return (
    <div className="w-full">
      <label htmlFor={name} className="mb-0.5 block">
        {label}
      </label>

      <Field
        as={as}
        id={name}
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => helpers.setValue(value)}
        placeholder={placeholder}
        className={clsx(
          "mb-3 w-full rounded-md border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-100",
          hasError && "border-red-300 focus:border-red-500",
        )}
      />

      <ErrorMessage
        name={name}
        component="div"
        className="-mt-2 mb-2 text-red-500"
      />
    </div>
  );
}

export default InputBox;
