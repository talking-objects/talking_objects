import { globalHeadingFontSize } from "@/app/utils/recoil/state";
import HeaderTitle from "../elements/HeaderTitle";
import { useRecoilValue } from "recoil";

const PageHeader = ({ title = "Write Title", text = "Write Text" }) => {
  const getGlobalHeadingFontSize = useRecoilValue(globalHeadingFontSize);
  return (
    <div
      className={`headerbox w-screen h-fit min-h-[209px] lg:min-h-[385px] flex justify-center 
        ${
          getGlobalHeadingFontSize
            ? "bg-white text-toa-black"
            : "bg-toa-black text-white"
        }
            overflow-hidden transition-all  px-4 md:px-8 duration-500 py-8`}
    >
      <div className="w-full max-w-screen-2xl gap-4 flex flex-col justify-center break-words pt-[56px]">
        <div className="flex-1 w-full lg:w-2/3 flex items-end ">
            <HeaderTitle text={title} notHome={true} />
        </div>
        <div style={{lineHeight: 1.2}} className="flex-1 w-full lg:w-2/5 h-full text-base lg:text-xl lg:flex font-headersanslight whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${text}`}}></div>
      </div>
    </div>
  );
};

export default PageHeader;
