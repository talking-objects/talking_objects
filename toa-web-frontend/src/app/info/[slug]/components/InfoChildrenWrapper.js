"use client"

import PageHeader from "@/app/components/containers/PageHeader";
import BlockWrapper from "@/app/components/elements/BlockWrapper";
import { DynamicInfoPageChildrenData, ImagesCaption } from "@/app/utils/swr/fetchdata";
import { useEffect, useState } from "react";
import yaml from "js-yaml"
import LoadingBox2 from "@/app/components/LoadingBox2";


const InfoChildrenWrapper = ({currentLanguage, slug}) => {
    const [infoChildrenData, setInfoChildrenData] = useState(null)
    const [getImagesCaption, setImagesCaption] = useState(null)
    const {isLoading:isLoadingI, dataSwr:dataSwrI} = ImagesCaption({currentLanguage: currentLanguage})
    const {dataSwr, isLoading} = DynamicInfoPageChildrenData({currentLanguage: currentLanguage, slug: slug})

    useEffect(() => {
        if(!isLoading){
            if(typeof dataSwr.result[0].contents === "string"){

                dataSwr.result[0].contents = yaml.load(JSON.parse(JSON.stringify(dataSwr.result[0].contents)))
            }else{
                dataSwr.result[0].contents =  dataSwr.result[0].contents

            }
            setInfoChildrenData(dataSwr.result[0])
        }
    },[dataSwr])
    useEffect(() => {
        if(!isLoadingI){
            setImagesCaption(dataSwrI.result.images)
        }
    },[dataSwrI]) 
    if(!Boolean(dataSwr) && isLoading){
        return <div className="w-screen h-screen flex justify-center items-center pt-[62px]">
            <LoadingBox2 />
        </div>
    }
    return  <div className="w-full">
        {infoChildrenData && <PageHeader
            title={infoChildrenData?.info_title}
            text={infoChildrenData?.info_header_text}
        />}
        <div id={"o_context"} className="w-full h-full flex flex-col gap-0 py-8">
        {
            (!isLoading && Boolean(infoChildrenData) && !isLoadingI && Boolean(getImagesCaption)) && <>
               {infoChildrenData.contents &&
                infoChildrenData.contents.length > 0 &&
                infoChildrenData.contents.map((val, idx) => {
                    return <BlockWrapper key={idx} content={val}  playgroundTermData={[]} images={getImagesCaption} />;
            })}
        </>
        }
        </div>
</div>
}

export default InfoChildrenWrapper;