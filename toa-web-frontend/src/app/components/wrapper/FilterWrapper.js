"use client"

import DContainer from "@/app/components/containers/DContainer"
import PageHeader from "@/app/components/containers/PageHeader"
import EntityCoverBox from "@/app/components/elements/EntityCoverBox"
import { TOA_CORETHEME_CATEGORY } from "@/app/constant/kirbyurl"
import { SUBTHEMELIST } from "@/app/constant/subthemelist"
import ThemeHeader from "@/app/themes/[slug]/components/ThemeHeader"
import { globalCurrentUrl, globalDetectNavDirection, globalHeadingFontSize, resetHeaderHeightTrigger } from "@/app/utils/recoil/state"
import { FilterData, FilterData2, HomeData } from "@/app/utils/swr/fetchdata"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useRecoilValue, useSetRecoilState } from "recoil"
import LoadingBox2 from "../LoadingBox2"
import Image from "next/image"
import FilterIcon from "/public/assets/icons/filter.svg"
import FilterIconB from "/public/assets/icons/filter_b.svg"
import SortIcon from "/public/assets/icons/sort.svg"
import SearchIcon from "/public/assets/icons/search.svg"
import CouterIcon from "/public/assets/icons/object-counter.svg"
import gsap from "gsap"


const FCategoryTitle = ({text}) => {
    return <div className="font-headermsemibold text-lg mb-4">{text}</div>
}
const FCategoryText = ({text}) => {
    return <div className="font-headermregular text-base">{text}</div>
}


const FilterWrapper = ({ pageText, explore=true, themeButtonText={}, currentLanguage="en", queryText}) => {
    const getPathname = usePathname()
    const setCurrentUrl = useSetRecoilState(globalCurrentUrl)
    useEffect(() => {
        setCurrentUrl(getPathname)
    },[])

    const [currentPage, setCurrentPage] = useState(1)
    const {dataSwr, isLoading, error, categoryListSwr} = FilterData({queryText:queryText,currentLanguage:currentLanguage})
    // const {dataSwr:dataSwr2, isLoading:isLoading2, error:error2, categoryListSwr:categoryListSwr2} = FilterData2({queryText:queryText,currentLanguage:currentLanguage})
    const [entitiesData, setEntitiesData] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const gloablNavDirectionValue = useRecoilValue(globalDetectNavDirection)
    const getResetHeaderHeightTrigger = useRecoilValue(resetHeaderHeightTrigger)

    const params = useParams();
    
    // filter Nav
    const filterNav = useRef(null)
    const [aniTrigger, setAniTrigger] = useState(false)
    const [filterBy, setFilterBy] = useState(false)
    const [filterLoadMore, setFilterLoadMore] = useState(false)
    const {control, handleSubmit, reset} = useForm()
    const {handleSubmit: handleSubmitSearch, register, getValues, setValue, reset: resetSearch} = useForm()

    const [filtered, setFiltered] = useState(false)
    const [searched, setSearched] = useState(false)
    const [triggerMobileInput, setTriggerMobileInput] = useState(false)
    const {register:register3, getValues:getValues3, watch:watch3, reset:reset3, setValue:setValue3} = useForm();

    const sParams = useSearchParams()
    // const { page } = router.query;

    const fadeInAndOut = () => {
        gsap.to(".coverbox", {
            duration: 0.8,
            opacity: 1, 
            y: 0,
            stagger: {
                amount: 0.5
            },
            // ease: "elastic",
        }) 
    }
    // useEffect(() => {
    //     if(!isLoading2){
    //         console.log(dataSwr2)
    //     }
    // },[dataSwr2])

  // 페이지 로드 시 URL에서 페이지 번호를 가져와 초기 상태 설정
  useEffect(() => {
    if (Boolean(sParams.get("page"))) {
      setCurrentPage(parseInt(sParams.get("page"), 10));
    }
  }, [sParams.get("page")]);

   // currentPage가 변경될 때 URL 쿼리 파라미터 업데이트
   useEffect(() => {
   window.history.replaceState(null, '', `?page=${currentPage}`);

  }, [currentPage]);


    useEffect(() => {
        if(!isLoading && Boolean(entitiesData)){
            fadeInAndOut()
        }
    },[isLoading, entitiesData])
    useEffect(() => {
        if(!isLoading && Boolean(entitiesData)){
            fadeInAndOut()
        }
    },[currentPage])
 
    useEffect(() => {
        if(!isLoading){
            // console.log(dataSwr.result)
            setCategoryList(categoryListSwr)
            setEntitiesData(dataSwr.result)
           
        }
    },[dataSwr])

    useEffect(() => {
        if(!isLoading){
            if(entitiesData){
                let sortedData = [...entitiesData]; 
                onChangeSortMethod(sortedData)
               
            }
        }
       
    },[watch3("sorting")])

    // Filter Nav Sticky 
    useEffect(() => {
        // 더미 요소 생성 (고정 시 높이를 차지할 공간)
        const placeholder = document.createElement('div');
        placeholder.style.width = `${filterNav.current.clientWidth}px`;
        placeholder.style.height = `${filterNav.current.clientHeight}px`;

        const scrollEvent = () => {
            const headerbox = document.querySelector(".headerbox")
            const headerPos = headerbox?.clientHeight
            const currentScrollTop = document.documentElement.scrollTop
            if(headerPos > currentScrollTop){
                if(filterNav.current){
                    setAniTrigger(false)
                    filterNav.current.style.position = "relative"
                    filterNav.current.style.top = `${0}px`
                    if(placeholder.parentNode){
                        filterNav.current.parentNode.removeChild(placeholder);
                    }
                }
                
            }else{
                setAniTrigger(true)
                if(filterNav.current){
                    filterNav.current?.parentNode.insertBefore(placeholder, filterNav.current);
                    filterNav.current.style.position = "fixed"
                    filterNav.current.style.top = `${0}px`
                }
            }
        }

        const resizeEvent = () => {
            const headerbox2 = document.querySelector(".headerbox")
            const headerPos = headerbox2?.clientHeight
            const currentScrollTop2 = document.documentElement.scrollTop
            if(headerPos > currentScrollTop2){
                setAniTrigger(false)
                filterNav.current.style.position = "relative"
                filterNav.current.style.top = `${0}px`
                if(placeholder.parentNode){
                    filterNav.current.parentNode.removeChild(placeholder);
                }
            }else{
                setAniTrigger(true)
                filterNav.current.parentNode.insertBefore(placeholder, filterNav.current);
                 filterNav.current.style.position = "fixed"
                 filterNav.current.style.top = `${0}px`
            }
        }
        if(filterNav){
            const headerbox = document.querySelector(".headerbox")
            const headerPos = headerbox.clientHeight
            const currentScrollTop = document.documentElement.scrollTop
            if(headerPos > currentScrollTop){
                setAniTrigger(false)
                filterNav.current.style.position = "relative"
                if(placeholder.parentNode){
                    filterNav.current.parentNode.removeChild(placeholder);
                }
            }else{
                setAniTrigger(true)
                filterNav.current.style.position = "fixed"
                filterNav.current?.parentNode.insertBefore(placeholder, filterNav.current);
                filterNav.current.style.top = `${0}px`
            }
            window.addEventListener("scroll", scrollEvent)
            window.addEventListener("resize", resizeEvent)
        }
        return () => {
            window.removeEventListener("scroll", scrollEvent)
            window.removeEventListener("resize", resizeEvent)
        }
        
    },[filterNav, getResetHeaderHeightTrigger])
    const onChangeSortMethod = (sortedData) => {
        const getData = getValues3("sorting")
        switch (getData) {
            case "name_asc":
              sortedData.sort((a, b) => a.title.localeCompare(b.title)); // Ascending sort
              break;
            case "name_desc":
              sortedData.sort((a, b) => b.title.localeCompare(a.title)); // Descending sort
              break;
            case "type_asc":
              sortedData.sort((a, b) => a.entity_type.localeCompare(b.entity_type)); // Descending sort
              break;
            case "type_desc":
              sortedData.sort((a, b) => b.entity_type.localeCompare(a.entity_type)); // Descending sort
              break;
            default:
              break;
        }
        setEntitiesData(sortedData)
       
    }
    const serachFilter = () => {
        reset();
        reset3()

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          const getSearchValue = getValues("searchBar");
          const pattern = new RegExp(`\\b${escapeRegExp(getSearchValue)}`, "gi");
        //   const pattern = new RegExp(`\\b${escapeRegExp(getSearchValue)\\b}`, "gi");

          let currentData = JSON.parse(JSON.stringify(dataSwr.result));

          currentData = currentData.filter((v) => {
       
            const matches = String(`
                ${v.title}${" "}
                ${v?.cover_text}${" "}
                ${v?.preview_text}${" "}
                ${v?.coretheme}${" "}
                ${v?.entity_type}${" "}
                ${v?.year_of_object}${" "}
                ${v?.provenance}${" "}
                ${v?.number_toa}${" "}
                ${v?.source_of_origin}${" "}
                ${v?.date_of_collection}${" "}
                ${v?.measurse}${" "}
                ${v?.location}${" "}
                ${v?.dynamic_category ? v?.dynamic_category.map(v => v.category_box).join(",") : ""}${" "}
                ${v?.dynamic_category ? v?.dynamic_category.map(v => v.category_box_name).join(",") : ""}${" "}
                `).match(pattern);
            if (matches) {
              return v;
            }
          });

            //   Search 열기
          setSearched(true)


          // 필터종료
          setFiltered(false)
          // 필터창 닫기
          setFilterBy(false);
          setCurrentPage(1)

          
          setEntitiesData(currentData);

    }
    const serachFilterM = () => {
        reset();
        reset3()

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          const getSearchValue = getValues("searchBarM");
          const pattern = new RegExp(`\\b${escapeRegExp(getSearchValue)}\\b`, "gi");

          let currentData = JSON.parse(JSON.stringify(dataSwr.result));

          currentData = currentData.filter((v) => {
       
            const matches = String(`
                ${v.title}${" "}
                ${v?.cover_text}${" "}
                ${v?.preview_text}${" "}
                ${v?.coretheme}${" "}
                ${v?.entity_type}${" "}
                ${v?.year_of_object}${" "}
                ${v?.provenance}${" "}
                ${v?.number_toa}${" "}
                ${v?.source_of_origin}${" "}
                ${v?.date_of_collection}${" "}
                ${v?.measurse}${" "}
                ${v?.location}${" "}
                ${v?.dynamic_category ? v?.dynamic_category.map(v => v.category_box).join(",") : ""}${" "}
                ${v?.dynamic_category ? v?.dynamic_category.map(v => v.category_box_name).join(",") : ""}${" "}
                `).match(pattern);
            if (matches) {
              return v;
            }
          });

            //   Search 열기
          setSearched(true)


          // 필터종료
          setFiltered(false)
          // 필터창 닫기
          setFilterBy(false);
          setCurrentPage(1)

          
          setEntitiesData(currentData);

    }

    // Apply Filter AND FILTER
    const applyFilter = (cateData) => {
        if (filterBy) {
            resetSearch();
            reset3()
         
            // 필터 카테고리에서 선택된 항목이 있는 카테고리만 필터링
            const keys = Object.keys(cateData).filter((val) => cateData[val].length > 0);

            // 데이터 복사
            let currentData = JSON.parse(JSON.stringify(dataSwr.result));
            
            const result = [];
          
            // 데이터 필터링
            currentData.forEach((object) => {
                if(object["coretheme"]){
                    let coreThemeData = JSON.parse(JSON.stringify(object["coretheme"]))
                    coreThemeData = coreThemeData.split(",").map((v) => v.trim())
                    const hasItems = cateData["coretheme"] ? coreThemeData.some((obj) => cateData["coretheme"].includes(obj)) : false;
                    if(hasItems){
                        result.push(object);
                    }else{
                        if(object["subtheme"]){
                            let subThemeData = JSON.parse(JSON.stringify(object["subtheme"]))
                            subThemeData = subThemeData.split(",").map((v) => v.trim())
                            const hasItems = subThemeData.some((obj) => cateData["subtheme"].includes(obj));
                
                            if(hasItems){
                                result.push(object);
                            }else{
                                if (object["dynamic_category"]) {
                                    // object["dynamic_category"]는 array 타입
                                    const hasCategory = object["dynamic_category"].some((obj) => keys.includes(obj["category_box_name"]));
                                    
                                    // 일치하는 카테고리가 있을 경우 필터링 진행
                                    if (hasCategory) {
                                        for (let i = 0; i < object["dynamic_category"].length; i++) {
                                            const categoryBoxName = object["dynamic_category"][i]["category_box_name"];
                                           
                                            // 해당 카테고리의 필터 값이 있는지 확인
                                            if (cateData[categoryBoxName]?.length > 0) {
                                                const filterItems = cateData[categoryBoxName];
                
                                                if(filterItems[0] === "all"){
                                                    result.push(object); 
                                                    break;
                                                }
                                                // category_box의 값에서 필터 항목과 일치하는지 확인
                                                // const itemValues = object["dynamic_category"][i]["category_box"].split(",").map((v) => v.trim());
                                                // console.log(itemValues)
                                                // const hasItems = itemValues.some((item) => filterItems.includes(item));
                                                const itemValues = object["dynamic_category"][i]["category_box"].split(",").map((v) => v.trim().toLowerCase()); // 모든 값을 소문자로 변환

                                                const lowerCaseFilterItems = filterItems.map((item) => item.toLowerCase()); // 필터 항목도 소문자로 변환
                                                                                            
                                                const hasItems = itemValues.some((item) => lowerCaseFilterItems.includes(item));
                                                
                                                // 일치하는 항목이 있을 경우 결과에 추가 후 루프 종료
                                                if (hasItems) {
                                                    result.push(object); 
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
            });
    
            
            // filterIcon.style.fill ="black"

            setFiltered(true)
            setCurrentPage(1)
            // 필터링된 데이터를 상태로 설정
            setEntitiesData(result);
    
            // 필터창 닫기
            setFilterBy(false);

            // Search 닫기
            setSearched(false)
        }
    };
    const resetFilter = () => {
        resetSearch()
        // Reset react use form
        reset()
        // reset pagination
        setCurrentPage(1)
        // 데이터 리셋
        setEntitiesData(dataSwr.result);
        // 필터종료
        setSearched(false)
        setFiltered(false)
        // 필터창 닫기
        setFilterBy(false);
        // Reset Sorting Value
        setValue3("sorting", "name_asc")
    }

    const onResetSearch = () => {
        resetFilter()
        resetSearch()
        // reset pagination
        setCurrentPage(1)
        // 데이터 리셋
        setEntitiesData(dataSwr.result);
        // Search 닫기
        setSearched(false)
        setFiltered(false)
         // Reset Sorting Value
        setValue3("sorting", "name_asc")
        closeMobileInput()
    }

    const openMobileInput = () => {
        setTriggerMobileInput(true)
        setFilterBy(false)
    }

    const openFilterBox = () => {
        setFilterBy(true)
        setTriggerMobileInput(false)
    }

    const closeMobileInput = () => {
        setTriggerMobileInput(false)
        setFilterBy(false)
    }
    const closeFilterBox = () => {
        setTriggerMobileInput(false)
        setFilterBy(false)
    }
    return (
        <div className="w-screen h-full relative">
            {/* 👨🏻‍💻: 여기서 explore 페이지 인지 theme page 인지 구분하고 헤더를 다르게 주자 */}
            {explore && <PageHeader
                title={pageText["explore_title"]}
                text={pageText["explore_header_text"]}
            />}
            {!explore && <ThemeHeader data={entitiesData} themePageText={pageText} params={params} themeButtonText={themeButtonText} />}
            <div ref={filterNav} className={`relative opacity-1 z-[200] w-screen `}>
                <div className={`relative ${(filtered || searched) ? "shadow-toa-blue shadow-lg" : "shadow-none" }  w-full flex bg-white max-w-screen-2xl ${(filterBy || triggerMobileInput) ? filterBy ? "h-[400px] items-end" : "h-[160px] items-end" : "h-[80px] items-center"} mx-auto px-4 md:px-8 py-2 transition-all duration-500  ${(aniTrigger) ? "translate-y-[45px] lg:translate-y-[56px]" : "translate-y-0"} overflow-hidden`}>
                    
                    <div className={`font-normal w-full h-full flex justify-between text-sm md:text-sm lg:text-base gap-4 lg:gap-8 transition-all duration-300 ${(filterBy || triggerMobileInput) ? "opacity-0" : "opacity-100"} py-1`}>
                        <div onClick={() => openFilterBox()} className={`gap-2 pl-4 pr-4 select-none flex flex-1 h-full aspect-square lg:aspect-auto justify-center lg:justify-start items-center ${filtered ? "bg-white border-2 border-toa-blue" : "bg-[#EFF2FC] border-0"} rounded-lg cursor-pointer relative transition-all duration-300`}>
                            <div className="block">
                                <Image
                                    priority
                                    width={28}
                                    height={28}
                                    alt="FilterIcon"
                                    src={filtered ? FilterIconB : FilterIcon}
                                 />
                            </div>
                            <div className="hidden lg:block">Filter by</div>
                            {filtered && <div className="absolute top-0 right-0 bg-toa-blue w-6 h-6 flex justify-center items-center rounded-full translate-x-1/2 -translate-y-1/2 text-xs font-medium">{entitiesData.length}</div>}
                        </div>
                        <div className="select-none gap-2 flex px-4 justify-center lg:justify-start items-center bg-[#EFF2FC] rounded-lg overflow-hidden">
                            <Image
                                priority
                                width={28}
                                height={28}
                                alt="SortIcon"
                                src={SortIcon}
                             />
                            <select {...register3("sorting")} className="cursor-pointer w-full h-full bg-[#EFF2FC] focus:outline-none">
                                <option value="name_asc">{`Title(asc)`}</option>
                                <option value="name_desc">{`Title(desc)`}</option>
                                <option value="type_asc">{`Category(asc)`}</option>
                                <option value="type_desc">{`Category(desc)`}</option>
                            </select>
                        </div>
                        {/* Mobile Input Button */}
                        <div onClick={() => openMobileInput()} className={`pl-2 pr-2 select-none flex lg:hidden flex-1 h-full aspect-square lg:aspect-auto justify-center lg:justify-start items-center bg-[#EFF2FC] border-0 rounded-lg cursor-pointer relative transition-all duration-300`}>
                            <div className="block">
                                <Image
                                    priority
                                    width={28}
                                    height={28}
                                    alt="SearchIcon"
                                    src={SearchIcon}
                                 />
                            </div>
                        </div>
                        <form onSubmit={handleSubmitSearch(serachFilter)} className={`select-none hidden lg:flex flex-[4] justify-center items-center rounded-lg overflow-hidden relative`}>
                            {!searched  && <div className="absolute top-1/2 -translate-y-1/2 left-2 rounded-full cursor-pointer">
                                <Image
                                priority
                                width={28}
                                height={28}
                                alt="SearchIcon"
                                src={SearchIcon}
                             />
                            </div>}
                            <input {...register("searchBar")} className={`w-full h-full ${searched ? "border-toa-blue bg-white border-2" : " bg-[#EFF2FC] border-0"} px-4 ${!searched && "pl-10"} focus:outline-none rounded-lg transition-all duration-300`} type="text" placeholder="Search..." required={true} />
                                {searched && <div onClick={onResetSearch} className="absolute top-1/2 -translate-y-1/2 text-toa-blue right-2 bg-white rounded-full cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>}
                        </form>
                        <div className="flex items-center gap-2">
                            <div className="hidden lg:block">
                                <Image
                                    priority
                                    width={34}
                                    height={28}
                                    alt="CounterIcon"
                                    src={CouterIcon}
                                />
                            </div>
                            {!isLoading && <div className="select-none hidden lg:flex justify-center items-center rounded-lg font-headermbold">{(filtered || searched) && `${entitiesData.length}/`}{dataSwr.result.length} {dataSwr.result.length > 1 ? "objects" : "object"}</div>}
                            {!isLoading && <div className="select-none flex gap-2 lg:hidden justify-center items-center rounded-lg font-headermbold">{(filtered || searched) && `${entitiesData.length}/`}{dataSwr.result.length} </div>}
                        </div>
                    </div>
                    {/* Mobile Input Box */}
                    <div className={`select-none absolute top-0 left-0 flex lg:hidden flex-col lg:gap-4 bg-[#EFF2FC] w-full h-full justify-stretch overflow-scroll ${triggerMobileInput ? "translate-x-0" : "-translate-x-full"} transition-all duration-500 overscroll-contain`}>
                        <div className="flex px-4 py-4 justify-between items-center">
                            <div className="relative font-headermbold text-sm md:text-lg lg:text-xl">
                                <div>
                                    Search Items
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-headermbold text-xs lg:text-base">
                                <div className="font-headermbold text-xs lg:text-base cursor-pointer px-4 py-2 bg-white rounded-lg transition-all lg:hover:text-white hover:bg-toa-blue" onClick={onResetSearch}>Reset</div>
                                <div className="font-headermbold text-xs lg:text-base cursor-pointer px-4 py-2 bg-white rounded-lg transition-all lg:hover:text-white hover:bg-toa-blue" onClick={() => closeMobileInput()}>Close</div>
                            </div>
                        </div>
                        <div className="w-full flex-1 px-4 py-4 flex items-stretch">
                            <form onSubmit={handleSubmitSearch(serachFilterM)} className={`select-none flex lg:hidden flex-[4] justify-center items-center rounded-lg overflow-hidden relative`}>
                                {!searched  && <div className="absolute top-1/2 -translate-y-1/2 left-2 rounded-full cursor-pointer">
                                    <Image
                                    priority
                                    width={28}
                                    height={28}
                                    alt="SearchIcon"
                                    src={SearchIcon}
                                 />
                                </div>}
                                <input {...register("searchBarM")} className={`w-full h-full ${searched ? "border-toa-blue bg-white border-2" : " bg-[#fff] border-0"} px-4 ${!searched && "pl-10"} focus:outline-none rounded-lg transition-all duration-300`} type="text" placeholder="Search..." required={true} />
                                    
                            </form>
                        </div>
                    </div>
                    
                    {/* Filter By Container */}
                    <form onSubmit={handleSubmit(applyFilter)} className={`select-none absolute top-0 left-0 flex flex-col lg:gap-4 bg-[#EFF2FC] w-full h-full overflow-scroll ${filterBy ? "translate-x-0" : "-translate-x-full"} transition-all duration-500 overscroll-contain`}>
                        <div className="flex justify-between items-center sticky top-0 left-0 bg-[#EFF2FC] px-4 py-4 gap-4 lg:gap-0">
                            <div className="relative font-headermbold text-sm md:text-lg lg:text-xl">
                                <div>
                                    Filter Items by
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-headermbold text-xs lg:text-base">
                                <div className="cursor-pointer px-4 py-2 bg-white rounded-lg transition-all lg:hover:text-white hover:bg-toa-blue" onClick={resetFilter}>Reset</div>
                                <input className="cursor-pointer px-4 py-2 bg-white rounded-lg transition-all lg:hover:text-white hover:bg-toa-blue" type="submit" value={"Accept"} />
                                <div className="cursor-pointer px-4 py-2 bg-white rounded-lg transition-all lg:hover:text-white hover:bg-toa-blue" onClick={() => closeFilterBox()}>Close</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 auto-cols-auto gap-4 lg:mt-4 px-4 py-4">
                            {
                                !isLoading && categoryList.filter((v) => String(v.name).toLocaleLowerCase() !== "collector").slice(0, filterLoadMore ? categoryList.length : 5).map((v, idx) => {
                                    return <div key={idx}>
                                    {v.name === "coretheme" && <FCategoryTitle text={"Core Theme"} />}
                                    {v.name === "subtheme" && <FCategoryTitle text={"Sub Theme"} /> }
                                    {(v.name !== "subtheme" && v.name !== "coretheme") && <FCategoryTitle text={v.name} /> }
                                    <Controller 
                                        name={`${v.name}`}
                                        control={control}
                                        defaultValue={[]}
                                        render={({field}) => {
                                            return (<>
                                                {
                                                     v["items"].map((v2, idx2) => {
                                                        return <div key={idx2} className="flex gap-2 items-center mb-2">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                id={`${v.name}_${v2}`}
                                                                value={v2}
                                                                checked={field.value.includes(v2)}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value === "all") {
                                                                        field.onChange(e.target.checked ? [value] : field.value.filter((v) => v !== value));
                                                                      } else {
                                                                        field.onChange(
                                                                          e.target.checked
                                                                            ? [
                                                                                ...field.value.filter((v) => {
                                                                                  if (v !== "all") {
                                                                                    return v;
                                                                                  }
                                                                                }),
                                                                                value,
                                                                              ]
                                                                            : field.value.filter((v) => v !== value)
                                                                        );
                                                                      }
                                                                }}
                                                            />
                                                            {v.name === "coretheme" && <label htmlFor={`${v.name}_${v2}`}><FCategoryText text={TOA_CORETHEME_CATEGORY[v2] ? TOA_CORETHEME_CATEGORY[v2] : "all"} /></label>}
                                                            {v.name === "subtheme" && <label htmlFor={`${v.name}_${v2}`}><FCategoryText text={SUBTHEMELIST[v2] ? SUBTHEMELIST[v2] : "all"} /></label>}
                                                            {(v.name !== "subtheme" && v.name !== "coretheme") && <label htmlFor={`${v.name}_${v2}`}><FCategoryText text={v2} /></label>}
                                                            
                                                        </div>
                                                    })
                                                }
                                            </>)
                                        }}
                                    />
                                  
                                </div>
                                })
                            }
                        </div>
                        {!filterLoadMore && <div className="cursor-pointer underline px-4 py-4" onClick={() => setFilterLoadMore(true)}>Show All Categories</div>}
                    </form>
                </div>
            </div>
            {(isLoading || !Boolean(entitiesData))  && <LoadingBox2 />}
            <DContainer color="white" paddingOn={true}>
                 {(!isLoading && Boolean(entitiesData)) && <div className={`w-full h-fit bg-white flex flex-col `}>
                   {
                    // Found Data
                    entitiesData.length > 0 ? <>
                        <div className="w-full grid auto-rows-fr grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-8 lg:gap-y-12">
                            {
                                entitiesData.slice(0, (currentPage) * 10).map((v, idx) => {
                                    return <EntityCoverBox key={idx} val={v} coverText={true} />
                                })
                            }
                        </div>
                       
                        {((currentPage) * 10) < entitiesData.length && <div className="flex justify-center mt-4 select-none">
                            <div onClick={() => setCurrentPage((prev) => prev + 1)} className="flex active:shadow-md active:shadow-toa-yellow active:bg-white active:text-toa-yellow justify-center py-4 rounded-lg overflow-hidden shadow-xl cursor-pointer select-none px-4 font-headerh1 text-lg lg:text-xl transition-all duration-75 active:scale-95">Load more Objects</div>
                        </div>}
                    </> : <div className="w-full h-full p-4 border-2 border-toa-yellow rounded-lg flex justify-center items-center text-lg lg:text-2xl">No results were found. Perhaps try something else?</div>
                   }
                </div>}
            </DContainer>
        </div>
    )
}

export default FilterWrapper;