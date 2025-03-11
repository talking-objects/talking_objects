import { useRecoilState } from "recoil";
import { globalTerm } from "../recoil/state";
import { marked } from "marked";
export default function TermsFilter({text, words}) {
    const [getGlobalTerm, setGlobalTerm] = useRecoilState(globalTerm);
    const regex = new RegExp(`\\b(${words.map((v) => v.word_name).join('|')})\\b`, 'gi'); // Create a regex to match words from the array
    const parts = text.split(regex);
   
   
   // Split text by the words to replace
    const onClick = ({name, about}) => {
        setGlobalTerm({
            on: true,
            word: {
                name: name,
                about: about
            }
        })
    }
    if(words.length < 1){
      return text
    }
    return parts.map((part, index) => {
      // If the part matches one of the words, replace it with an <a> element
      if (words.map((v) => v.word_name.toLowerCase()).includes(part.toLowerCase())) {
        return (
          <span key={index} dangerouslySetInnerHTML={{__html: `${marked.parse(part)}`}} onClick={() => onClick({name: part, about: String(words.find((v) => v.word_name.toLowerCase() === part.toLowerCase()).word_about)})} className="text-blue-500 underline w-fit break-words cursor-help"></span>
        );
      }
      // Otherwise, return the part as normal text
      return <span key={index} className="break-words" dangerouslySetInnerHTML={{__html: `${marked.parse(part)}`}}></span>;
    });
    
  }