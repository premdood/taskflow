import clsx from "clsx";

function PageTitle({ title, className }) {
  return (
    <h1
      className={clsx(
        "text-2xl font-semibold text-gray-800 capitalize",
        className,
      )}
    >
      {title}
    </h1>
  );
}

export default PageTitle;
