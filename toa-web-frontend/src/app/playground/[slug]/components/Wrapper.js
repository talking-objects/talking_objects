"use client";
import PageHeader from "@/app/components/containers/PageHeader";
import { globalCurrentUrl } from "@/app/utils/recoil/state";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import BlockWrapper from "@/app/components/elements/BlockWrapper";
import { FilteredTermsData, ImagesCaption, PlaygroundContentData } from "@/app/utils/swr/fetchdata";


const Wrapper = ({ playgrounData, currentLanguage, query }) => {
  const setCurrentUrl = useSetRecoilState(globalCurrentUrl);
  const getPathname = usePathname();
  const {isLoading, dataSwr} = PlaygroundContentData({currentLanguage:currentLanguage, query:query})
  const {isLoading:isLoadingF, dataSwr:dataSwrF, error:errorF, filteredTermsSWR} = FilteredTermsData({currentLanguage: currentLanguage, objectData: playgrounData})
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
      
      setContents(dataSwr.result[0])
      setFilteredTerms(dataSwrF.result.filteredTerms)
    }
   
  }, [dataSwr, dataSwrF]);


  
  return (
    <div className="w-screen h-full">
      <PageHeader
        title={playgrounData.title}
        text={playgrounData["playground_item_blurb"]}
      />
        {(isLoading && isLoadingI && isLoadingF && !Boolean(getFilteredTerms) && !Boolean(getImagesCaption) && !Boolean(getContents)) && 
     <div>Loading...</div>}
  
      <>
      {(!isLoading && !isLoadingI && !isLoadingF && Boolean(getContents) && Boolean(getFilteredTerms) && Boolean(getImagesCaption)) &&
        getContents.contents.length > 0 &&
        getContents.contents.map((value, idx) => {
          return <BlockWrapper key={idx} content={value} playgroundTermData={getFilteredTerms} images={getImagesCaption} />;
        })}
        </>
    </div>
  );
};

export default Wrapper;
