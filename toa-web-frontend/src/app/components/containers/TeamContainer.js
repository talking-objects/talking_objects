import { parseKirbyTags } from "@/app/utils/hooks/useParseKirbyTags";
import yaml from "js-yaml"
import MarkdownIt from "markdown-it";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {useEffect, useMemo, useState } from "react";


const TeamContainer = ({val}) => {
  const md = MarkdownIt({html: true})
    const router = useRouter();
    const onClickPerson = (uuid) => {
      router.push(`/person/${uuid}`)
    }
  
  return (
    <div className="w-full mb-16 mt-8">
      <div className="flex flex-col items-center w-full gap-4 px-4">
        {/* <HeadingText text={val["content"]["team_title"]} /> */}
        <div className="text-lg lg:text-2xl font-headerh1">{val["content"]["team_title"]}</div>
       {val["content"]["team_about"] && <div style={{lineHeight: 1.2}} className="w-full lg:w-3/5 font-normal text-base md:text-lg lg:text-xl text-[#414B5A] whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${md.render(parseKirbyTags(val["content"]["team_about"]))}`}}></div>}
      </div>
      {val["content"]["persons"] && <div
        style={
          val["content"]?.persons.length <= 2
            ? { gridTemplateColumns: `repeat(3, minmax(0, 1fr))` }
            : val["content"]?.persons.length <= 6
            ? { gridTemplateColumns: `repeat(3, minmax(0, 1fr))` }
            : { gridTemplateColumns: `repeat(4, minmax(0, 1fr))` }
        }
        className="grid mt-4"
      >
        {val["content"]["persons"].map((val2, idx2) => {
          if(Boolean(val2)){
            return (
              <ProfileBox key={idx2} onClickPerson={onClickPerson} val2={val2} />
            );
          }
        })}
      </div>}
    </div>
  );
};


const ProfileBox = ({onClickPerson, val2}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [getError, setError] = useState(false)
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

  if(val2?.coverimage === "" || !Boolean(val2?.coverimage || getError)){
    return (
      <div
              onClick={() => onClickPerson(`${String(val2.uuid).slice(7)}`)}              
              className={` duration-700 w-full aspect-square bg-no-repeat bg-cover bg-center relative flex items-end p-4 cursor-pointer group overflow-hidden`}
            >
              {(val2?.coverimage === "") && <div style={{backgroundColor: `${randomColor}`}} className={`absolute top-0 left-0 w-full h-full `}>
                <div className="w-full h-full relative">
                        
                </div>
              </div>}
              <div className="absolute w-full h-full bg-black opacity-30 lg:bg-opacity-0 top-0 left-0 lg:group-hover:bg-opacity-50 transition-all duration-300"></div>
              <div className=" absolute z-50 top-0 left-0 w-full h-full flex flex-col lg:gap-2 justify-end p-2 lg:p-4 text-white lg:-translate-x-full lg:group-hover:translate-x-0 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                <div className="text-sm md:text-sm lg:text-[30px] font-headerh1">{val2.fullname ? val2.fullname : "Untitled"}</div>
                <div className="font-headermedium text-xs md:text-xs lg:text-[20px]">{val2.jobtitle ? val2.jobtitle : "Untitled" }</div>
              </div>
          </div>
    )
  }

  return (
          <div
              onClick={() => onClickPerson(`${String(val2.uuid).slice(7)}`)}              
              className={`${isLoaded ? "opacity-100" : "opacity-0"} duration-700 w-full aspect-square bg-no-repeat bg-cover bg-center relative flex items-end p-4 cursor-pointer group overflow-hidden`}
            >
              {(Boolean(val2?.coverimage) && val2?.coverimage !== "") && <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-full h-full relative">
                  <Image
                      src={`${process.env.KB_API_FILE}/${yaml.load(val2.coverimage)}`}
                      alt=""
                      fill
                      quality={60}
                      // placeholder="blur" 
                      // blurDataURL={getRandomAniPlaceHolderUrld}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                      style={{objectFit:"cover"}}
                      onLoad={() => setIsLoaded(true)}
                      onError={() => {
                        setError(true)
                      }}
                      />
                      
                </div>
              </div>}
             
              <div className="absolute w-full h-full bg-black select-none pointer-events-none opacity-30 lg:bg-opacity-0 top-0 left-0 lg:group-hover:bg-opacity-50 transition-all duration-300"></div>
              <div className=" absolute z-50 top-0 left-0 w-full h-full flex flex-col lg:gap-2 justify-end p-2 lg:p-4 text-white lg:-translate-x-full lg:group-hover:translate-x-0 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                <div style={{lineHeight: 1}} className="text-sm md:text-sm lg:text-[30px] font-headerh1">{val2.fullname ? val2.fullname : "Untitled"}</div>
                <div className="font-headermedium text-xs md:text-xs lg:text-[20px]">{val2.jobtitle ? val2.jobtitle : "Untitled" }</div>
              </div>
          </div>
  )
}

export default TeamContainer