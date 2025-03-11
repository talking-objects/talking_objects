import { useEffect, useState } from "react";
import yaml from "js-yaml"
import ReactPlayer from "react-player";
const isHeading = (value) => {
  let fontSize = "";
  switch (value.content.level) {
    case "h1":
      fontSize = "text-8xl";
      break;
    case "h2":
      fontSize = "text-7xl";
      break;
    case "h3":
      fontSize = "text-6xl";
      break;
    case "h3":
      fontSize = "text-5xl";
      break;
    case "h4":
      fontSize = "text-4xl";
      break;
    case "h5":
      fontSize = "text-3xl";
      break;
    default:
      fontSize = "text-2xl";
      break;
  }
  return <div className={`${fontSize} font-bold`} dangerouslySetInnerHTML={{ __html: `${value.content.text}` }}></div>;
};
const isText = (value) => {
  return <div className="lg:columns-2" dangerouslySetInnerHTML={{ __html: `${value.content.text}` }}></div>;
};
const isList = (value) => {
  return <div className="custom-list text-lg list-disc px-4" dangerouslySetInnerHTML={{ __html: `${value.content.text}` }}></div>;
};
const isLine = () => {
  return <div className="w-full h-[2px] bg-neutral-300 rounded-full"></div>;
};
const isImage = (value) => {
  return (
    <div className="w-full overflow-hidden aspect-video">
      {value.content.location === "kirby" && <div className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${process.env.KB_API_FILE}/${yaml.load(value.content.image[0])})` }}></div>}
      {value.content.location === "web" && <div className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${value.content.src})` }}></div>}
    </div>
  );
};
const isQuote = (value) => {
  return (
    <div className="border-l-4 pl-2 border-black">
      <div className="text-3xl" dangerouslySetInnerHTML={{ __html: `${value.content.text}` }}></div>
      <div className="text-lg text-neutral-500" dangerouslySetInnerHTML={{ __html: `${value.content.citation}` }}></div>
    </div>
  );
};
const isVideoUrl = (value, isMounted) => {
 
  return (
    <div className="w-full aspect-video">
      {isMounted && <ReactPlayer fallback={<div className="w-full h-full flex justify-center items-center bg-[#FF5B1C]">Loading...</div>} controls={true} width={"100%"} height={"100%"} url={value.content.link} />}
      <div>{value.content.text}</div>
    </div>
  )
}

const ContentElement = ({ value }) => {
  const [isMounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    
  }, []);

  if (value.type === "heading") {
    return isHeading(value);
  } else if (value.type === "text") {
    return isText(value);
  } else if (value.type === "quote") {
    return isQuote(value);
  } else if (value.type === "list") {
    return isList(value);
  } else if (value.type === "line") {
    return isLine();
  } else if (value.type === "image") {
    return isImage(value);
  } else {
    return isVideoUrl(value, isMounted);
  }
};

export default ContentElement;
