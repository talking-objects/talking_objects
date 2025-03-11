const { useRouter } = require("next/navigation");
import { TOA_CORETHEME_LABEL } from "@/app/constant/kirbyurl";
import { getRandomAniPlaceHolder, getRandomPlaceHolder } from "@/app/utils/hooks/etc";
import yaml from "js-yaml"
import Image from "next/image";
import { useMemo, useState } from "react";

const ImageBox = ({val, randomColor}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false)
  const getRandomPlaceHolderUrl = useMemo(() => {
    return getRandomPlaceHolder()
  },[])

  const getRandomAniPlaceHolderUrld = useMemo(() => {
    return getRandomAniPlaceHolder()
  },[])
  return <div
  style={{
    // backgroundImage: `url(${process.env.KB_API_FILE}/${yaml.load(
    //   val.coverimage
    // )})`,
    backgroundColor: Boolean(val.coverimage) ? `white`: `${randomColor}`
  }}
  className={`${isLoaded ? "opacity-100" : "opacity-0"} ${!Boolean(val.coverimage) && "opacity-100"} transition-opacity duration-700 flex relative justify-stretch items-stretch ${val["entity_type"] !== "object" ? "w-10/12  aspect-square rounded-full" : "w-full aspect-[4/3] rounded-t-lg"} bg-no-repeat bg-cover bg-center`}
>
  {(Boolean(val.coverimage) && !error) && <Image
    src={`${process.env.KB_API_FILE}/${yaml.load(val.coverimage)}`}
    alt=""
    fill
    quality={60}
    placeholder="blur" 
    // priority
    blurDataURL={getRandomAniPlaceHolderUrld}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
    style={{objectFit:"cover", borderRadius: val["entity_type"] !== "object" ? "9999px" : "0px"}}
    onLoad={() => setIsLoaded(true)}
    onError={() => {
      setError(true)
    }}
    />}
  {(Boolean(val.coverimage) && error) && <Image
    src={getRandomPlaceHolderUrl}
    alt=""
    fill
    quality={60}
    placeholder="blur" 
    blurDataURL={getRandomAniPlaceHolderUrld}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
    style={{objectFit:"cover", borderRadius: val["entity_type"] !== "object" ? "9999px" : "0px"}}
  
    />}

</div>
}

const EntityCoverBox = ({val, coverText=true}) => {
    const router = useRouter()

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

    const onClickObj = (uuid) => {
      router.push(`/objects/${uuid}`);
    };

    return (
      <div
        onClick={() => onClickObj(`${String(val.uuid).slice(7)}`)}
        className="coverbox translate-y-[100px] group opacity-0 rounded-xl overflow-hidden flex flex-col items-center border-0 border-neutral-100 cursor-pointer active:shadow-lg active:shadow-toa-blue lg:hover:shadow-md lg:hover:shadow-toa-blue lg:duration-500 transition-shadow"
      >
        <ImageBox val={val} randomColor={randomColor} />
        <div className="flex flex-col px-4 py-4 gap-2 w-full h-full">
          <div className="flex flex-wrap gap-[0.25rem]">
            {val.coretheme
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
                    <span className="hidden md:block">{TOA_CORETHEME_LABEL[v].name}</span>
                  </div>
                );
              })}
          </div>
          <div style={{lineHeight: 1.1}} className="text-base lg:text-lg font-headermedium text-[#414B5A]">{val.title}</div>
          {(coverText && val.preview_text.length > 0) && <div style={{lineHeight: 1.1}} className="text-xs lg:text-sm text-[#414B5A] break-words font-normal">{val.preview_text.slice(0, 200)}{val.preview_text.length > 200 && "..."}</div>}
          {(coverText && val.preview_text.length === 0) && <div style={{lineHeight: 1.1}} className="text-xs lg:text-sm text-[#414B5A] break-words font-normal">{val.cover_text.slice(0, 200)}{val.cover_text.length > 200 && "..."}</div>}
        </div>
      </div>
    );
  };

export default EntityCoverBox;