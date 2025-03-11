"use client"


import { useSetRecoilState } from "recoil";
import HomeAbout from "./Home_About";
import HomeHeader from "./Home_Header"
import HomePlayGround from "./Home_Playground";
import HomeSubHeader from "./Home_SubHeader";
import HomeTeam from "./Home_Team";
import { globalCurrentUrl } from "@/app/utils/recoil/state";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FilterData, HomeData } from "@/app/utils/swr/fetchdata";

const HomeWrapper = ({homeText, currentLanguage}) => {
    const {dataSwr, isLoading } = HomeData({currentLanguage})

    // 💾Pre Fetch (Explore Page & Themes Page)
    const queryText = `page("objects").children`
    const {dataSwr:tDataSwr, isLoading:tIsLoading} = FilterData({queryText:queryText,currentLanguage:currentLanguage})
    const {} = FilterData({queryText:`page("objects").children.filterBy('coretheme', '*=', 'knowledge')`,currentLanguage:currentLanguage})
    const {} = FilterData({queryText:`page("objects").children.filterBy('coretheme', '*=', 'resitution')`,currentLanguage:currentLanguage})
    const {} = FilterData({queryText:`page("objects").children.filterBy('coretheme', '*=', 'identity')`,currentLanguage:currentLanguage})
    const {} = FilterData({queryText:`page("objects").children.filterBy('coretheme', '*=', 'artisticreflections')`,currentLanguage:currentLanguage})
    const {} = FilterData({queryText:`page("objects").children.filterBy('coretheme', '*=', 'memory')`,currentLanguage:currentLanguage})
   


    const [subHeaderImages, setSubHeaderImages] = useState([])
    const [headerImages, setHeaderImages] = useState([])
    function getRandomElements(array, count) {
        let nCount = count
        if (count > array.length) {
            // throw new Error("Count cannot be greater than the array length.");
            nCount = array.length - 1;
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
    useEffect(() => {
        if(!tIsLoading){
            setSubHeaderImages(tDataSwr.result)
            
            const getRandomHeaderList = getRandomElements(tDataSwr.result, 8)
            setHeaderImages(getRandomHeaderList)

        }
    },[tDataSwr])

    useEffect(() => {
     if(!isLoading){
        
        // setHeaderImages(dataSwr.result.data)
     }
    },[dataSwr])

    const setCurrentUrl = useSetRecoilState(globalCurrentUrl)
    const getPathname = usePathname()
    useEffect(() => {
        setCurrentUrl(getPathname)
    },[])
    return (
        <>
       
        <div className="w-screen h-full">
            <HomeHeader isLoading={isLoading} data={homeText.result} headerImages={headerImages} />
            <HomeSubHeader randomEntities={subHeaderImages} text={homeText.result.home_sub_header} />
            <HomeAbout title={homeText.result.home_about_title} text={homeText.result.home_about_text} buttonText={homeText.result.open_about_btn} />
            <HomePlayGround headerImages={headerImages} title={homeText.result.home_playground_title} text={homeText.result.home_playground_text} buttonText={homeText.result.open_playground_btn} />
            <HomeTeam title={homeText.result.home_team_title} text={homeText.result.home_team_text} buttonText={homeText.result.open_team_btn} />
        </div>
        </>
    )
}

export default HomeWrapper;