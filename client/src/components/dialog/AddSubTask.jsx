import { DialogTitle } from "@headlessui/react";
import { Form, Formik } from "formik";
import { Button, DialogBox, InputBox } from "../Index.jsx";
import {
  initialValues,
  validationSchema,
} from "../../validations/addSubTaskValidation.js";
import { toast } from "sonner";
import { useAddSubTaskMutation } from "../../redux/slices/api/taskAPISlice.js";

function AddSubTask({ isOpen, setIsOpen, selectedTaskId }) {
  const [addSubTask] = useAddSubTaskMutation();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await addSubTask({
        taskId: selectedTaskId,
        data: values,
      }).unwrap();

      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || err?.status);
    }
    setSubmitting(false);
    setIsOpen(false);
  };

  return (
    <DialogBox isOpen={isOpen} setIsOpen={setIsOpen}>
      <DialogTitle className="text=base mb-4 leading-6 font-bold text-gray-900 uppercase">
        Add Sub-Task
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mt-2">
              <InputBox
                type="text"
                name="title"
                label="Title"
                placeholder="Sub-Task Title"
              />

              <div className="flex items-center gap-4">
                <InputBox
                  type="date"
                  name="date"
                  placeholder="Date"
                  label="Sub-Task Date"
                />
                <InputBox
                  name="tag"
                  type="text"
                  label="Sub-Task Tag"
                  placeholder="Tag"
                />
              </div>
            </div>

            <div className="flex flex-row-reverse gap-4 bg-white py-6">
              <Button
                type="submit"
                isSubmitting={isSubmitting}
                label={isSubmitting ? "Adding Sub-Task" : "Add Sub-Task"}
                className="rounded-md bg-[var(--primary-color)] px-6 font-medium text-white hover:translate-[1px] md:px-8"
              />
              <Button
                type="button"
                label="Cancel"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-[var(--light-primary-color)] px-6 font-medium text-[var(--dark-primary-color)] hover:translate-[1px] md:px-8"
              />
            </div>
          </Form>
        )}
      </Formik>
    </DialogBox>
  );
}

export default AddSubTask;
