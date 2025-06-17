import DraftButton from "../draftViews/DraftButton";
const MobileDraftFooter = ({
  footerIsOpen,
  setFooterIsOpen,
}: {
  footerIsOpen: boolean;
  setFooterIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="mobileFooter sticky w-full bottom-0 bg-light-gray h-14 z-[52] flex flex-col items-center justify-center">
        <div className="relative w-16">
          <div
            onClick={() => setFooterIsOpen(!footerIsOpen)}
            className="champContainerPullup absolute -top-10 w-16 h-10 bg-gray/80 border-white/80 border-x-2 border-t-2 flex items-center rounded-t-md hover:cursor-pointer"
          >
            <div
              className={`line w-8 h-2 bg-white rounded translate-x-1 transition duration-300 ${
                footerIsOpen ? "rotate-[30deg]" : "rotate-[-30deg]"
              } `}
            ></div>
            <div
              className={`line w-8 h-2 bg-white rounded -translate-x-1 transition duration-300 ${
                footerIsOpen ? "rotate-[-30deg]" : "rotate-[30deg]"
              }  `}
            ></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center scale-[80%]">
          <DraftButton />
        </div>
      </div>
    </>
  );
};

export default MobileDraftFooter;
