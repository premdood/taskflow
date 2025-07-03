import clsx from "clsx";

function Button({ icon, label, type, onClick, className, isSubmitting }) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={isSubmitting}
      className={clsx(
        `cursor-pointer px-3 py-1.5 font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50`,
        className,
      )}
    >
      {icon} {label}
    </button>
  );
}

export default Button;
