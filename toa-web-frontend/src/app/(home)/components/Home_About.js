import HContainer from "@/app/components/containers/HContainer";
// import HomeHeadingText from "../../components/elements/HeadingText";
import HomeText from "./elements/Home_Text";
import HomeButton from "./elements/Home_Button";
import HSubContainer from "@/app/components/containers/HContainer_sub";
import { TOA_COLORS } from "@/app/constant/kirbyurl";
import HeadingText from "../../components/elements/HeadingText";
import Image from "next/image";

const HomeAbout = ({ title, text, buttonText }) => {
  return (
    <HContainer>
      <HSubContainer>
        <div className="flex-[1] flex flex-col justify-center gap-8">
          <HeadingText text={title} />
          <HomeText text={text} />
          <HomeButton text={buttonText} color={"blue"} path={"about"} />
        </div>
        <div
        style={{backgroundImage: `url(/assets/landing/landingpage_toa-diagram.svg)`}}
        className="flex-[1] min-w-[350px] min-h-[350px] flex justify-center items-centerrounded-xl bg-center bg-contain bg-no-repeat">
         
        </div>
      </HSubContainer>
    </HContainer>
  );
};

export default HomeAbout;
