import BeatLoader from "react-spinners/FadeLoader";

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <BeatLoader color="var(--primary-color)" />
    </div>
  );
}

export default Loader;
