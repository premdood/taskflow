import { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { setSearchText } from "../../redux/slices/features/uiSlice";

function SearchBox() {
  const { searchText } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const location = useLocation();

  const [localSearchText, setLocalSearchText] = useState(searchText);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => dispatch(setSearchText(localSearchText)),
      500,
    );
    return () => clearTimeout(timeoutId);
  });

  useEffect(() => {
    setLocalSearchText("");
    dispatch(setSearchText(""));
  }, [location.pathname, dispatch]);

  return (
    <div className="flex w-46 items-center gap-2 rounded-lg bg-[var(--secondary-color)] px-3 py-2 sm:w-75 xl:w-[400px]">
      <MdOutlineSearch className="text-xl text-gray-500" />
      <input
        type="text"
        name="search"
        placeholder="search..."
        value={localSearchText}
        onChange={(e) => setLocalSearchText(e.target.value)}
        className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-500"
      />
    </div>
  );
}

export default SearchBox;
