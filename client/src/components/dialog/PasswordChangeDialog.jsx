import { Form, Formik } from "formik";
import { toast } from "sonner";
import { useUpdatePasswordMutation } from "../../redux/slices/api/userAPISlice.js";
import {
  initialValues,
  validationSchema,
} from "../../validations/passwordChangeValidations.js";
import { Button, PasswordInput } from "../Index.jsx";
import { DialogBox } from "./Index.jsx";
import { DialogTitle } from "@headlessui/react";

function PasswordChangeDialog({ isOpen, setIsOpen }) {
  const [updatePassword] = useUpdatePasswordMutation();

  const handlePasswordChange = async (values, { setSubmitting }) => {
    try {
      const result = await updatePassword({
        newPassword: values.newPassword,
      }).unwrap();

      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || err?.status);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogBox isOpen={isOpen} setIsOpen={setIsOpen}>
      <DialogTitle className="mb-4 text-base leading-6 font-bold text-gray-900 uppercase">
        Change Password
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        // enableReinitialize={true}
        onSubmit={handlePasswordChange}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mt-2 flex flex-col">
              <PasswordInput label="New Password" name="newPassword" />
              <PasswordInput label="Confirm Password" name="confirmPassword" />
            </div>

            <div className="mt-4 flex flex-row-reverse gap-4 py-3">
              <Button
                type="submit"
                isSubmitting={isSubmitting}
                label={isSubmitting ? "Updating Password" : "Update Password"}
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

export default PasswordChangeDialog;
