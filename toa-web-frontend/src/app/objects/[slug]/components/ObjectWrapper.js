"use client";

import React, {  useEffect, useMemo, useRef, useState} from "react";
import yaml from "js-yaml";
import { globalCurrentUrl, globalHeadingFontSize } from "@/app/utils/recoil/state";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { usePathname, useRouter } from "next/navigation";
import BlockWrapper from "@/app/components/elements/BlockWrapper";
import DContainer from "@/app/components/containers/DContainer";
import { TOA_CORETHEME_LABEL } from "@/app/constant/kirbyurl";
import { SUBTHEMELIST } from "@/app/constant/subthemelist";
import ReactPlayer from "react-player";
import { FilteredTermsData, ImagesCaption, ObjectRelationTextData, RelationListData } from "@/app/utils/swr/fetchdata";
import HSubContainer from "@/app/components/containers/HContainer_sub";
import HeadingText from "@/app/components/elements/HeadingText";
import ReactAudioPlayer from "react-audio-player";
import { formatTime } from "@/app/utils/hooks/etc";
import LoadingBox from "@/app/components/LoadingBox";
import DragAnimation from "@/app/components/elements/DragAnimation";
import MarkdownIt from "markdown-it";
import Image from "next/image";
import { METADATA_LABEL_TEXT } from "@/app/constant/metadataLabelText";





const ObejectWrapper = ({pageData, currentLanguage, query}) => {
  const getGlobalHeadingFontSize = useRecoilValue(globalHeadingFontSize);
  const setCurrentUrl = useSetRecoilState(globalCurrentUrl);
  const getPathname = usePathname();
  useEffect(() => {
    setCurrentUrl(getPathname);
  }, []);



  const router = useRouter();
  const md = MarkdownIt({html: true})
  const {isLoading:isloadingRelation, dataSwr:dataRelation} = ObjectRelationTextData({currentLanguage: currentLanguage})
  const {isLoading:isLoadingI, dataSwr:dataSwrI} = ImagesCaption({currentLanguage: currentLanguage})
  const {isLoading, dataSwr, error, relationListSWR} = RelationListData({currentLanguage: currentLanguage, objectData: pageData})
  const {isLoading:isLoadingF, dataSwr:dataSwrF, error:errorF, filteredTermsSWR} = FilteredTermsData({currentLanguage: currentLanguage, objectData: pageData})
  const [relationList, setRelationList] = useState({})
  const [filteredTerms, setFilteredTerms] = useState([])
  const [currentRelation, setCurrentRelation] = useState()
  const [imageFullSize, setImageFullSize] = useState(false)
  const [objImages, setObjImages] = useState(null)
  const [coverLayoutImageMeta, setCoverLayoutImageMeta] = useState(null)
  const [getRelationTextData, setRelationTextData] = useState(null)
  const [scrollTrigger, setScrollTrigger] = useState(false)
  const [currentHash, setCurrentHash] = useState("")
  useEffect(() => {
    if(!isloadingRelation){
      setRelationTextData(dataRelation.result)
    }
  },[dataRelation])
  useEffect(() => {
    if(!isLoadingI){
  
      const result = dataSwrI.result.images.find((value) => {
        if(value.uuid === String(pageData.object_image).slice(2)){
          return value
        }
      })

      setCoverLayoutImageMeta(result)
      
     
      setObjImages(dataSwrI.result.images)
    }
  },[dataSwrI])
  useEffect(() => {
    if(!isLoading && !isLoadingF){
      setRelationList(relationListSWR)
      setFilteredTerms(dataSwrF.result.filteredTerms)
      setCurrentRelation(Object.keys(relationListSWR)[0])
   
    }
  },[dataSwr, dataSwrF])

  const moveToContext = (path) => {
    const getBox = document.querySelector(`#${path}`)
    const boxPos = getBox.offsetTop
    window.scrollTo(0, boxPos)
    // window.location.hash = path;
    // router.push(`${window.location.origin}/${window.location.pathname}#${path}`)
  }
// Fixed Obj Indicator Bar
  useEffect(() => {
   

  const getIndicator = document.getElementById("indicatorBar")

  if(getIndicator){
      // 더미 요소 생성 (고정 시 높이를 차지할 공간)
      const placeholder = document.createElement('div');
      placeholder.style.width = `${getIndicator.clientWidth}px`;
      placeholder.style.height = `${getIndicator.clientHeight}px`;
  
    
  const scrollEvent = () => {
     
    const getHeader = document.getElementById("obj_header")
    const headerPos = getHeader?.clientHeight
    const currentScrollTop = document.documentElement.scrollTop

    if(headerPos > currentScrollTop){
        getIndicator.style.position = "relative"
        setScrollTrigger(false)
        if(placeholder.parentNode){
          getIndicator.parentNode.removeChild(placeholder);
           getIndicator.style.top = `${0}px`
        }
    }else{
      setScrollTrigger(true)
        getIndicator.style.position = "fixed"
        getIndicator.parentNode.insertBefore(placeholder, getIndicator);
        getIndicator.style.top = `${0}px`
    }

  }
  

    const getHeader = document.getElementById("obj_header")
    const headerPos = getHeader.clientHeight
    const currentScrollTop = document.documentElement.scrollTop

    if(headerPos > currentScrollTop){
        getIndicator.style.position = "relative"
        setScrollTrigger(false)
        if(placeholder.parentNode){
          getIndicator.parentNode.removeChild(placeholder);
           getIndicator.style.top = `${0}px`
        }
    }else{
        setScrollTrigger(true)
        getIndicator.style.position = "fixed"
        getIndicator.parentNode.insertBefore(placeholder, getIndicator);
        getIndicator.style.top = `${0}px`
    }

     window.addEventListener("scroll", scrollEvent)
     window.addEventListener("resize", scrollEvent)
  return () => {
    window.removeEventListener("scroll", scrollEvent)
    window.addEventListener("resize", scrollEvent)
   
  }
  
 
}
  },[])

  useEffect(() => {
    
    const objectO = document.querySelector("#o_object")
    const objectCate = document.querySelector("#o_context")
    const objectRelation = document.querySelector("#o_relation")
    
    const scrollEvent = () => {
      // 현재 페이지 스크롤 위치
      const pageScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  
      if (objectO) {
        const objectOTop = objectO.offsetTop; // #o_object의 위치
        const objectOHeight = objectO.offsetHeight;
  
        if (pageScrollTop >= objectOTop && pageScrollTop < objectOTop + objectOHeight) {
          setCurrentHash("object")
         
        }
      }
  
      if (objectCate) {
        const objectCateTop = objectCate.offsetTop; // #o_context의 위치
        const objectCateHeight = objectCate.offsetHeight;
  
        if (pageScrollTop >= objectCateTop && pageScrollTop < objectCateTop + objectCateHeight) {
          setCurrentHash("context")
          
        }
      }
  
      if (objectRelation) {
        const objectRelationTop = objectRelation.offsetTop; // #o_relation의 위치
        const objectRelationHeight = objectRelation.offsetHeight;
  
        if (pageScrollTop >= objectRelationTop && pageScrollTop < objectRelationTop + objectRelationHeight) {
          setCurrentHash("relation")
          
        }
      }
    };


    window.addEventListener("scroll", scrollEvent)
    return () => {
      window.removeEventListener("scroll", scrollEvent)
    }
  },[objImages])

  useEffect(() => {
    console.log(pageData)
  },[])
 
  return (
    <div
    className="w-screen h-full min-h-screen flex flex-col">
      <div id="obj_header" className={`w-screen overflow-hidden h-fit min-h-[109px] lg:min-h-[285px] flex flex-col justify-center items-center text-center break-words ${getGlobalHeadingFontSize ? "bg-white text-toa-black" : "bg-toa-black text-white"} text-white px-4 md:px-8`}>
        <div className="w-full flex gap-4 flex-col justify-center max-w-screen-2xl h-full pt-[56px]">
          <div className="flex-1 w-full lg:w-2/3 flex items-end mb-2">
            <HeadingText text={pageData.title} sub={false} defaultColor="white" />
          </div>
        </div>
      </div>
      <div id="indicatorBar" className={`relative z-[50] w-full flex bg-neutral-400 justify-between ${scrollTrigger ? "translate-y-[45px] lg:translate-y-[56px]" : "translate-y-0"}`}>
        <div onClick={() => moveToContext("o_object")} className={`flex-1 ${currentHash === "object" ? "bg-[#D8B792]" : "bg-[#F6EED5]"} hover:bg-[#D8B792] text-xs lg:text-sm font-headermsemibold p-2 cursor-pointer transition-all flex justify-center text-[#414B5A]`}>Object</div>
        <div onClick={() => moveToContext("o_context")} className={`flex-1 ${currentHash === "context" ? "bg-[#D8B792]" : "bg-[#F6EED5]"} hover:bg-[#D8B792] text-xs lg:text-sm font-headermsemibold p-2 cursor-pointer transition-all flex justify-center text-[#414B5A]`}>Context</div>
        <div onClick={() => moveToContext("o_relation")} className={`flex-1 ${currentHash === "relation" ? "bg-[#D8B792]" : "bg-[#F6EED5]"} hover:bg-[#D8B792] text-xs lg:text-sm font-headermsemibold p-2 cursor-pointer transition-all flex justify-center text-[#414B5A]`}>Relation</div>
      </div>
      <div className="w-full">
        <DContainer color="white" paddingOn={true}>
          <div id={"o_object"} className="py-4 lg:py-12 border-b border-neutral-300">
            {(pageData.object_file_type === "audiofile") && <AudioPlayer data={pageData} /> }
            {(pageData.object_file_type === "videourl") && <VideoPlayer file={pageData.object_file} />}
            {pageData.object_file_type === "imagefile" && (
              <>
              {imageFullSize && <div onClick={() => setImageFullSize(false)} className="fixed gap-2 flex-col top-0 left-0 w-screen h-[100svh] bg-black bg-opacity-90 z-[300] flex justify-center items-center p-4 lg:p-8">
                <div
                  style={{
                    backgroundImage: `url(${process.env.KB_API_FILE}/${String(yaml.load(
                      pageData.object_image
                    )).slice(7)})`,
                  }}
                  className="w-full h-full bg-contain bg-center bg-no-repeat overflow-hidden relative"
                ></div>
                <div className="text-white text-xs opacity-90">{coverLayoutImageMeta?.content?.caption}</div>
              </div>}

              <div className="w-full aspect-video flex gap-2 lg:gap-4 justify-center">
                <div className={`w-full ${pageData.object_image_layout === "true" ? "max-w-[70%]" : "max-w-[100%]"} h-full max-h-full overflow-hidden flex items-center`} >
                  <div className={`relative w-full h-full overflow-hidden flex justify-start  ${pageData.object_image_layout === "true" ? "items-start" : "items-center"}`}>
                    {/* <img 
                      src={`${process.env.KB_API_FILE}/${String(yaml.load(pageData.object_image)).slice(7)}`}
                      className="w-full h-auto max-w-full max-h-full object-contain rounded-xl" 
                      /> */}
                      <div className="w-full relative h-full rounded-xl overflow-hidden">
                      <Image
                          src={`${process.env.KB_API_FILE}/${String(yaml.load(pageData.object_image)).slice(7)}`}
                          alt=""
                          fill
                          quality={60}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                          style={{objectFit:"contain"}}
                          
                        />
                      </div>
                      
                    <div onClick={() => setImageFullSize(true)} className="absolute top-2 left-2 p-1 lg:top-4 lg:left-4 lg:p-2 bg-black text-white bg-opacity-70 rounded-full cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 lg:size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    </div>
                  </div>  
                </div>
                {(pageData.object_image_layout === "true" && Boolean(coverLayoutImageMeta)) && <div className=" min-w-1/3 w-1/3 flex-grow flex flex-col gap-2 lg:gap-4 overflow-hidden">
                  {/* <div className="min-w-36 w-full h-full rounded-xl overflow-hidden relative">
                    <div 
                     style={{
                      position: 'absolute',
                      top: `${-(parseFloat(coverLayoutImageMeta["content"]["layer1_right"]) ?? 60) * 3.5}%`, // 350%에 맞춰 위치 조정
                      left: `${-(parseFloat(coverLayoutImageMeta["content"]["layer1_left"]) ?? 45) * 3.5}%`,
                      width: '350%',
                      height: '350%',
                    }}
                    className="">
                      <Image
                        src={`${process.env.KB_API_FILE}/${String(yaml.load(
                          pageData.object_image
                        )).slice(7)}`}
                        alt="Cover Image"
                        layout="fill" // 부모 요소를 꽉 채우도록 설정
                        objectFit="cover" // backgroundSize: cover와 동일한 동작
                        // objectPosition={`${layer1Left}% ${layer1Right}%`} // backgroundPosition과 동일한 동작
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="min-w-36 w-full h-full rounded-xl overflow-hidden relative">
                    <div 
                     style={{
                      position: 'absolute',
                      top: `${-coverLayoutImageMeta["content"]["layer2_right"] ?? 40 * 3.5}%`, // 350%에 맞춰 위치 조정
                      left: `${-coverLayoutImageMeta["content"]["layer2_left"] ?? 55 * 3.5}%`,
                      width: '350%',
                      height: '350%',
                    }}
                    className="">
                      <Image
                        src={`${process.env.KB_API_FILE}/${String(yaml.load(
                          pageData.object_image
                        )).slice(7)}`}
                        alt="Cover Image"
                        layout="fill" // 부모 요소를 꽉 채우도록 설정
                        objectFit="cover" // backgroundSize: cover와 동일한 동작
                        // objectPosition={`${layer1Left}% ${layer1Right}%`} // backgroundPosition과 동일한 동작
                        className="rounded-xl"
                      />
                    </div>
                  </div> */}
                  <div
                    style={{
                    backgroundImage: `url(${process.env.KB_API_FILE}/${String(yaml.load(
                    pageData.object_image
                  )).slice(7)})`,
                  backgroundPosition: `${coverLayoutImageMeta["content"]["layer1_left"] ? coverLayoutImageMeta["content"]["layer1_left"] : 45}% ${coverLayoutImageMeta["content"]["layer1_right"] ? coverLayoutImageMeta["content"]["layer1_right"] : 60}%`,
                  backgroundSize: `350%`
                  
                }}
                    className="min-w-36 w-full h-full rounded-xl overflow-hidden bg-cover bg-no-repeat"></div>
                  <div
                    style={{
                    backgroundImage: `url(${process.env.KB_API_FILE}/${String(yaml.load(
                    pageData.object_image
                  )).slice(7)})`,
                   backgroundPosition: `${coverLayoutImageMeta["content"]["layer2_left"] ? coverLayoutImageMeta["content"]["layer2_left"] : 55}% ${coverLayoutImageMeta["content"]["layer2_right"] ? coverLayoutImageMeta["content"]["layer2_right"] : 40}%`,
                  backgroundSize: `350%`
                }}
                    className="min-w-36 w-full h-full rounded-xl overflow-hidden bg-cover bg-no-repeat bg-center"></div>
                </div>}
                {(pageData.object_image_layout === "true" && !Boolean(coverLayoutImageMeta)) && <div className=" min-w-1/3 w-1/3 flex-grow flex flex-col gap-2 lg:gap-4 overflow-hidden">
                  <div className="min-w-36 w-full h-full rounded-xl overflow-hidden bg-neutral-300 bg-cover bg-no-repeat"></div>
                  <div className="min-w-36 w-full h-full rounded-xl overflow-hidden bg-neutral-300 bg-cover bg-no-repeat bg-center"></div>
                </div>}
              </div>

              </>
            )}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 mt-8 lg:mt-14 text-[#414B5A] break-words">
              {pageData["cover_xray"] === "true" && <CoverXrayWrapper text={pageData.cover_text} textsource={pageData.cover_source} />}
              {(pageData["cover_xray"] === "false" || !Boolean(pageData["cover_xray"])) && <div className="flex-[2] font-normal text-base md:text-lg lg:text-xl break-words whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${(pageData.cover_text)}`}}></div>}
              <div className="flex-[1]">
                <div className="flex flex-wrap gap-2">
                  {pageData.coretheme
                    .split(",")
                    .map((v) => v.trim())
                    .map((v, idx2) => {
                      return (
                        <div
                          key={idx2}
                          style={{
                            backgroundColor: `${TOA_CORETHEME_LABEL[v].color}`,
                          }}
                          className="p-2 text-white rounded-md text-xs font-headerh1"
                        >
                          {" "}
                          {TOA_CORETHEME_LABEL[v].name}
                        </div>
                      );
                    })}
                </div>
                <div className="mt-4 lg:mt-4 flex flex-wrap gap-[0.25rem] font-headermregular text-sm lg:text-[16px] leading-[1.1]">
                  {
                    pageData.subtheme.map((v,idx) => {
                      return <span key={idx}>#{SUBTHEMELIST[v]}</span>
                    })
                  }
                  {/* {
                    pageData.dynamic_category && pageData.dynamic_category.map((v,idx) => {
                      return <span key={`a${idx}`}>#{v["category_box_name"]}</span>
                    })
                  } */}
                </div>
                <div className="w-full h-[0px] bg-none my-4 border border-[#414B5A] border-dashed"></div>
                <div className="flex flex-col gap-4 font-headermregular text-sm lg:text-[16px]">
                  <div className="flex flex-col">
                    {pageData["number_toa"] && <div><span className="text-[#A0A7B2]">{METADATA_LABEL_TEXT[currentLanguage].number_toa}:</span> {pageData["number_toa"]}</div>}
                    {pageData["year_of_object"] && <div><span className="text-[#A0A7B2]">{METADATA_LABEL_TEXT[currentLanguage].year_of_object}:</span> {pageData["year_of_object"]}</div>}
                    {pageData["date_of_collection"] && <div><span className="text-[#A0A7B2]">{METADATA_LABEL_TEXT[currentLanguage].date_of_collection}:</span> {pageData["date_of_collection"]}</div>}
                    {pageData["measurse"] && <div><span className="text-[#A0A7B2]">{METADATA_LABEL_TEXT[currentLanguage].measurse}:</span> {pageData["measurse"]}</div>}
                  </div>
                  
                  {pageData["provenance"] && <div className="flex flex-col"><span className="text-[#A0A7B2]">{METADATA_LABEL_TEXT[currentLanguage].provenance}:</span> {pageData["provenance"]}</div>}

                  {pageData["source_of_origin"] && <div className="flex flex-col"><span className="text-[#A0A7B2]">{METADATA_LABEL_TEXT[currentLanguage].source_of_origin}:</span> {pageData["source_of_origin"]}</div>}

                  {pageData["location"] && <div className="flex flex-col"><span className="text-[#A0A7B2]">{METADATA_LABEL_TEXT[currentLanguage].location}:</span> {pageData["location"]}</div>}
                   {
                    pageData.dynamic_category && pageData.dynamic_category.map((v,idx) => {
                      return <div key={idx} className="flex flex-col"><span className="text-[#A0A7B2]">{v["category_box_name"]}:</span> {v["category_box"]}</div>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </DContainer>

        {(!isLoadingF && filteredTerms && !isLoadingI && objImages) && <div id={"o_context"} className="w-full h-full flex flex-col gap-0 py-8">
          {pageData.contents &&
            pageData.contents.length > 0 &&
            pageData.contents.map((val, idx) => {
              return <BlockWrapper key={idx} content={val} images={objImages} playgroundTermData={filteredTerms} 
               />;
            })}
        </div>}
        {(!isLoading && relationList && currentRelation && !isloadingRelation && getRelationTextData) && <RelationWrapper getRelationTextData={getRelationTextData} objData={pageData} currentRelation={currentRelation} relationList={relationList} setCurrentRelation={setCurrentRelation} />}
      </div>
    </div>
  );
};

const RelationWrapper = ({getRelationTextData, objData, currentRelation, relationList, setCurrentRelation}) => {
 
  useEffect(() => {
    for(let i = 0; i < Object.keys(relationList).length; i++){
      if(relationList[Object.keys(relationList)[i]].length > 0){
        setCurrentRelation(Object.keys(relationList)[i])
        break;
      }
    }
  },[])

  const imageData = useMemo(() => {
    return [...relationList[currentRelation], objData];
  }, [relationList, currentRelation, objData]);

  return <div id={"o_relation"} className="w-full h-fit">
      <DContainer color="yellow">
        <HSubContainer>
          <div className="flex w-full flex-col gap-4 py-4">
            <div className="flex w-full justify-center">
              <div style={{lineHeight: 1.1}} className="text-xl md:text-2xl lg:text-4xl font-headerh1 w-2/3 text-center">
                {getRelationTextData.relation_title1} {" "}{objData.title}{getRelationTextData?.relation_title2 && ` ${getRelationTextData?.relation_title2}`}:
              </div>
            </div>
            <div className="w-full flex ">
              {
                Object.keys(relationList).map((v, idx) => {
                  return  <React.Fragment key={idx}>
                  {(v === "cureated" && relationList[v].length > 0) && <div onClick={() => setCurrentRelation(v)} className={`flex-1 py-2 border-b-4 text-center text-sm md:text-xl lg:text-2xl font-headerh1 cursor-pointer ${currentRelation === v ? "border-toa-yellow text-toa-yellow" : "border-[#1D0C01] text-toa-black"}`}>{getRelationTextData?.curateditem_btn_text}</div>}
                  {(v === "knowledge" && relationList[v].length > 0) && <div onClick={() => setCurrentRelation(v)} className={`flex-1 py-2 border-b-4 text-center text-sm md:text-xl lg:text-2xl font-headerh1 cursor-pointer ${currentRelation === v ? "border-toa-yellow text-toa-yellow" : "border-[#1D0C01] text-toa-black"}`}>{getRelationTextData?.knowledge_btn_text}</div>}
                  {(v !== "knowledge" && v !== "cureated" && relationList[v].length > 0) && <div onClick={() => setCurrentRelation(v)} className={`flex-1 py-2 border-b-4 text-center text-sm md:text-xl lg:text-2xl font-headerh1 cursor-pointer ${currentRelation === v ? "border-toa-yellow text-toa-yellow" : "border-[#1D0C01] text-toa-black"}`}>{SUBTHEMELIST[v]}</div>}
                  </React.Fragment>
                })
              }
            </div>
            <div className="w-full flex h-[80svh]">
              <DragAnimation imageData={imageData} center={true} relation={true} />
            </div>
          </div>
        </HSubContainer>
      </DContainer>
  </div>
}

const AudioPlayer = ({data}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [getDuration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentVolume, setCurrentVolume] = useState(null)
  const [toggleSound, setToggleSound] = useState(false)
  const audioRef = useRef(null);
  const [ready, setReady] = useState(false)




  const onLoaded = (e) => {
 
    setCurrentVolume(e.currentTarget.volume)
    setDuration(e.currentTarget.duration)
    setReady(true)
   
  }
  useEffect(() => {
    if(audioRef){
      setReady(true)
      setCurrentVolume(audioRef.current.audioEl.current.volume)
      setDuration(audioRef.current.audioEl.current.duration)
     
    }
  },[])
  useEffect(() => {
    
    if(isPlaying){
      if(audioRef){
        const audioBox = audioRef.current.audioEl.current;
        if(audioBox){
          const onTimeUpdate = () => {
        
            // 
            setCurrentTime(audioBox.currentTime)
            if(audioBox.ended){
              // video ended
              // - update play icon
              // - update progress bar
              
              setIsPlaying(false)
              setCurrentTime(0)
           }
          }
          audioBox.ontimeupdate = onTimeUpdate

          return () => {
            audioBox.ontimeupdate = null
          }
        }
      }
    }
  },[isPlaying])
  const onClickProgressBar = (e) => {
    const newTime = e.target.value;
    const audioBox = audioRef.current.audioEl.current;
   
    if (audioBox) {
      audioBox.currentTime = newTime;
      setCurrentTime(newTime); // Ensure the UI reflects the new time
    }
 }
  const onClick = () => {
    if(audioRef){
      const audioBox = audioRef.current.audioEl.current;
      if(audioBox){
        if(audioBox.paused){
          audioBox.play()
          setIsPlaying(true)
        }else{
          audioBox.pause()
          setIsPlaying(false)
        }
        
        
      }
    }
  }
  return (
    <div className="w-full flex flex-col justify-center items-center text-base md:text-lg lg:text-xl py-2 ">
      {data && <ReactAudioPlayer controls={false} ref={audioRef} src={`${process.env.KB_API_FILE}/${String(yaml.load(data.object_audio))}`} onLoadedMetadata={onLoaded} />}
      {(audioRef && ready) && <div className="flex items-center w-10/12 md:min-w-[500px] md:w-fit px-2 py-2 rounded-lg border-toa-blue bg-white border-2 gap-1">
        <div onClick={onClick} className="min-w-10 w-10 h-10 flex justify-center items-center rounded-full  text-toa-blue cursor-pointer hover:bg-toa-blue hover:text-white transition-all">
          {!isPlaying && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>}
          {isPlaying && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>}
        </div>
        <div className="text-xs w-full flex items-center gap-2 pr-3">
          <div>{formatTime(currentTime)}</div>
          <div className="w-full h-[4px] bg-toa-blue ">
               <div className="w-full h-[4px] rounded-full relative">
                  <input onChange={(e) => onClickProgressBar(e)} step={0.01} min={0} max={getDuration} defaultValue={0} type="range" className="w-full bg-toa-blue range-custom" />
                  <progress value={currentTime} max={getDuration} className="absolute bg-toa-blue w-full h-full select-none pointer-events-none"></progress>
              </div>
          </div>
          <div>{formatTime(getDuration)}</div>
        </div>
      
      </div>}
     
    </div>
  )
}

const VideoPlayer = ({file}) => {
  const [isClietn, setIsClient] = useState(false)
  useEffect(() => {
    // Set to true after the component is mounted
    setIsClient(true);
  }, []);
  return (
    <>
    {isClietn && <div className="w-full aspect-video rounded-xl overflow-hidden">
      {ReactPlayer.canPlay(file) ? (
        <ReactPlayer
          fallback={
            <LoadingBox />
          }
          controls={true}
          width={"100%"}
          height={"100%"}
          url={file}
        />
      ) : <div className="w-full h-full bg-neutral-500 text-white flex justify-center items-center">
          <div>The video is currently unavailable.
          Please check the URL or try again later</div>
        </div>}
    </div>}
    </>
  )
}


const CoverXrayWrapper = ({text, textsource}) => {
  const md = MarkdownIt({html: true})
  useEffect(() => {
    let pos1 = 0;
    let pos2 = 0;

    const XrayCursor = document.querySelector("#xray-cursor");
    const XrayBox = document.querySelector("#xray-box");
    const WrapperBox = document.querySelector("#wrapper-box");

    // Handle mouse/touch up event globally to stop mousemove/touchmove
    const handleMouseUp = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };

    // Handle mouse/touch move event to adjust the XrayCursor position
    const handleMouseMove = (e) => {
      e.preventDefault();
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      pos2 = pos1 - clientY; // Calculate movement difference
      pos1 = clientY;

      const newCursorTop = XrayCursor.offsetTop - pos2;
      const maxHeight = WrapperBox.clientHeight;

      // Clamp the XrayCursor position between 0 and the height of WrapperBox
      const clampedTop = Math.max(0, Math.min(newCursorTop, maxHeight));

      // Adjust the XrayBox height and XrayCursor top position
      XrayBox.style.height = `${maxHeight - clampedTop}px`;
      XrayCursor.style.top = `${clampedTop}px`;
    };

    // Handle mousedown/touchstart event on the XrayCursor element
    const handleMouseDown = (e) => {
      e.preventDefault();
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      pos1 = clientY;

      // Bind mousemove and mouseup events
      document.onmousemove = handleMouseMove;
      document.onmouseup = handleMouseUp;

      // Bind touchmove and touchend events
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("touchend", handleMouseUp);
    };

    // Bind mousedown and touchstart event listeners to the XrayCursor
    if (XrayCursor) {
      XrayCursor.onmousedown = handleMouseDown;
      XrayCursor.addEventListener("touchstart", handleMouseDown);
    }

    // Cleanup event listeners on component unmount
    return () => {
      document.onmousemove = null;
      document.onmouseup = null;
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
      if (XrayCursor) {
        XrayCursor.onmousedown = null;
        XrayCursor.removeEventListener("touchstart", handleMouseDown);
      }
    };
  }, []);
  
  return <div id="wrapper-box" className="flex-[2.5] w-full flex gap-2 font-normal">
      <div className="flex items-start font-headermsemibold text-toa-blue">
        <div className="-translate-y-1/2">
          {`>>`}
        </div>
      </div>
      <div className="h-full break-words relative">
          <div className="font-normal text-base md:text-lg lg:text-xl whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${(text)}`}}></div>
          <div id="xray-box" className="absolute w-full h-full bottom-0 left-0 bg-white bg-opacity-90 border-t-2 border-toa-blue flex justify-center">

          </div>
          <div className="absolute w-full h-0 top-0 left-0 flex justify-center ">
            <div id="xray-cursor" className="w-12 h-12 bg-toa-blue flex -translate-y-1/2 cursor-pointer rounded-full justify-center items-center text-white relative group select-none">
              <div className="absolute top-1/2 left-1/2 translate-x-[0px] opacity-0 select-none pointer-events-none group-hover:opacity-100 group-hover:translate-x-[30px] -translate-y-1/2 bg-neutral-700 px-3 py-2 rounded-xl transition-all duration-300 text-[11px] leading-tight break-words w-[150px] z-[50]">Drag up or down, and release to move the button vertically</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
              <div className="flex absolute top-0 left-1/2 -translate-x-1/2 translate-y-[calc(58px)] w-[200px] p-2 bg-toa-blue bg-opacity-100 select-none pointer-events-none" dangerouslySetInnerHTML={{__html: `${(textsource)}`}}></div>
            </div>
          </div>
        </div>  
        <div className="flex items-end font-bold text-toa-blue">
        <div className="translate-y-1/2">
          {`<<`}
        </div>
      </div>
  </div>
  
  
}

export default ObejectWrapper;
