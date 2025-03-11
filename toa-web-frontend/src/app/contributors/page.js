import { fetchDataOriginAPI } from "../utils/hooks/fetchData";
import Wrapper from "./components/Wrapper";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = cookies();
  let currentLanguage = cookieStore.get("language")?.value || "en";

  const bodyDataForTeam = {
    query: `page("contributors")`,
    select: {
      id: true,
      title: true,  
      team_title: true,
      team_header: true,
      // contents: true
    },
  };

  const teamPanelData = await fetchDataOriginAPI({
    bodyD: bodyDataForTeam,
    language: currentLanguage,
  });

  
 


  return <Wrapper teamPanelData={teamPanelData.result} currentLanguage={currentLanguage} />;
};

export default Page;
