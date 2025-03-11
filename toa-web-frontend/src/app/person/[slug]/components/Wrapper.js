"use client";

import DContainer from "@/app/components/containers/DContainer";
import { globalCurrentUrl } from "@/app/utils/recoil/state";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import yaml from "js-yaml";
import HeadingText from "@/app/components/elements/HeadingText";
import EntityCoverBox from "@/app/components/elements/EntityCoverBox";
import { marked } from "marked";
import { parseKirbyTags } from "@/app/utils/hooks/useParseKirbyTags";
import { PersonData, PersonDataEntitiesAsContributor, PersonDataEntitiesAsCreator } from "@/app/utils/swr/fetchdata";
import MarkdownIt from "markdown-it";
import LoadingBox2 from "@/app/components/LoadingBox2";
import LoadingBox from "@/app/components/LoadingBox";
import gsap from "gsap";
import Image from "next/image";

const Wrapper = ({ currentLanguage, query }) => {
  const params = useParams();
  const setCurrentUrl = useSetRecoilState(globalCurrentUrl);

  
  const getPathname = usePathname();
  const router = useRouter();
  const {isLoading, dataSwr} = PersonData({currentLanguage:currentLanguage, query:query})
  const [getPersonData, setPersonData] = useState(null)
  // const [projectsData, setProjectsData] = useState(personData.objs)
  const md = MarkdownIt({html: true})
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
 

  useEffect(() => {
    setCurrentUrl(getPathname);
  }, []);

  useEffect(() => {
    if(!isLoading){
      setPersonData(dataSwr.result[0])
    }
  },[dataSwr])
  const onBack = () => {
    router.back()
  };
 
  if(isLoading){
    return <LoadingBox2 />
  }
  

  return (
    <div className="w-full h-full pt-14">
      <DContainer paddingOn={true}>
        <div className="flex flex-col gap-12">
          {(!isLoading && getPersonData) && <div className="flex flex-col items-center gap-4">
            <div className="flex w-full gap-4">
              <div className="flex-1 hidden lg:block"></div>
              <div className="flex-1 lg:flex-[2] flex flex-col items-start justify-center lg:items-start">
                <div className="w-full mb-2 lg:mb-0">
                  <div
                    onClick={onBack}
                    className="px-3 py-1 lg:px-4 lg:py-2 border-black border text-xs lg:text-base rounded-lg flex w-fit cursor-pointer font-headersanssemiitalic transition-all hover:bg-toa-black hover:text-white"
                  >
                    &larr; Back
                  </div>
                </div>
                <HeadingText text={getPersonData.fullname} />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row w-full gap-4">
              <div className="flex-1 lg:flex-[1]">
                <div
                  style={{
                    backgroundColor: `${randomColor}`
                  }}
                  className="w-full aspect-square bg-white bg-no-repeat bg-cover bg-center rounded-xl relative overflow-hidden"
                  // style={{
                  //   ...(Boolean(getPersonData.coverimage) && {backgroundImage: `url(${process.env.KB_API_FILE}/${yaml.load(getPersonData.coverimage)})`}),
                  //   ...((!Boolean(getPersonData.coverimage)) && {backgroundColor: `${randomColor}`})
                  // }}
                  // className="w-full aspect-square bg-white bg-no-repeat bg-cover bg-center rounded-xl"
                >
                      <Image
                      src={`${process.env.KB_API_FILE}/${yaml.load(getPersonData.coverimage)}`}
                      alt=""
                      fill
                      quality={60}
                      // placeholder="blur" 
                      // blurDataURL={getRandomAniPlaceHolderUrld}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                      style={{objectFit:"cover"}}
                     
                      />

                </div>
              </div>
              <div className="flex-1 lg:flex-[2]">
                <div className="w-full lg:w-11/12 font-normal text-base md:text-lg lg:text-xl text-[#414B5A] whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${md.render(marked.parse(parseKirbyTags(getPersonData.bio)))}`}}></div>
              </div>
            </div>
          </div>}
         {(!isLoading && getPersonData) && <ChildrenWrapper currentLanguage={currentLanguage} title={getPersonData.title} />}
        </div>
      </DContainer>
    </div>
  );
};

const ChildrenWrapper = ({currentLanguage, title}) => {
  const [currentPagination, setCurrentPagination] = useState(0)
  const {isLoading, dataSwr} = PersonDataEntitiesAsCreator({currentLanguage, title})
  const {isLoading:isLoadingC, dataSwr:dataSwrC} = PersonDataEntitiesAsContributor({currentLanguage, title})
  const [getProjects, setProjects] = useState(null)
  useEffect(() => {
    if(!isLoading && !isLoadingC){
      const mergedData = [
        ...dataSwr.result,
        ...dataSwrC.result,
      ];

      const uniqueData = Array.from(new Set(mergedData.map((obj) => obj.id))).map(
        (id) => mergedData.find((obj) => obj.id === id)
      );
      setProjects(uniqueData)
   
    }
  },[isLoading, isLoadingC])

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
useEffect(() => {
    if(!isLoading && Boolean(getProjects)){
        fadeInAndOut()
    }
},[isLoading, isLoadingC, getProjects])

const clickPagination = () => {
  setCurrentPagination((prev) => prev + 1)
  
}
useEffect(() => {
  fadeInAndOut()
},[currentPagination])

  if(isLoading || isLoadingC){
    return <LoadingBox />
  }
  return ( 
<>
  {getProjects && <div className="flex flex-col gap-6">
    <HeadingText text={"Contributed projects"} />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {getProjects.length > 0 && getProjects.slice(0, ((currentPagination + 1) * 4)).map((val, idx) => {
        return <EntityCoverBox key={idx} val={val} coverText={true} />
      })}
    </div>
    {((currentPagination + 1) * 4) < getProjects.length && <div className="flex justify-center mt-4 select-none"> <div onClick={() => clickPagination()} className="flex active:shadow-md active:shadow-toa-yellow active:bg-white active:text-toa-yellow justify-center py-4 rounded-lg overflow-hidden shadow-xl cursor-pointer select-none px-4 font-headerh1 text-lg lg:text-xl transition-all duration-75 active:scale-95">Load more Objects</div> </div>}
  </div>}
  </>
  )

}


export default Wrapper;
