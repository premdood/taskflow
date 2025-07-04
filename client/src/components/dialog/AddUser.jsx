import { DialogTitle } from "@headlessui/react";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "../../redux/slices/api/userAPISlice.js";
import { validationSchema } from "../../validations/addUserValidation.js";
import { Button, DialogBox, InputBox } from "../Index.jsx";
import { useSelector } from "react-redux";

function AddUser({ isOpen, setIsOpen, user }) {
  const { isAdmin } = useSelector((state) => state.auth.user);

  const [updateUser] = useUpdateUserMutation();
  const [addUser] = useAddUserMutation();

  const initialValues = {
    name: user?.name || "",
    title: user?.title || "",
    email: user?.email || "",
    role: user?.role || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = user
        ? await updateUser({ userId: user._id, values }).unwrap()
        : await addUser(values).unwrap();

      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || err?.status);
    } finally {
      setSubmitting(false);
      setIsOpen(false);
    }
  };

  return (
    <DialogBox isOpen={isOpen} setIsOpen={setIsOpen}>
      <DialogTitle className="mb-4 text-base leading-6 font-bold text-gray-900 uppercase">
        {user ? "Update Profile" : "Add New User"}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        // enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mt-2 flex flex-col">
              <InputBox
                label="Full Name"
                type="text"
                name="name"
                placeholder="your name"
              />

              <InputBox
                label="Title"
                type="text"
                name="title"
                placeholder="your title"
              />

              <InputBox
                label="Email"
                type="email"
                disabled={!isAdmin}
                name="email"
                placeholder="your email"
              />

              <InputBox
                label="Role"
                type="text"
                name="role"
                placeholder="your role"
              />
            </div>

            <div className="mt-4 flex flex-row-reverse gap-4 py-3">
              <Button
                type="submit"
                isSubmitting={isSubmitting}
                label={
                  isSubmitting
                    ? user
                      ? "Updating Profile"
                      : "Adding User"
                    : user
                      ? "Update Profile"
                      : "Add User"
                }
                className="rounded-md bg-[var(--primary-color)] px-5 font-medium text-white hover:translate-[1px]"
              />

              <Button
                type="button"
                label="Cancel"
                isSubmitting={isSubmitting}
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-[var(--light-primary-color)] px-5 font-medium text-[var(--dark-primary-color)] hover:translate-[1px]"
              />
            </div>
          </Form>
        )}
      </Formik>
    </DialogBox>
  );
}

export default AddUser;
