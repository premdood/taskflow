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
import { useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { getInitials } from "../../utils/user";

function MemberListBox({ users }) {
  const name = "team";
  const [field, meta, helpers] = useField({
    name,
    type: "select",
    multiple: true,
  });
  const hasError = meta.touched && meta.error;

  // local state to prevent form rerendering
  const [value, setValue] = useState(field.value);

  return (
    <Field className="mb-3">
      <Label className="mb-0.5 block">Assign Task To: </Label>

      <Listbox
        as="div"
        name
        multiple
        value={value}
        onChange={setValue}
        className="relative w-full"
      >
        <ListboxButton
          onBlur={() => helpers.setValue(value)}
          className={clsx(
            `relative w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-left 2xl:py-3`,
            hasError && "border-red-300 focus:border-red-500",
          )}
        >
          <span className="block truncate">
            {users
              ?.filter((user) => value.includes(user._id))
              .map((user) => user.name)
              .join(", ") || "Select Members"}
          </span>

          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <BsChevronExpand className="h-5 w-5 text-gray-400" aria-hidden />
          </span>
        </ListboxButton>

        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-md border border-gray-300 bg-white py-1 text-base shadow-lg ring-1 ring-black/3 focus:outline-none">
            {users?.map((user) => (
              <ListboxOption
                key={user._id}
                value={user._id}
                className="relative flex min-h-10 cursor-pointer items-center py-1 pr-4 pl-10 text-gray-900 outline-none data-focus:bg-[var(--light-primary-color)] data-selected:bg-[var(--light-primary-color)] data-selected:text-[var(--primary-color)]"
              >
                {({ selected }) => (
                  <>
                    <div
                      className={clsx(
                        "flex items-center gap-2 truncate font-normal",
                        selected && "font-medium",
                      )}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-color)] text-white">
                        <span className="text-[10px]">
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <span>{user.name}</span>
                    </div>
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

export default MemberListBox;
