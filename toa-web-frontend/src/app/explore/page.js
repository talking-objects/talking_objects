import { fetchDataOriginAPI } from "../utils/hooks/fetchData";
import { cookies } from "next/headers";
import FilterWrapper from "../components/wrapper/FilterWrapper";

const ExplorePage = async () => {
    const cookieStore = cookies();
    let currentLanguage = cookieStore.get('language')?.value || 'en';
    


   const bodyData2 = {
    query:`page("objects")`,
    select: {
        explore_title: true,
        explore_header_text: true,
    }
   }
   const pageText = await fetchDataOriginAPI({bodyD:bodyData2, language: currentLanguage})
   
   const queryText = `page("objects").children`

    return (
        <FilterWrapper pageText={pageText.result} currentLanguage={currentLanguage} queryText={queryText} />
        
    )
}

export default ExplorePage;