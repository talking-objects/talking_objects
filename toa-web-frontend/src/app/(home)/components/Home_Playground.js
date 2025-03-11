import HContainer from "@/app/components/containers/HContainer";
import HomeText from "./elements/Home_Text";
import HomeButton from "./elements/Home_Button";
import HSubContainer from "@/app/components/containers/HContainer_sub";
import HeadingText from "../../components/elements/HeadingText";
import DragAnimation from "@/app/components/elements/DragAnimation";
const HomePlayGround = ({ headerImages, title, text, buttonText }) => {
 
  return (
    <HContainer color={'blue'}>
      <HSubContainer>
        <div className="flex-[3] flex flex-col justify-stretch items-stretch gap-0">
          <HeadingText text={title} />
          <div className="flex-1 flex">
          {headerImages && <DragAnimation columnId={"p"} imageData={headerImages} relation={true}/>}
          </div>
        </div>
        <div className="flex-[2] flex flex-col justify-start lg:justify-center gap-8">
          <HomeText big={false} text={text} />
          <HomeButton text={buttonText} color={"yellow"} path={"playground"} />
        </div>
      </HSubContainer>
    </HContainer>
  );
};

export default HomePlayGround;
