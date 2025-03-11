import { VAILDSLUGS } from "@/app/constant/kirbyurl";
import { fetchDataOriginAPI } from "@/app/utils/hooks/fetchData";
import { redirect } from "next/navigation";
import ThemeWrapper from "./components/ThemeWrapper";
import yaml from "js-yaml"
import { cookies } from "next/headers";
import { SUBTHEMELIST } from "@/app/constant/subthemelist";
import FilterWrapper from "@/app/components/wrapper/FilterWrapper";


const ThemeObjectPage = async (props) => {
    const cookieStore = cookies();
    let currentLanguage = cookieStore.get('language')?.value || 'en';

    const slug = props.params.slug
    if(!VAILDSLUGS.includes(slug)){
        redirect("/")
    }

    const templatesName = {
        knowledge: "knowledge",
        resitution: "resitution",
        identity: "identity",
        "artistic-reflections": "artisticreflections",
        "memory-the-imaginary" : "memory"
    }


   
    const bodyData2 = {
        query:`page("home")`,
        select: {
          home_title: true,
          resitution: true,
          knowledge: true,
          identity: true,
          memory_the_imaginary: true,
          artistic_reflections: true,
        },
        
     }
    const themeButtonText = await fetchDataOriginAPI({bodyD: bodyData2, language: currentLanguage})
   
    const bodyData3 = {
        query:`page("objects")`,
        select: {
            theme_title: true,
            about_knowledge: true,
            about_resitution: true,
            about_identity: true,
            about_artisticreflections: true,
            about_memory: true,
            sub_african_philosophy: true,
            sub_healing: true,
            sub_performance: true,
            sub_african_cities: true,
            sub_nature: true,
            sub_black_studies: true,
            sub_indigenous_culture: true,
            option1: true,
            option2: true,
            option3: true,
            option4: true,
            option5: true,
            option6: true,
            option7: true,
            option8: true,
            option9: true,
            option10: true,
            option11: true,
            option12: true,
            option13: true,
            option14: true,
            option15: true,

            
        },
        
     }
    const themePageText = await fetchDataOriginAPI({bodyD: bodyData3, language: currentLanguage})
    const queryText = `page("objects").children.filterBy('coretheme', '*=', '${templatesName[slug]}')`
    return (
        <FilterWrapper pageText={themePageText} currentLanguage={currentLanguage} queryText={queryText} explore={false} themeButtonText={themeButtonText}  />
    )
}

export default ThemeObjectPage