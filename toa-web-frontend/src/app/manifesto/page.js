import { fetchDataOriginAPI } from "../utils/hooks/fetchData";
import ManifestoWrapper from "./components/Wrapper";
import { cookies } from 'next/headers';
import yaml from "js-yaml";
const ManifestoPage = async () => {
    const cookieStore = cookies();
    let currentLanguage = cookieStore.get('language')?.value || 'en';

    const bodyData = {
        query: `page("manifesto")`,
        select: {
            id: true,
            title: true,
            manifesto_title: true,
            manifesto_header_text: true,
            glossary_of_manifesto: true,
            

        }
    }


    const manifestoData = await fetchDataOriginAPI({ bodyD: bodyData, language: currentLanguage });
   manifestoData.result.glossary_of_entity = manifestoData.result.glossary_of_manifesto


    return <ManifestoWrapper manifestoData={manifestoData.result} currentLanguage={currentLanguage}  />
}

export default ManifestoPage;