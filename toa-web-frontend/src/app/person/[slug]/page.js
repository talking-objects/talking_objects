import { fetchDataOriginAPI } from "@/app/utils/hooks/fetchData";
import Wrapper from "./components/Wrapper";
import { cookies } from "next/headers";

const Page = async (props) => {
  const slug = props.params.slug;
  const cookieStore = cookies();
  let currentLanguage = cookieStore.get('language')?.value || 'en';


 
  const query = `page("person").children.filterBy('uuid', '==', 'page://${slug}')`

  return <Wrapper currentLanguage={currentLanguage} query={query} />;
};

export default Page;
