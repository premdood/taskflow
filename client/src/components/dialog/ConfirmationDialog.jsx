import { DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { FaQuestion } from "react-icons/fa";
import { Button, DialogBox } from "../Index.jsx";

function ConfirmationDialog({
  isOpen,
  setIsOpen,
  msg,
  onClick,
  option1 = "cancel",
  option2,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);
    await onClick();
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <DialogBox isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <DialogTitle
          as="h3"
          className={clsx(
            "rounded-full p-3",
            option2 === "delete" || option2 === "delete all"
              ? "bg-red-200 text-red-600"
              : "bg-[var(--light-primary-color)] text-[var(--primary-color)]",
          )}
        >
          <FaQuestion size={60} />
        </DialogTitle>

        <p className="text-center text-gray-500">{msg}</p>

        <div className="flex gap-4 bg-gray-50">
          <Button
            type="button"
            label={option1}
            isSubmitting={isSubmitting}
            onClick={() => setIsOpen(false)}
            className="w-auto rounded-md bg-[var(--light-primary-color)] px-8 py-2 font-medium text-[var(--dark-primary-color)] capitalize hover:translate-[1px]"
          />

          <Button
            type="button"
            label={option2}
            onClick={handleClick}
            isSubmitting={isSubmitting}
            className={clsx(
              `w-auto rounded-md px-8 font-medium text-white capitalize hover:translate-[1px]`,
              option2 === "delete" || option2 === "delete all"
                ? "bg-red-600 hover:bg-red-500"
                : "bg-[var(--primary-color)]",
            )}
          />
        </div>
      </div>
    </DialogBox>
  );
}

export default ConfirmationDialog;
