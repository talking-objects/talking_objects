import ThemeBtn from "@/app/components/elements/Theme_Btn";
import { BUTTONLIST } from "@/app/constant/kirbyurl";
import { useEffect, useMemo, useRef, useState } from "react";
import yaml from "js-yaml"
import CoreThemeWrapper from "@/app/components/CoreThemeNav";
import DContainer from "@/app/components/containers/DContainer";
import { SUBTHEMELIST } from "@/app/constant/subthemelist";
import FloatingAnimation from "@/app/components/elements/FloatingAnimation";
import DragAnimation from "@/app/components/elements/DragAnimation";
import { useSetRecoilState } from "recoil";
import { resetHeaderHeightTrigger } from "@/app/utils/recoil/state";
const ThemeHeader = ({data, themePageText, params }) => {
  const randomImageParentRef = useRef()
  const [getCurrentSubTheme, setCurrentSubTheme] = useState("")
  const [getListSubThemeList, setListSubThemeList] = useState(null)
  const setResetHeaderHeightTrigger = useSetRecoilState(resetHeaderHeightTrigger)
  const [getBGColor, setBGColor] = useState()
  const [isOpenCoreThemeText, setIsOpenCoreThemeText] = useState(false)

  useEffect(() => {
    const getButtonInfo = BUTTONLIST.filter((v) => v.slug === params.slug)
    const getColor = getButtonInfo[0].color
    setBGColor(getColor)
  },[]) 

  const getAboutText = (slug) => {
    const lang = {
      knowledge: "about_knowledge",
      resitution: "about_resitution",
      identity: "about_identity",
      "memory-the-imaginary": "about_memory",
      "artistic-reflections": "about_artisticreflections",
    };
    return lang[slug];
  };

  const changeCurrentSubTheme = (subTheme) => {
    setIsOpenCoreThemeText(false)
    setResetHeaderHeightTrigger((prev) => !prev)
    if(getCurrentSubTheme !== subTheme){
      setCurrentSubTheme(subTheme)
      getPreviewList(subTheme)
    }else{
      setCurrentSubTheme("")
      getPreviewList("")
    }
    
  }

  function getRandomElements(array, count) {
    let nCount = count 
    if (count > array.length) {
      nCount = array.length - 1;

        // throw new Error("Count cannot be greater than the array length.");
    }

    // 배열 복사본 생성
    const arrayCopy = [...array];
    const randomElements = [];

    for (let i = 0; i < nCount; i++) {
        // 랜덤 인덱스 선택
        const randomIndex = Math.floor(Math.random() * arrayCopy.length);

        // 랜덤 요소 추출 및 배열에서 제거
        randomElements.push(arrayCopy.splice(randomIndex, 1)[0]);
    }

    return randomElements;
}

  const getPreviewList = (subTheme) => {
   
    const selectedSubTheme = subTheme;
    let result = [];
    if(data){
      const newData = [...data].filter((val) => val.subtheme.includes(selectedSubTheme));
     if(subTheme !== ""){
      result = getRandomElements(newData, 8)
      // setListSubThemeList(result)

      // for(let i = 0; i < data.length; i++){
      //   const obj = data[i]
      //   const objSubThemes = obj.subtheme.split(",").map((v) => v.trim())
      //   // 
      //   const ok = objSubThemes.some((v) => v === selectedSubTheme);
      //   if(ok){
      //     result.push(data[i])
      //     if(result.length >= 6){
            
      //       setListSubThemeList(result)
      //       break;
      //     }
      //   }
      // }
     }else{
      result = getRandomElements(data, 8)
      // If a subtheme is not selected, then show the first 6 items.
     
     }
    }
    
    setListSubThemeList(result)
  }
  const onClickThemeText = () => {
    setIsOpenCoreThemeText((prev) => !prev)
    setCurrentSubTheme("")
      getPreviewList("")
  }

  useEffect(() => {
    getPreviewList("")
  },[data])
 
 
  return (
    <div style={{backgroundColor: getBGColor}} className="headerbox scrollheader w-screen min-h-[100svh] h-full relative flex flex-col justify-start overflow-x-hidden">
        <div className={`absolute right-0 top-[200px] lg:top-[56px] bg-none w-full lg:w-1/2  h-[calc(100svh-149px-200px)] lg:h-[calc(100svh-75px-56px)] z-[50] duration-300 ${isOpenCoreThemeText ? "translate-x-0" : "translate-x-full"} text-black flex flex-col py-[20px] px-4`}>
            <div className="w-full h-full flex flex-col flex-1 bg-neutral-50 p-4 rounded-lg shadow-lg shadow-black-50/50 ">
              <div className="mb-4 w-full flex justify-end">
                <div onClick={onClickThemeText} className="cursor-pointer">
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-8 lg:size-10"
                  >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                  </svg>
                </div>
              </div>
              <div className="w-full h-full overflow-y-scroll">
                <div style={{lineHeight: 1.5}} className="text-black h-fit overflow-y-scroll font-normal text-sm md:text-base lg:text-xl lg:min-h-[140px] pb-8">{themePageText.code === 200 && (themePageText.result[getAboutText(params.slug)])}</div>
              </div>
            </div>
        </div>
      <DContainer id={"o_object"} color="none" paddingOn={true}>
        <div className="w-full h-fit pb-[75px] lg:h-[calc(100svh-75px)] flex flex-col justify-center lg:flex-row pt-[56px] lg:pt-[40px] gap-8">
          <div className="w-full h-ful flex justify-center flex-col gap-4">
            <div className="font-headerh1 text-[30px] md:text-[35px] lg:text-[45px] text-white leading-tight flex-wrap">
              <span>{themePageText.result["theme_title"]}</span>
              <span onClick={onClickThemeText} className="cursor-pointer flex gap-2 items-center flex-wrap ">
                <span className="text-toa-black underline underline-offset-8 flex flex-wrap">{BUTTONLIST.find((v) => v.slug === params.slug).name}</span>
                <span className="text-toa-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </span>
              </span>
            </div>
            {(data && Boolean(getListSubThemeList)) && <div className="flex flex-wrap gap-y-2">
              {Object.keys(SUBTHEMELIST).map((val, idx) => {
                return <div onClick={() => changeCurrentSubTheme(val)} className={`cursor-pointer mr-8  leading-3 select-none font-headermregular text-base md:text-xl lg:text-xl text-white tracking-tighter  ${getCurrentSubTheme === val ? "opacity-100 underline " : "opacity-50"}`} key={idx}>{SUBTHEMELIST[val]}</div>
              })}
            </div>}
            {/* {getCurrentSubTheme === "" && <div className="text-white h-fit overflow-y-scroll font-normal text-sm md:text-base lg:text-lg lg:min-h-[140px] pb-8">{themePageText.code === 200 && (themePageText.result[getAboutText(params.slug)])}</div>} */}
            {getCurrentSubTheme !== "" && !isOpenCoreThemeText && <div className="text-white h-fit overflow-y-scroll font-normal text-sm md:text-base lg:text-lg lg:min-h-[140px] pb-8">{themePageText.code === 200 && themePageText.result[getCurrentSubTheme]}</div>}
            {getCurrentSubTheme !== "" && !isOpenCoreThemeText && <div className="hidden lg:flex justify-center items-center text-white text-xs gap-1 opacity-100 animate-pulse">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <div>scroll</div>
            </div>}
          </div>
          <div ref={randomImageParentRef} className="w-full h-full relative flex items-center justify-center ">
            {(data && Boolean(getListSubThemeList)) && <div className="w-full aspect-square hidden lg:flex">
              {/* Floating Component */}
              {/* <FloatingAnimation headerImages={getListSubThemeList} noAnimation={false} opacity={true} /> */}
              <DragAnimation imageData={getListSubThemeList} isLoading={false} relation={true} />
              </div>}
            {(data && Boolean(getListSubThemeList)) && <div className="w-full h-full grid grid-cols-3 lg:hidden gap-4 pb-8">
              {
                getListSubThemeList.map((v, idx) => {
                  return <MobilePreviewBox key={idx} value={v} />
                })
              }
              </div>}
          </div>
        </div>
      </DContainer>
      <CoreThemeWrapper />
    
    </div>
  );
};

const MobilePreviewBox = ({value}) => {
  const randomColor = useMemo(() => {
    const bgColor = [
      '#FF5B1C',
      '#FEA30C',
      '#AC05F1',
      '#800020',
      '#84A6FF',
    ]
    return bgColor[Math.floor(Math.random() * bgColor.length)]
  },[])
  return <div 
      style={{
        backgroundImage: `url(${process.env.KB_API_FILE}/${yaml.load(value.coverimage)})`,
        backgroundColor: randomColor
      }}
      className="bg-cover bg-center bg-no-repeat rounded-lg">
                    
  </div>
}

export default ThemeHeader;
