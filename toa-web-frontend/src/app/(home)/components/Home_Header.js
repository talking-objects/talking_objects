
import HeaderTitle from "@/app/components/elements/HeaderTitle";
import CoreThemeWrapper from "@/app/components/CoreThemeNav";
import FloatingAnimation from "@/app/components/elements/FloatingAnimation";
import { globalHeadingFontSize } from "@/app/utils/recoil/state";
import { useRecoilValue } from "recoil";



const HomeHeader = ({isLoading, headerImages, data }) => {
  const getGlobalHeadingFontSize = useRecoilValue(globalHeadingFontSize);
 
  return (
    <>
      <div className={`scrollheader relative w-screen h-[100svh] lg:h-screen ${getGlobalHeadingFontSize ? "bg-white" : "bg-toa-black"} transition-all duration-500`}>
        {!isLoading && <FloatingAnimation headerImages={headerImages} />}
        <HeaderTitle text={data["home_header"]} />
        <CoreThemeWrapper home={true} headerId="#header" />
      </div>
    </>
  );
};

export default HomeHeader;
