import { ErrorMessage, Field } from "formik";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";

function PasswordInput({ label, name }) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleButtonStyles = "text-2xl h-full";

  return (
    <div>
      <label htmlFor={name} className="mb-0.5 block">
        {label}
      </label>

      <div className="relative mb-3 rounded-md border border-gray-300">
        <Field
          id={name}
          name={name}
          placeholder="password"
          className="w-full px-3 py-2"
          type={showPassword ? "text" : "password"}
        />
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-0 right-0 h-full cursor-pointer pr-2 pl-1"
        >
          {showPassword ? (
            <BiShow className={toggleButtonStyles} />
          ) : (
            <BiHide className={toggleButtonStyles} />
          )}
        </div>
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="-mt-2 mb-2 text-red-500"
      />
    </div>
  );
}

export default PasswordInput;
