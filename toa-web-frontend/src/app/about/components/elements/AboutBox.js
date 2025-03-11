import HeadingText from "@/app/components/elements/HeadingText";
import { parseKirbyTags } from "@/app/utils/hooks/useParseKirbyTags";
import MarkdownIt from "markdown-it";
import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";

const AboutBox = ({ idx, word, about }) => {
  const md = MarkdownIt({html: true})
  const randomColor = useMemo(() => {
    const bgColor = [
      '#F9F8F7',
      '#FFFFFF',
      '#D8B792',
    ]
    return bgColor[Math.floor(Math.random() * bgColor.length)]
  },[])
 

  return (
    <div
      style={{
        gridColumn: idx % 5 === 0 ? "span 2 / span 2" : "span 1 / span 1",
        backgroundColor: randomColor
      }}
      className=" w-full h-full px-4 md:px-8 py-4 lg:py-8 flex flex-col gap-8"
    >
      <HeadingText
        defaultColor={randomColor === "#D8B792" ? "white" : "black"}
        text={`${String(word.slice(0, 1)).toUpperCase()}${String(
          word.slice(1)
        ).toLowerCase()}`}
      />
     
      <div
        style={{lineHeight: 1.3}}
        dangerouslySetInnerHTML={{ __html: `${md.render(marked.parse(parseKirbyTags(about)))}` }}
        className={`${randomColor === "#D8B792" ? "text-white" : "text-[#414B5A]"} font-normal text-base md:text-lg lg:text-xl whitespace-break-spaces lg:w-[80%]`}
      ></div>
     
    </div>
  );
};

export default AboutBox;
