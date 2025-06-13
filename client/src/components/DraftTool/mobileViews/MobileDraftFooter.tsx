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
      <div className="mobileFooter sticky w-full bottom-0 bg-light-gray h-18 z-[52] flex flex-col items-center justify-center">
        <div className="relative w-16">
          <div
            onClick={() => setFooterIsOpen(!footerIsOpen)}
            className="champContainerPullup absolute -top-6 w-16 h-6 bg-black/80 flex items-center rounded-t-md"
          >
            <div
              className={`line w-8 h-2 bg-white rounded translate-x-1 transition duration-300 ${
                footerIsOpen ? "rotate-[20deg]" : "rotate-[-20deg]"
              } `}
            ></div>
            <div
              className={`line w-8 h-2 bg-white rounded -translate-x-1 transition duration-300 ${
                footerIsOpen ? "rotate-[-20deg]" : "rotate-[20deg]"
              }  `}
            ></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <DraftButton />
        </div>
      </div>
    </>
  );
};

export default MobileDraftFooter;
