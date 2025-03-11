"use client";
import DContainer from "@/app/components/containers/DContainer";
import PageHeader from "@/app/components/containers/PageHeader";
import { globalCurrentUrl } from "@/app/utils/recoil/state";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import yaml from "js-yaml"
import { PeronsData, TeamsData } from "@/app/utils/swr/fetchdata";
import HeadingText from "@/app/components/elements/HeadingText";
import LoadingBox2 from "@/app/components/LoadingBox2";
import TeamTextBlock from "@/app/components/TeamTextBlock";
import TeamContainer from "@/app/components/containers/TeamContainer";

const Wrapper = ({ teamPanelData, currentLanguage }) => {
  const setCurrentUrl = useSetRecoilState(globalCurrentUrl);
  const getPathname = usePathname();

  const {dataSwr, isLoading} = TeamsData({currentLanguage: currentLanguage})
  const {dataSwr:dataSwrP, isLoading:isLoadingP} = PeronsData({currentLanguage: currentLanguage})
  const [teamsData, setTeamsData] = useState(null)

  useEffect(() => {
    setCurrentUrl(getPathname);
  }, []);

  useEffect(() => {
    if(!isLoading && !isLoadingP){
      let teamData = JSON.parse(JSON.stringify(dataSwr))
      teamData.result.contents = yaml.load(teamData.result.contents)
       
      teamData.result.contents.map((v,i) => {
        if(v.type === "obj"){
          let titles = []
          if(v["content"]["teams"]){

            titles = v["content"]["teams"].split(",").map(v2 => v2.trim())
          }else{
            titles=[]
          }
          v["content"]["persons"] = []
          for(let i = 0; i < titles.length; i++){
            const user = dataSwrP.result.find((v2) => v2.title === titles[i])
            v["content"]["persons"].push(user)
          }
        }
      
        return v;

    })
      setTeamsData(teamData.result.contents)
    }
  },[isLoading, isLoadingP])


  return (
    <div className="w-screen h-full">
      <PageHeader
        title={teamPanelData["team_title"]}
        text={teamPanelData["team_header"]}
      />
      {(isLoading || isLoadingP || !Boolean(teamsData)) && <LoadingBox2 /> }
      <DContainer>
        {(!isLoading && !isLoadingP && Boolean(teamsData)) && <div className="w-full h-full flex flex-col items-center gap-8 pt-8">
          {teamsData.map((val, idx) => {
            return (
              <React.Fragment key={idx}>
              {val.type === "obj" && <TeamContainer val={val} />}
              {val.type === "heading" && <DContainer paddingOn={true}><span className="w-full flex justify-center pt-8"><HeadingText text={val.content.text} /></span></DContainer>}
              {val.type === "text" && <TeamTextBlock val={val} />}
              </React.Fragment>
            );
          })}
        </div>}
        <div className="w-full h-[24px]"></div>
      </DContainer>
    </div>
  );
};

export default Wrapper;
