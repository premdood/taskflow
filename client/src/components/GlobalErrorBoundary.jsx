import { PiWarningOctagonLight } from "react-icons/pi";
import { useNavigate, useRouteError } from "react-router";
import { Button } from "./ui/Index.jsx";

function GlobalErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="flex w-full max-w-2xl flex-col space-y-3 overflow-hidden rounded-2xl p-4 text-center">
        <PiWarningOctagonLight size={100} className="mx-auto text-red-500" />
        <h1 className="text-5xl font-medium">Something went wrong</h1>
        <p className="text-2xl font-normal">Please try again or contact us</p>
        <Button
          label="Home page"
          onClick={() => navigate("/")}
          className="mx-auto w-fit rounded-md bg-[var(--primary-color)] px-8 text-lg font-medium text-white hover:translate-[1px]"
        />
      </div>
    </div>
  );
}

export default GlobalErrorBoundary;
