import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button, InputBox, Logo, PasswordInput } from "../components/Index.jsx";
import { useLoginMutation } from "../redux/slices/api/authAPISlice.js";
import {
  initialValues,
  validationSchema,
} from "../validations/loginValidation.js";

function Login() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const from = location?.state?.from.pathname;
    token && user && navigate(from, { replace: true });
  }, [token, user, navigate]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-[var(--secondary-color)] p-4 font-[Arial]">
      <div className="w-[400px] rounded-lg p-6 pb-8 sm:border sm:border-gray-300">
        <Logo className="mx-auto text-3xl" />
        <LoginForm />
      </div>
    </div>
  );
}

function LoginForm() {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values).unwrap();

      if (result.success) {
        const from = location.state?.from?.pathname || "/";
        result.success && navigate(from, { replace: true });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || err?.status);
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputBox
            name="email"
            type="email"
            label="Email"
            placeholder="user@example.com"
          />

          <PasswordInput name="password" label="Password" />

          <Button
            type="submit"
            isSubmitting={isSubmitting}
            label={isSubmitting ? "Logging In" : "Log In"}
            className="w-full rounded-lg bg-[var(--primary-color)] px-3 py-2.5 text-white hover:translate-[1px]"
          />
        </Form>
      )}
    </Formik>
  );
}

export default Login;
