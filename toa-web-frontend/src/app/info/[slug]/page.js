
import { cookies } from "next/headers";


import InfoChildrenWrapper from "./components/InfoChildrenWrapper";

const DynamicInfo = (props) => {
    const slug = props.params.slug;

    const cookieStore = cookies();
    let currentLanguage = cookieStore.get('language')?.value || 'en';
 
   
    return <InfoChildrenWrapper currentLanguage={currentLanguage} slug={slug} />
}

export default DynamicInfo;