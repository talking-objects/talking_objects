import { cookies } from "next/headers";
import Wrapper from "./components/Wrapper";
import { fetchDataOriginAPI } from "../utils/hooks/fetchData";

const Glossary = async () => {
  const cookieStore = cookies();
  let currentLanguage = cookieStore.get("language")?.value || "en";
  const bodyDataForGlossary = {
    query:`page("glossary")`,
    select: {
        id: true,
        title: true,
        glossary_title: true,
        glossary_header_text: true,
 
    }
  }
  const glossaryPanelData = await fetchDataOriginAPI({bodyD: bodyDataForGlossary, language: currentLanguage})

  
  
  return <Wrapper glossaryPanelData={glossaryPanelData.result} currentLanguage={currentLanguage} />;
};

export default Glossary;
