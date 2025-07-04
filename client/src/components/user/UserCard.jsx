import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { getInitials } from "../../utils/user.js";

function UserCard({ user, bg }) {
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(10), flip(), shift({ padding: 25 })],
    placement: "bottom",
    whileElementsMounted: autoUpdate,
  });

  return (
    <div className="px-4">
      <Popover ref={refs.setReference} className="relative">
        <PopoverButton className="group inline-flex cursor-pointer items-center outline-none">
          <div
            className={clsx(
              `-mr-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-sm text-white`,
              bg,
            )}
          >
            <span>{getInitials(user?.name)}</span>
          </div>
        </PopoverButton>

        <PopoverPanel
          ref={refs.setFloating}
          style={floatingStyles}
          className="absolute z-2 mt-3 w-80 max-w-sm transform px-4 sm:px-0"
        >
          <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-lg">
            <div
              className={clsx(
                `flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white`,
                bg,
              )}
            >
              <span className="text-center font-bold">
                {getInitials(user?.name)}
              </span>
            </div>

            <div className="flex flex-col gap-y-1">
              <p className="text-xl font-bold text-black">{user?.name}</p>
              <span className="text-base text-gray-500">{user?.name}</span>
              <a href={`mailto:${user?.email}`} className="text-blue-500">
                {user?.email}
              </a>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  );
}

export default UserCard;
