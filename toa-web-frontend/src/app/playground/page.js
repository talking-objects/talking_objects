import { fetchDataOriginAPI } from "../utils/hooks/fetchData";
import Wrapper from "./components/Wrapper";
import { cookies } from "next/headers";
import yaml from "js-yaml"

const Page = async () => {
  const cookieStore = cookies();
  let currentLanguage = cookieStore.get("language")?.value || "en";

  

  const bodyDataForPlayground = {
    query: `page("playground")`,
    select: {
      id: true,
      title: true,
      playground_title: true,
      playground_header_text: true,
      playground_header_btn: true,
    
  
    },
  };
  const playgroundPanelData = await fetchDataOriginAPI({
    bodyD: bodyDataForPlayground,
    language: currentLanguage,
  });
 



  
  return <Wrapper playgroundPanelData={playgroundPanelData.result} currentLanguage={currentLanguage} />;
};

export default Page;
