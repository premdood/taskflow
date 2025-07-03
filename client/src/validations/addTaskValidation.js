import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Please provide task title"),
  team: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least 1 member for task")
    .required("Team members are required"),
  stage: Yup.string()
    .oneOf(["todo", "in-progress", "completed"])
    .default("todo"),
  date: Yup.date(),
  priority: Yup.string().oneOf(["low", "medium", "high"]).default("low"),
  assets: Yup.array().of(
    Yup.mixed()
      .test(
        "file-type",
        "Only jpg, jpeg and png files are allowed",
        (value) => {
          return ["image/jpg", "image/jpeg", "image/png"].includes(value.type);
        },
      )
      .test("file-size", "Max allowed size is 2MB", (value) => {
        return value.size <= 2 * 1024 * 1024;
      }),
  ),
  description: Yup.string(),
});

export { validationSchema };
