import * as Yup from "yup";
import { dateFormatter } from "../utils/task";

const initialValues = {
  title: "",
  date: dateFormatter(new Date()),
  tag: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Please provide sub-task title"),
  date: Yup.date(),
  tag: Yup.string(),
});

export { initialValues, validationSchema };
