"use client"

import DContainer from "@/app/components/containers/DContainer"
import PageHeader from "@/app/components/containers/PageHeader"
import { globalCurrentUrl } from "@/app/utils/recoil/state"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import AboutContainer from "./elements/AboutContainer"
import AboutBox from "./elements/AboutBox"
import { AboutContentData } from "@/app/utils/swr/fetchdata"
import yaml from "js-yaml"
import LoadingBox2 from "@/app/components/LoadingBox2"

const Wrapper = ({aboutPanelData, currentLanguage}) => {
    const setCurrentUrl = useSetRecoilState(globalCurrentUrl)
    const getPathname = usePathname()
    const {dataSwr, isLoading} = AboutContentData({currentLanguage: currentLanguage})
    const [getContents, setContents] = useState(null)
    useEffect(() => {
 
        setCurrentUrl(getPathname)
    },[])

    useEffect(() => {
      if(!isLoading){
       
        let newData = yaml.load(dataSwr.result.content.contents)
   
        setContents(newData)
      
      }
    },[dataSwr])
    return (
        <div className="w-screen h-full">
          <PageHeader
            title={aboutPanelData.about_title}
            text={aboutPanelData.about_header}
          />
          {(!Boolean(getContents) || isLoading) && <LoadingBox2 />}
          <DContainer color="white" paddingOn={false}>
            {(Boolean(getContents) && !isLoading) && <AboutContainer>
              {getContents.length > 0 && getContents.map((term, idx) => {
                return (
                  <AboutBox key={idx} idx={idx} word={term["content"]["about_box_title"]} about={term["content"]["about_box_text"]} />
                );
              })}
            </AboutContainer>}
          </DContainer>
        </div>
      );
}

export default Wrapper;