import { useField } from "formik";

function CheckboxList({ options, name }) {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="grid grid-cols-1 gap-4 min-[425px]:grid-cols-2 min-[540px]:grid-cols-3 min-[640px]:grid-cols-2 min-[768px]:grid-cols-3 min-[950px]:grid-cols-2 min-[1024px]:grid-cols-2 min-[1280px]:grid-cols-3 min-[1850px]:grid-cols-4 min-[2300px]:flex min-[2300px]:gap-8">
      {options.map((option) => (
        <div key={option} className="flex items-center gap-2">
          <input
            id={option}
            name={name}
            type="checkbox"
            checked={option === field.value}
            onChange={() => helpers.setValue(option)}
          />
          <label htmlFor={option} className="capitalize">
            {option}
          </label>
        </div>
      ))}

      {hasError && <div className="my-1 text-red-500">{meta.error}</div>}
    </div>
  );
}

export default CheckboxList;
