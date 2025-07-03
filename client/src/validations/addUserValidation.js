import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Please provide name"),
  title: Yup.string().required("Please provide title"),
  email: Yup.string().email("Invalid email").required("Please provide email"),
  role: Yup.string().required("Please provide role"),
});

export { validationSchema };
