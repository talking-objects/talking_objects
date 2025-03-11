import { parseKirbyTags } from "@/app/utils/hooks/useParseKirbyTags";
import MarkdownIt from "markdown-it";



const TeamTextBlock = ({val}) => {
  const md = MarkdownIt({html: true})
  
  return (
    <div className="w-full py-4">
      <div className="flex flex-col items-center w-full px-4">
        <div style={{lineHeight: 1.2}} className="w-full lg:w-3/5 font-normal text-base md:text-lg lg:text-xl text-[#414B5A] whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${md.render(parseKirbyTags(val.content.text))}`}}></div>
      </div>
    </div>
  );
};


export default TeamTextBlock