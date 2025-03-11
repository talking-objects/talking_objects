import { fetchDataOriginAPI } from "@/app/utils/hooks/fetchData";
import Wrapper from "./components/Wrapper";
import { cookies } from "next/headers";
import yaml from "js-yaml"



const Page = async (props) => {
    
    const slug = props.params.slug;
    const cookieStore = cookies();
    let currentLanguage = cookieStore.get("language")?.value || "en";
 
    const playgroundBodyData = {
        query: `page("playground").children.filterBy('uuid', '==', 'page://${slug}')`,
        select: {
          id: true,
          title: true,
          playground_item_blurb: true,
          glossary_of_playground: true
          
        },
      };
    const playgrounData = await fetchDataOriginAPI({ bodyD: playgroundBodyData, language: currentLanguage });
      
    let newTest = playgrounData.result[0]
    newTest.glossary_of_entity = newTest.glossary_of_playground
    

    const query =`page("playground").children.filterBy('uuid', '==', 'page://${slug}')`
  
    return (
        <Wrapper playgrounData={newTest} query={query} currentLanguage={currentLanguage}  />
    )
}

export default Page;