"use client";

import HContainer from "@/app/components/containers/HContainer";
import PageHeader from "@/app/components/containers/PageHeader";
import DragAnimation from "@/app/components/elements/DragAnimation";
import HeadingText from "@/app/components/elements/HeadingText";
import LoadingBox2 from "@/app/components/LoadingBox2";
import { TOA_CORETHEME_LABEL } from "@/app/constant/kirbyurl";
import { getRandomPlaceHolder } from "@/app/utils/hooks/etc";
import { globalCurrentUrl } from "@/app/utils/recoil/state";
import { PlaygroundChildrenData, PlaygroundChildrenItemsData } from "@/app/utils/swr/fetchdata";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { v4 as uuidv4 } from 'uuid';
import yaml from "js-yaml"
import Image from "next/image";

const ImageWrapper = ({ value, panelData }) => {

  return (
    <div className="w-full lg:w-3/5 h-[40svh] lg:h-[60svh] p-4 flex gap-4 overflow-hidden rounded-lg relative ">
      {panelData.coverimage && <Image
        src={`${process.env.KB_API_FILE}/${yaml.load(panelData.coverimage)}`}
        alt=""
        fill
        objectFit="cover"
      />}
      {!panelData.coverimage && <div style={{backgroundImage: `url(${getRandomPlaceHolder()})`}} className="w-full h-full absolute top-0 left-0 bg-no-repeat bg-contain bg-top"></div>}
      {/* {(Boolean(value.objects) && value.objects.length >= 1 ) && <DragAnimation columnId={`${uuidv4().replace(/[0-9]/g, '').slice(0, 2)}`} imageData={value.objects} relation={true} />}
      {(!Boolean(value.objects) || value.objects.length <= 0 ) && <div style={{backgroundImage: `url(${getRandomPlaceHolder()})`}} className="w-full h-full absolute top-0 left-0 bg-no-repeat bg-contain bg-top"></div>}
      */}
    </div>
  );
};

const AboutWrapper = ({btnText, value=[], playgroundPanelData }) => {
  const router = useRouter();
 
  const onPush = (uuid) => {
    router.push(`/playground/${String(uuid).slice(7)}`);
  };
  return (
    <div className="w-full lg:w-2/5 h-full flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          {value.coreThemeList && value.coreThemeList.map((value2, idx2) => {
            return (
              <div
                key={idx2}
                style={{
                  backgroundColor: `${TOA_CORETHEME_LABEL[value2]?.color}`,
                }}
                className="p-2 text-white rounded-md text-xs font-headerh1"
              >
               {TOA_CORETHEME_LABEL[value2]?.name}

              </div>
            );
          })}
        </div>
        <div style={{lineHeight: 1.4}} className="font-normal text-base md:text-lg lg:text-lg text-[#414B5A]">{playgroundPanelData["playground_item_blurb"]}</div>
      </div>

      <div className="flex flex-col gap-4 font-normal text-base md:text-lg lg:text-lg text-[#414B5A]">
        <div>
          <div>Curated by: {playgroundPanelData["author"]}</div>
          <div>Date: {playgroundPanelData["timestamp"]}</div>
        </div>
        <div
          onClick={() => onPush(playgroundPanelData.uuid)}
          className={`font-headerh1 text-center w-full max-w-full lg:max-w-[275px] flex justify-center items-center text-white px-4 py-4 rounded-xl text-base md:text-lg lg:text-xl cursor-pointer shadow-md transition-all duration-100 active:shadow-toa-black active:text-toa-black active:bg-white bg-toa-black active:scale-95 active:shadow-md select-none`}
        >
          {btnText}
        </div>
      </div>
    </div>
  );
};

const PlayGroundBox = ({ btnText, panelData, titles, currentLanguage}) => {
  const {isLoading, dataSwr} = PlaygroundChildrenItemsData({currentLanguage: currentLanguage, titles:`${JSON.stringify(titles ? titles : [])}` })
  const [getPlayground, setPlayground] = useState(null)
  useEffect(() => {
    if(!isLoading){
     
      if(titles){
     
      
        for(let i = 0; i < dataSwr.result.length; i++){
          if (typeof dataSwr.result[i].coretheme === 'string') {
            dataSwr.result[i].coretheme = dataSwr.result[i].coretheme.split(",").map((v) => v.trim())
          }
        }
      
      
        let getCoreThemeList = []
        if(dataSwr.result.length > 0){
          dataSwr.result.forEach((v) => {
            getCoreThemeList = Array.from(new Set([...getCoreThemeList, ...v.coretheme]))
          })
        }
       
      
        // let objects = dataSwr.result.slice(0, 6)
        setPlayground({
          coreThemeList: getCoreThemeList,
          objects: dataSwr.result
        })
      }else {
        setPlayground({
          coreThemeList: [],
          objects: []
        })
      }
     
   
    }
  },[isLoading])
  
  return (
      <div className="flex flex-col lg:flex-row w-full h-full gap-8 lg:gap-12 lg:items-start">
          {(!isLoading && Boolean(getPlayground)) &&
        <>
          <ImageWrapper value={getPlayground} panelData={panelData} />
          <AboutWrapper
            value={getPlayground}
            playgroundPanelData={panelData}
            btnText={btnText}
          />
        </>
          }


      </div>
  )
}

const Wrapper = ({ playgroundPanelData, currentLanguage }) => {
  const setCurrentUrl = useSetRecoilState(globalCurrentUrl);
  const {isLoading, dataSwr} = PlaygroundChildrenData({currentLanguage: currentLanguage})
  const [getPlayGrounds, setPlaygrounds] = useState(null)
  const getPathname = usePathname();
  useEffect(() => {
    setCurrentUrl(getPathname);
  }, []);

  useEffect(() => {
    if(!isLoading){
      if(dataSwr){
        if(dataSwr.result){
        
          for(let i = 0; i < dataSwr.result.length; i++){
            if(typeof dataSwr.result[i].contents === "string"){
              dataSwr.result[i].contents = yaml.load(dataSwr.result[i].contents)
              dataSwr.result[i].contents = dataSwr.result[i].contents ? Array.from(new Set(dataSwr.result[i].contents.filter((v2) => v2.type === "obj").map((v2) => v2.content.collection_obj))) : []
            }
          }
          setPlaygrounds(dataSwr.result)
        }
       
       
         
      } 
    
    }
  },[isLoading])
  

  return (
    <div className="w-screen h-full">
      <PageHeader
        title={playgroundPanelData["playground_title"]}
        text={playgroundPanelData["playground_header_text"]}
      />
      {(isLoading || !Boolean(getPlayGrounds)) && <LoadingBox2 />}

      <>
      {(!isLoading && Boolean(getPlayGrounds)) &&
        getPlayGrounds.map((value, idx) => {
          return (
            <HContainer key={idx} color={idx % 2 ? "white" : "blue"}>
              <div className="w-full h-full flex mb-8">
                <div className="flex flex-1 lg:flex-[3] flex-col">
                  <HeadingText text={value.title} />
                </div>
                <div className="hidden lg:block flex-[2]"></div>
              </div>
              <div className="w-full h-full flex ">
                <PlayGroundBox btnText={playgroundPanelData["playground_header_btn"]} panelData={value} titles={value.contents} currentLanguage={currentLanguage} />
              </div>
            </HContainer>
          );
        })
        }
        </>
    </div>
  );
};

export default Wrapper;
