import { DialogTitle } from "@headlessui/react";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskAPISlice.js";
import { dateFormatter } from "../../utils/task.jsx";
import { validationSchema } from "../../validations/addTaskValidation.js";
import { Button, DialogBox, InputBox, SelectList } from "../Index.jsx";
import CustomFileInput from "../ui/CustomFileInput.jsx";
import { MemberListBox } from "../user/Index.jsx";
const TASK_STAGES = ["todo", "in-progress", "completed"];
const TASK_PRIORITY = ["high", "medium", "low"];

function AddTask({ isOpen, setIsOpen, task, options }) {
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const initialValues = {
    title: task?.title ?? "",
    team: task?.team.map((user) => user._id) ?? [],
    stage: task?.stage ?? "",
    date: dateFormatter(task?.date ?? new Date()),
    priority: task?.priority ?? "",
    assets: task?.assets ?? [],
    description: task?.description ?? "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();

    for (const key in values) {
      if (key === "assets" && Array.isArray(values.assets)) {
        values.assets.forEach((asset) => {
          formData.append("assets", asset);
        });
      } else if (key === "team" && Array.isArray(values.team)) {
        values.team.forEach((member) => {
          formData.append("team", member);
        });
      } else {
        formData.append(key, values[key]);
      }
    }

    const mutation = task
      ? () => updateTask({ taskId: task._id, data: formData })
      : () => createTask(formData);

    try {
      const result = await mutation().unwrap();
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
      <DialogTitle className="text-base leading-6 font-bold text-gray-900 uppercase">
        {task ? "Update Task" : "Add Task"}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur={true}
        validateOnChange={true}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputBox
              type="text"
              name="title"
              label="Task Title"
              placeholder="Task Name"
            />

            <MemberListBox users={options} />

            <div className="mb-3 flex flex-wrap gap-3 min-[500px]:flex-nowrap">
              <SelectList
                name="stage"
                label="Task Stage"
                options={TASK_STAGES}
              />

              <InputBox
                type="date"
                name="date"
                label="Task Date"
                placeholder="Date"
              />

              <SelectList
                name="priority"
                label="Task Priority"
                options={TASK_PRIORITY}
              />
            </div>

            <CustomFileInput
              label="Assets"
              name="assets"
              accept="image/jpg, image/jpeg, image/png"
            />

            <InputBox
              as="textarea"
              name="description"
              label="Task Description"
              placeholder="Detail about the task"
            />

            <div className="flex flex-row-reverse gap-4 bg-white py-4">
              <Button
                type="submit"
                isSubmitting={isSubmitting}
                label={
                  isSubmitting
                    ? task
                      ? "Updating Task"
                      : "Creating Task"
                    : task
                      ? "Update Task"
                      : "Create Task"
                }
                className="rounded-md bg-[var(--primary-color)] px-6 font-medium text-white hover:translate-[1px] md:px-8"
              />
              <Button
                type="button"
                label="Cancel"
                isSubmitting={isSubmitting}
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

export default AddTask;
