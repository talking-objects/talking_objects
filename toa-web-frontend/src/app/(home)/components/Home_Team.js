import HContainer from "@/app/components/containers/HContainer";
import HSubContainer from "@/app/components/containers/HContainer_sub";
import HomeHeadingText from "../../components/elements/HeadingText";
import HomeText from "./elements/Home_Text";
import HomeButton from "./elements/Home_Button";

const HomeTeam = ({ title, text, buttonText }) => {
  return (
    <HContainer color="yellow">
      <HSubContainer>
        <div className="lg:flex-1 flex flex-col justify-center gap-8">
          <HomeHeadingText text={title} />
          <HomeText text={text} />
        </div>
        <div className="flex-1 flex justify-center items-start lg:items-center">
          <HomeButton text={buttonText} color={"black"} path={"team"} />
        </div>
      </HSubContainer>
    </HContainer>
  );
};

export default HomeTeam;
