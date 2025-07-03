import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { useField } from "formik";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";

function SelectList({ label, name, options }) {
  const [field, meta] = useField({ name, type: "select" });
  const hasError = meta.touched && meta.error;

  return (
    <Field className="w-full">
      <Label className="mb-0.5 block">{label}</Label>

      <Listbox
        as="div"
        name={name}
        value={field.value || ""}
        onChange={(value) => {
          field.onChange({ target: { value, name } });
        }}
        className="relative w-full"
      >
        <ListboxButton
          className={clsx(
            `relative w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-left 2xl:py-3`,
            hasError && "border-red-500 focus:border-red-500",
          )}
        >
          {({ value }) => (
            <>
              <span className="block truncate capitalize">{value || name}</span>

              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <BsChevronExpand
                  className="h-5 w-5 text-gray-400"
                  aria-hidden
                />
              </span>
            </>
          )}
        </ListboxButton>

        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions
            anchor={{ to: "bottom", gap: 4 }}
            className="absolute z-10 max-h-60 w-[var(--button-width)] rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/3 focus:outline-none"
          >
            {options?.map((option) => (
              <ListboxOption
                key={option}
                value={option}
                className="relative flex min-h-10 cursor-pointer items-center py-1 pr-4 pl-10 text-gray-900 outline-none data-focus:bg-[var(--light-primary-color)] data-selected:bg-[var(--light-primary-color)] data-selected:text-[var(--primary-color)]"
              >
                {({ selected }) => (
                  <>
                    <span
                      className={clsx(
                        "truncate font-normal capitalize",
                        selected && "font-medium",
                      )}
                    >
                      {option}
                    </span>

                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-[var(--primary-color)]">
                        <MdCheck className="h-5 w-5" aria-hidden />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </Listbox>

      {hasError && <div className="my-1 text-red-500">{meta.error}</div>}
    </Field>
  );
}

export default SelectList;
