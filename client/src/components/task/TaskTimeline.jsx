import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Form, Formik } from "formik";
import { FaBug, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { MdOutlineDoneAll, MdOutlineMessage } from "react-icons/md";
import { toast } from "sonner";
import { usePostActivityMutation } from "../../redux/slices/api/taskAPISlice.js";
import {
  initialValues,
  validationSchema,
} from "../../validations/postActivityValidation.js";
import { Button, CheckboxList, InputBox } from "../ui/Index.jsx";

dayjs.extend(relativeTime);

const ACTIVITY_ICONS = {
  commented: (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white">
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in-progress": (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const ACTIVITY_TYPE = [
  "assigned",
  "started",
  "commented",
  "in-progress",
  "bug",
  "completed",
];

function ActivityCard({ activity }) {
  return (
    <div className="flex space-x-4">
      <div className="flex flex-shrink-0 flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center">
          {ACTIVITY_ICONS[activity.type]}
        </div>

        <div className="flex h-full w-full justify-center">
          {activity.type !== "completed" && (
            <div className="h-full w-0.5 bg-gray-300"></div>
          )}
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-y-1">
        <p className="font-semibold">{activity.by.name}</p>
        <div className="space-y-2 text-gray-500">
          <span className="capitalize">{activity.type} </span>
          <span className="text-sm">
            {dayjs(new Date(activity.date)).fromNow()}
          </span>
        </div>
        <div className="text-gray-700">{activity.title}</div>
      </div>
    </div>
  );
}

function TaskTimeline({ activities, taskId }) {
  const [postActivity] = usePostActivityMutation();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await postActivity({ taskId, data: values }).unwrap();
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || err?.status);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between gap-x-10 overflow-y-auto rounded-md bg-white p-8 shadow-md min-[640px]:flex-row min-[768px]:flex-col min-[950px]:flex-row 2xl:gap-80">
      {/* left */}
      <div className="mb-8 flex w-full flex-col gap-y-5">
        <h2 className="text-lg font-semibold uppercase">Activities</h2>
        <div className="w-full">
          {activities?.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </div>
      </div>

      {/* right */}
      <div className="w-full">
        <h2 className="mb-5 text-lg font-semibold">Add Activity</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="w-full flex-col flex-wrap gap-5">
                <CheckboxList options={ACTIVITY_TYPE} name="type" />

                <div className="my-4">
                  <InputBox name="title" placeholder="Message....." />
                  <Button
                    label={isSubmitting ? "Posting Activity" : "Post"}
                    isSubmitting={isSubmitting}
                    type="submit"
                    className="min-w-25 rounded-lg bg-[var(--primary-color)] text-white hover:translate-[1px]"
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default TaskTimeline;
