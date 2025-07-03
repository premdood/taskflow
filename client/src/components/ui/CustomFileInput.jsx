import clsx from "clsx";
import { useField } from "formik";
import { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Button } from "./Index.jsx";

function CustomFileInput({ accept, label, name }) {
  const [field, _meta, helper] = useField({ name, multiple: true });
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const inputRef = useRef();

  const displayFilesName = () => {
    if (field.value.length > 0) {
      return field.value.map((file) => file.name).join(", ");
    } else {
      return "Choose file or drag it here";
    }
  };

  const handleFileUpload = (event) => {
    event.stopPropagation();
    inputRef.current?.click();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragCounter(dragCounter + 1);
    setIsDragActive(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();

    setDragCounter((prev) => {
      const newValue = prev - 1;
      if (newValue === 0) {
        setIsDragActive(false);
      }
      return newValue;
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragCounter(false);
    setIsDragActive(false);

    if (event.dataTransfer?.files?.length > 0) {
      const filesArray = Array.from(event.dataTransfer.files);
      helper.setValue(filesArray);
    } else if (event.dataTransfer?.items) {
      const filesArray = Array.from(event.dataTransfer.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile());
      helper.setValue(filesArray);
    }
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    if (event.target?.files?.length > 0) {
      const filesArray = Array.from(event.target.files);
      helper.setValue(filesArray);
    }
  };

  return (
    <div className="mb-3 flex w-full flex-col">
      <span>{label}</span>

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileUpload}
        className={clsx(
          "h-15 w-full cursor-pointer rounded-md border border-dashed border-gray-400 p-2 hover:cursor-pointer hover:border-blue-500 hover:bg-blue-50",
          isDragActive && "border-blue-500 bg-blue-50",
        )}
      >
        <label
          htmlFor={name}
          onClick={(event) => event.preventDefault()}
          className="flex h-full cursor-pointer items-center justify-center select-none"
        >
          {isDragActive ? "📁 Drop your files here" : displayFilesName()}
        </label>

        <input
          id={name}
          type="file"
          name={name}
          ref={inputRef}
          multiple={true}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {field.value?.length > 0 && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>{field.value.length} file(s) selected</span>
          <Button
            icon={<MdDelete size={15} />}
            onClick={() => helper.setValue([])}
            className="cursor-pointer text-red-600"
          />
        </div>
      )}
    </div>
  );
}

export default CustomFileInput;
