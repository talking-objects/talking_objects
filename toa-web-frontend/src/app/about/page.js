import { cookies } from "next/headers";
import { fetchDataOriginAPI } from "../utils/hooks/fetchData";
import Wrapper from "./components/Wrapper";

const About = async () => {
    const cookieStore = cookies();
    let currentLanguage = cookieStore.get("language")?.value || "en";
    const bodyDataForAbout = {
        query:`page("about")`,
        select: {
            id: true,
            title: true,
            // content: true,
            about_title: true,
            about_header: true,
        }
    }

    const aboutPanelData = await fetchDataOriginAPI({bodyD: bodyDataForAbout, language: currentLanguage})
    
   
    return <Wrapper aboutPanelData={aboutPanelData.result} currentLanguage={currentLanguage} />
}

export default About;