"use client"

import DContainer from "@/app/components/containers/DContainer"
import PageHeader from "@/app/components/containers/PageHeader"
import EntityCoverBox from "@/app/components/elements/EntityCoverBox"
import { TOA_CORETHEME_CATEGORY } from "@/app/constant/kirbyurl"
import { SUBTHEMELIST } from "@/app/constant/subthemelist"
import { globalCurrentUrl, globalDetectNavDirection } from "@/app/utils/recoil/state"
import { HomeData } from "@/app/utils/swr/fetchdata"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useRecoilValue, useSetRecoilState } from "recoil"


const Wrapper = ({data, pageText, categoryList}) => {
    const [objectsData, setObjectsData] = useState(data)
    const setCurrentUrl = useSetRecoilState(globalCurrentUrl)
    const gloablNavDirectionValue = useRecoilValue(globalDetectNavDirection)
    const [aniTrigger, setAniTrigger] = useState(false)
    const [filterBy, setFilterBy] = useState(false)
    const getPathname = usePathname()
    const filterNav = useRef(null)
    const [currentPagination, setCurrentPagination] = useState(0)
    const [filterLoadMore, setFilterLoadMore] = useState(false)
    const {control, handleSubmit, reset} = useForm()

    const [filtered, setFiltered] = useState(false)

  
    
    // Filter Nav 
    useEffect(() => {
        const headerbox = document.querySelector(".headerbox")
        let headerPos = headerbox.clientHeight

        const scrollEvent = () => {
            const currentScrollTop = document.documentElement.scrollTop
            if(headerPos > currentScrollTop){
                filterNav.current.style.top = `${headerPos - currentScrollTop}px`
                setAniTrigger(false)
            }else{
                setAniTrigger(true)
                 filterNav.current.style.top = `${0}px`
            }
        }

        const resizeEvent = () => {
            const headerbox2 = document.querySelector(".headerbox")
            headerPos = headerbox2.clientHeight
            const currentScrollTop2 = document.documentElement.scrollTop
            if(headerPos > currentScrollTop2){
                filterNav.current.style.top = `${headerPos - currentScrollTop2}px`
                setAniTrigger(false)
            }else{
                setAniTrigger(true)
                 filterNav.current.style.top = `${0}px`
            }
        }
        if(filterNav){
            const currentScrollTop = document.documentElement.scrollTop
            
            filterNav.current.style.opacity = `1`
            if(headerPos > currentScrollTop){
                filterNav.current.style.top = `${headerPos - currentScrollTop}px`
            }else{
                 filterNav.current.style.top = `${0}px`
            }
            window.addEventListener("scroll", scrollEvent)
            window.addEventListener("resize", resizeEvent)
        }
        return () => {
            window.removeEventListener("scroll", scrollEvent)
            window.removeEventListener("resize", resizeEvent)
        }
        
    },[filterNav])
    useEffect(() => {
        setCurrentUrl(getPathname)
        
        
    },[])

    // Apply Filter AND FILTER
    const applyFilter = (cateData) => {
        if (filterBy) {
            // 필터 카테고리에서 선택된 항목이 있는 카테고리만 필터링
            const keys = Object.keys(cateData).filter((val) => cateData[val].length > 0);
            
            // 데이터 복사
            let currentData = JSON.parse(JSON.stringify(data));
            
            const result = [];
          
            // 데이터 필터링
            currentData.forEach((object) => {
                if(object["coretheme"]){
                    let coreThemeData = JSON.parse(JSON.stringify(object["coretheme"]))
                    coreThemeData = coreThemeData.split(",").map((v) => v.trim())
                    const hasItems = coreThemeData.some((obj) => cateData["coretheme"].includes(obj));
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
                                                const itemValues = object["dynamic_category"][i]["category_box"].split(",").map((v) => v.trim());
                                                const hasItems = itemValues.some((item) => filterItems.includes(item));
                                                
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
    
            
            setFiltered(true)
            setCurrentPagination(0)
            // 필터링된 데이터를 상태로 설정
            setObjectsData(result);
    
            // 필터창 닫기
            setFilterBy(false);
        }
    };
    const resetFilter = () => {

        // Reset react use form
        reset()
        // reset pagination
        setCurrentPagination(0)
        // 데이터 리셋
        setObjectsData(data);
        // 필터종료
        setFiltered(false)
        // 필터창 닫기
        setFilterBy(false);
    }
    useEffect(() => {
    
    },[])
    return (
        <div className="w-screen h-full relative">
            {/* 👨🏻‍💻: 여기서 explore 페이지 인지 theme page 인지 구분하고 헤더를 다르게 주자 */}
            <PageHeader
                title={pageText["explore_title"]}
                text={pageText["explore_header_text"]}
            />
            <div ref={filterNav} className={`
                fixed top-0 left-0 opacity-0 z-[200] w-screen
                `}>
                <div
                    className={`relative drop-shadow-md shadow-md w-full flex bg-white max-w-screen-2xl ${filterBy ? "h-[400px] items-end" : "h-[60px] items-center"} mx-auto px-4 py-2 transition-all duration-500  ${(aniTrigger && gloablNavDirectionValue) ? "translate-y-[45px] lg:translate-y-[56px]" : "translate-y-0"} overflow-hidden`}
                >
                    <div className={`w-full flex justify-between gap-4 lg:gap-8 transition-all duration-300 ${filterBy ? "opacity-0" : "opacity-100"}`}>
                        <div onClick={() => setFilterBy(true)} className="flex flex-[2] text-sm lg:text-base justify-center items-center px-2 lg:px-4 py-2 bg-neutral-300 rounded-lg cursor-pointer relative">
                            <div>
                            Filter by
                            </div>
                            {filtered && <div className="absolute top-0 right-0 bg-red-400 w-6 h-6 flex justify-center items-center rounded-full translate-x-1/2 -translate-y-1/2 text-xs font-medium">{objectsData.length}</div>}
                            </div>
                        <div className="flex flex-[2] text-sm lg:text-base justify-center items-center bg-neutral-300 rounded-lg overflow-hidden">
                            <select className="w-full h-full bg-neutral-300 focus:outline-none px-4">
                                <option value="name">{`Sort by Name(asc)`}</option>
                                <option value="name">{`Sort by Name(desc)`}</option>
                                <option value="name">{`Sort by CoreTheme`}</option>
                            </select>
                        </div>
                        <div className="flex flex-[7] text-sm lg:text-base justify-center items-center bg-neutral-300 rounded-lg overflow-hidden">
                            <input className="w-full h-full bg-neutral-300 px-4 focus:outline-none" type="text" placeholder="Write placeholder..." />
                        </div>
                        <div className="flex flex-[1] text-sm lg:text-base justify-center items-center px-2 lg:px-4 py-2 rounded-lg">{data.length} objects</div>
                    </div>
                    {/* Filter By Container */}
                    <form onSubmit={handleSubmit(applyFilter)} className={`absolute top-0 left-0 flex flex-col gap-4 bg-neutral-100 w-full h-full overflow-scroll px-4 py-4 ${filterBy ? "translate-x-0" : "-translate-x-full"} transition-all duration-500 `}>
                        <div className="flex justify-between">
                            <div className="relative">
                                <div>
                                    filterby
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div onClick={resetFilter}>Reset</div>
                                <input type="submit" value={"Accept"} />
                                <div onClick={() => setFilterBy(false)}>Close</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 auto-cols-auto gap-4 mt-4">
                            {
                                categoryList.slice(0, filterLoadMore ? categoryList.length : 5).map((v, idx) => {
                                    return <div key={idx}>
                                    {v.name === "coretheme" && <div>Core Theme</div>}
                                    {v.name === "subtheme" && <div>Sub Theme</div>}
                                    {(v.name !== "subtheme" && v.name !== "coretheme") && <div>{v.name}</div>}
                                    <Controller 
                                        name={`${v.name}`}
                                        control={control}
                                        defaultValue={[]}
                                        render={({field}) => {
                                            return (<>
                                                {
                                                     v["items"].map((v2, idx2) => {
                                                        return <div key={idx2} className="flex gap-2 items-center">
                                                            <input
                                                                type="checkbox"
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
                                                            {v.name === "coretheme" && <label htmlFor={`${v.name}_${v2}`}>{TOA_CORETHEME_CATEGORY[v2] ? TOA_CORETHEME_CATEGORY[v2] : "all"}</label>}
                                                            {v.name === "subtheme" && <label htmlFor={`${v.name}_${v2}`}>{SUBTHEMELIST[v2] ? SUBTHEMELIST[v2] : "all"}</label>}
                                                            {(v.name !== "subtheme" && v.name !== "coretheme") && <label htmlFor={`${v.name}_${v2}`}>{v2}</label>}
                                                            
                                                        </div>
                                                    })
                                                }
                                            </>)
                                        }}
                                    />
                                    {/* <div>
                                        {
                                            v["items"].map((v2, idx2) => {
                                                return <div key={idx2}>{v2}</div>
                                            })
                                        }
                                    </div> */}
                                </div>
                                })
                            }
                        </div>
                        {categoryList.length > 5 && <div onClick={() => setFilterLoadMore(true)}>{filterLoadMore ? "Close" : `${categoryList.length - 5} Load More`}</div>}
                    </form>
                </div>
            </div>
            <DContainer color="white" paddingOn={true}>
                 <div className="w-full bg-white flex flex-col pt-[120px]">
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-8 lg:gap-y-12">
                        {
                            objectsData.slice(0, (currentPagination + 1) * 5).map((v, idx) => {
                                return <EntityCoverBox key={idx} val={v} coverText={true} />
                            })
                        }
                    </div>
                    {((currentPagination + 1) * 5) < objectsData.length && <div onClick={() => setCurrentPagination((prev) => prev + 1)} className="flex justify-center py-4 rounded-lg overflow-hidden shadow-xl mt-4 cursor-pointer">Load More</div>}
                </div>
            </DContainer>
        </div>
    )
}

export default Wrapper;