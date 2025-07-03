import * as Yup from "yup";

const initialValues = {
  type: "",
  title: "",
};

const validationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf([
      "assigned",
      "started",
      "in-progress",
      "bug",
      "completed",
      "commented",
    ])
    .required("Please select the activity type"),
  title: Yup.string().required("Please provide message"),
});

export { initialValues, validationSchema };
