"use client"


import PageHeader from "@/app/components/containers/PageHeader";
import BlockWrapper from "@/app/components/elements/BlockWrapper";
import { globalCurrentUrl } from "@/app/utils/recoil/state";
import { FilteredTermsData, ImagesCaption, ManifestoContentsData } from "@/app/utils/swr/fetchdata";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";


const ManifestoWrapper = ({manifestoData, currentLanguage}) => {
    const getPathname = usePathname();
    const setCurrentUrl = useSetRecoilState(globalCurrentUrl);
    const {isLoading, dataSwr} = ManifestoContentsData({currentLanguage: currentLanguage})
    const {isLoading:isLoadingF, dataSwr:dataSwrF, error:errorF, filteredTermsSWR} = FilteredTermsData({currentLanguage: currentLanguage, objectData: manifestoData})
    const {isLoading:isLoadingI, dataSwr:dataSwrI} = ImagesCaption({currentLanguage: currentLanguage})

    const [getContents, setContents] = useState(null)
    const [getFilteredTerms, setFilteredTerms] = useState(null)
  const [getImagesCaption, setImagesCaption] = useState(null)
    useEffect(() => {
        setCurrentUrl(getPathname);
    }, []);

    useEffect(() => {
        if(!isLoadingI){
            setImagesCaption(dataSwrI.result.images)
        }
    },[dataSwrI])
    useEffect(() => {
        if(!isLoading && !isLoadingF){
            setFilteredTerms(dataSwrF.result.filteredTerms)
            setContents(dataSwr.result)
        }
    },[dataSwr, dataSwrF])
    
    return (
        <div className="w-full">
            <PageHeader
                title={manifestoData["manifesto_title"]}
                text={manifestoData["manifesto_header_text"]}
            />
            <div id={"o_context"} className="w-full h-full flex flex-col gap-0 py-8">
                {
                (!isLoading && Boolean(getContents) && !isLoadingF && Boolean(getFilteredTerms) && !isLoadingI && Boolean(getImagesCaption)) && <>
                   {getContents.contents &&
                    getContents.contents.length > 0 &&
                    getContents.contents.map((val, idx) => {
                  // return <ContentElement key={idx} value={val} />;
           
                  return <BlockWrapper key={idx} content={val}  playgroundTermData={getFilteredTerms} images={getImagesCaption} />;
                })}
                </>
                }
           
            </div>
        </div>
    )
}

export default ManifestoWrapper;