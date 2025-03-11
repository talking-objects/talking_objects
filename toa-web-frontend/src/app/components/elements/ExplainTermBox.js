"use client";
import { parseKirbyTags } from "@/app/utils/hooks/useParseKirbyTags";
import { globalTerm } from "@/app/utils/recoil/state";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const ExplainTermBox = () => {
  const [getGlobalTerm, setGlobalTerm] = useRecoilState(globalTerm);
  const router = useRouter()
//   useEffect(() => {
//     const detectClickOutside = (e) => {
//         if (document.getElementById('clickbox').contains(e.target)){
//             // Clicked in box
//           } else{
//             // Clicked outside the box
//             if(getGlobalTerm.on){
//                 
//                 onClose()
//             }
//           }
//     }
//     window.addEventListener('click', detectClickOutside)

//     return () => {
//         window.removeEventListener('click', detectClickOutside)
//     }
//   }, []);
  const onClose = () => {
    setGlobalTerm({
      on: false,
      word: getGlobalTerm.word,
    });
  };

  const onPush = (wordId) => {
    router.push(`/glossary#${wordId}`)
  }

//   if (!getGlobalTerm.on) {
//     return <></>;
//   }

  return (
    <div className={`fixed bottom-0 ${getGlobalTerm.on ? "translate-x-0" : "-translate-x-full"} left-0 z-[900] w-fit h-fit flex justify-center items-center p-4 overflow-scroll transition-all duration-300`}>
      <div
        id="clickbox"
        className="border border-neutral-300 w-full min-w-fit max-w-[600px] h-fit bg-[#fffdf4] text-black rounded-xl drop-shadow-xl shadow-lg"
      >
        <div className="border-b border-neutral-300 flex items-center justify-between py-2 px-4">
          <div>Glossary</div>
          <div onClick={onClose} className="p-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <div className="flex p-4 text-xl font-semibold">
          <div>{getGlobalTerm.word.name}</div>
        </div>
        <div className="px-4 pb-4">
            <p className="inline break-words">
                <span className="break-words" dangerouslySetInnerHTML={{__html: `${marked.parse(parseKirbyTags(getGlobalTerm.word.about.slice(0, 300)))}`}}></span>
                {getGlobalTerm.word.about.length > 300 && <span className="break-words ">...</span>}
                {getGlobalTerm.word.about.length > 300 && <span onClick={() => onPush(getGlobalTerm.word.name.toLocaleLowerCase().trim())} className="break-words text-[#5ad3ff] cursor-pointer">{" "}Read more</span>}
            </p>
        </div>
        
      </div>
    </div>
  );
};

export default ExplainTermBox;
