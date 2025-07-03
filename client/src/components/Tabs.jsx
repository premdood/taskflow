import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useTransition } from "react";
import { Loader } from "./Index";

function Tabs({ tabs, tabPanels, selectedIndex, changeViewAction }) {
  const [isPending, startTransition] = useTransition();

  const handleTabChange = () => {
    startTransition(() => {
      changeViewAction();
    });
  };

  return (
    <div className="w-full overflow-visible px-1 sm:px-0">
      <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
        <TabList className="flex flex-wrap items-center gap-2 space-x-6 rounded-xl p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.title}
              className="flex w-fit cursor-pointer items-center gap-2 rounded bg-white px-3 py-2.5 text-base leading-5 font-medium text-gray-800 outline-none hover:text-[var(--primary-color)] data-selected:border-b-2 data-selected:border-[var(--primary-color)] data-selected:text-[var(--primary-color)]"
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab>
          ))}
        </TabList>

        {isPending ? (
          <Loader />
        ) : (
          <TabPanels className="mt-2 w-full">
            {tabPanels.map((tabPanel, index) => (
              <TabPanel key={index}>{tabPanel}</TabPanel>
            ))}
          </TabPanels>
        )}
      </TabGroup>
    </div>
  );
}

export default Tabs;
