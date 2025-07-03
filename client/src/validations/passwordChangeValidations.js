import * as Yup from "yup";

const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter",
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter",
    )
    .matches(/(?=.*[0-9])/, "Password must contain at least one number")
    .matches(
      /(?=.*[!@#$%^&*()?":{}|<>])/,
      "Password must contain at least one special character",
    )
    .required("Please enter new password"),
  confirmPassword: Yup.string()
    .required("Please confirm new password")
    .oneOf([Yup.ref("newPassword")], "Password must match"),
});

export { initialValues, validationSchema };
