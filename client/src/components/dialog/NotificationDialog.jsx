import { DialogTitle } from "@headlessui/react";
import { DialogBox } from "./Index.jsx";
import { Button } from "../Index";
import { useMarkNotificationReadMutation } from "../../redux/slices/api/notificationAPISlice.js";
import { toast } from "sonner";

function NotificationDialog({ isOpen, setIsOpen, notification }) {
  const [markNotificationRead] = useMarkNotificationReadMutation();

  const notificationHandler = async () => {
    try {
      const result = await markNotificationRead({
        readType: "",
        notificationId: notification._id,
      }).unwrap();

      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || err?.status);
    }
    setIsOpen(false);
  };

  return (
    <DialogBox isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex w-full flex-col items-center justify-center gap-4 p-2">
        <DialogTitle className="text-lg font-semibold">
          {notification?.task?.title}
        </DialogTitle>

        <p>{notification?.title}</p>

        <Button
          label="Ok"
          type="button"
          onClick={notificationHandler}
          className="sm:auto rounded-md bg-[var(--primary-color)] px-8 font-semibold text-white"
        />
      </div>
    </DialogBox>
  );
}

export default NotificationDialog;
