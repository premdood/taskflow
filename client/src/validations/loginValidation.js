import * as Yup from "yup";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Please provide email"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password shouldn't be greater 32 characters")
    .required("Please provide password"),
});

export { initialValues, validationSchema };
