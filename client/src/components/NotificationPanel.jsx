import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { toast } from "sonner";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../redux/slices/api/notificationAPISlice";
import { NotificationDialog } from "./dialog/Index.jsx";
import { Button } from "./ui/Index.jsx";

dayjs.extend(relativeTime);

const Icons = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-[var(--primary-color)] group-hover:text-[var(--dark-primary-color)]" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-[var(--primary-color)] group-hover:text-[var(--dark-primary-color)]" />
  ),
};

function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const { data: notificationResponse, error } = useGetNotificationsQuery();
  const data = notificationResponse?.data;

  const [markNotificationRead] = useMarkNotificationReadMutation();

  if (error) {
    console.error(error);
    toast.error(error?.data?.message || error?.message || error?.status);
  }

  const readHandler = async (readType, notificationId) => {
    try {
      const result = await markNotificationRead({
        readType,
        notificationId,
      }).unwrap();
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      console.error(err?.data?.message || err?.message);
    }
  };

  const viewHandler = (notification) => {
    setSelectedNotification(notification);
    setIsOpen(true);
  };

  const buttons = [
    { name: "Cancel", icon: "" },
    {
      name: "Mark All Read",
      icon: "",
      onClick: () => readHandler("all", ""),
    },
  ];

  return (
    <>
      <Popover className="relative flex items-center">
        <PopoverButton className="inline-flex cursor-pointer items-center outline-none">
          <div className="relative flex h-8 w-8 items-center justify-center text-gray-800">
            <IoIosNotificationsOutline className="text-3xl" />
            {data?.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
                {data?.length}
              </span>
            )}
          </div>
        </PopoverButton>

        <Transition
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel className="absolute top-5 -right-14 z-10 mt-5 flex w-screen max-w-max px-4 md:-right-10">
            {({ close }) =>
              data?.length > 0 ? (
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-2">
                    {data.slice(0, 5).map((item) => {
                      return (
                        <div
                          key={item._id}
                          className="group relative flex gap-x-4 rounded-lg p-2 hover:bg-gray-50"
                        >
                          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                            {Icons[item.notificationType]}
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => viewHandler(item)}
                          >
                            <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                              <p>{item.notificationType}</p>
                              <span className="text-xs font-normal lowercase">
                                {dayjs(item.createdAt).fromNow()}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-1 text-gray-600">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 bg-gray-50">
                    {buttons.map((button) => {
                      return (
                        <Button
                          key={button.name}
                          label={button.name}
                          onClick={button.onClick || close}
                          className="flex items-center justify-center p-3 py-4 font-semibold text-[var(--primary-color)] hover:bg-gray-100"
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-xl bg-white p-2 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="group relative flex gap-x-4 rounded-lg p-2 hover:bg-gray-50">
                    <p className="text-gray-600">No notifications right now</p>
                  </div>
                </div>
              )
            }
          </PopoverPanel>
        </Transition>
      </Popover>

      <NotificationDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        notification={selectedNotification}
      />
    </>
  );
}

export default NotificationPanel;
