import clsx from "clsx";
import { FaTasks } from "react-icons/fa";

function Logo({ className }) {
  return (
    <>
      <div
        className={clsx(
          `flex w-fit justify-center gap-2 rounded-md font-bold text-[var(--primary-color)]`,
          className,
        )}
      >
        <FaTasks className="my-1" />
        <h1>TaskFlow</h1>
      </div>
    </>
  );
}

export default Logo;
