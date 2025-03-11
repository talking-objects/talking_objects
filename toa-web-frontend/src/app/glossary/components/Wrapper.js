"use client";

import DContainer from "@/app/components/containers/DContainer";
import PageHeader from "@/app/components/containers/PageHeader";
import HeadingText from "@/app/components/elements/HeadingText";
import { globalCurrentUrl } from "@/app/utils/recoil/state";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import TermBox from "./elements/TermBox";
import TermContainer from "./elements/TermContainer";
import { GlossaryData } from "@/app/utils/swr/fetchdata";
import LoadingBox2 from "@/app/components/LoadingBox2";

const Wrapper = ({ glossaryPanelData, currentLanguage }) => {
  const setCurrentUrl = useSetRecoilState(globalCurrentUrl);
  const getPathname = usePathname();

  const {isLoading, dataSwr} = GlossaryData({currentLanguage: currentLanguage})
  const [getGlossaryList, setGlossaryList] = useState(null)
  useEffect(() => {
 
    setCurrentUrl(getPathname);
  }, []);

  useEffect(() => {
    if(!isLoading){
      setGlossaryList(dataSwr.result)
    }
  },[dataSwr])

 
  return (
    <div className="w-screen h-full">
      <PageHeader
        title={glossaryPanelData.glossary_title}
        text={glossaryPanelData.glossary_header_text}
      />
      
        {(isLoading && !Boolean(getGlossaryList)) && <LoadingBox2 />}
      <DContainer color="white" paddingOn={false}>
        {(!isLoading && Boolean(getGlossaryList)) && <TermContainer>
          {getGlossaryList["glossary_list"].map((term, idx) => {
            return (
              <TermBox key={idx} idx={idx} word={term["word_name"]} about={term["word_about"]} />
            );
          })}
        </TermContainer>}
      </DContainer>
    </div>
  );
};

export default Wrapper;
