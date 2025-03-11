import { fetchDataOriginAPI } from "@/app/utils/hooks/fetchData";
import ObejectWrapper from "./components/ObjectWrapper";
import yaml from "js-yaml";
import { cookies } from 'next/headers';

const ObjectPage = async (props) => {
  const slug = props.params.slug;

  const cookieStore = cookies();
  let currentLanguage = cookieStore.get('language')?.value || 'en';

  const bodyData = {
    query: `page("objects").children.filterBy('uuid', '==', 'page://${slug}')`,
    select: {
      id: true,
      uuid: true,
      slug: true,
      objectname: true,
      coretheme: true,
      subtheme: true,
      contents: true,
      coverimage: true,
      cover_xray: true,
      cover_source: true,
      object_image: true,
      object_audio: true,
      cover_text: true,
      object_file_type: true,
      intendedTemplate: true,
      title: true,
      relatedobjs: true,
      contributor: true,
      dynamic_category: true,
      year_of_object: true,
      provenance: true,
      number_toa: true,
      source_of_origin: true,
      date_of_collection: true,
      measurse: true,
      location: true,
      object_file: true,
      glossary_of_entity: true,
      knowledgeobjs: true,
      relatedobjs: true,
      object_image_layout: true
    },
  };
  const objectData = await fetchDataOriginAPI({ bodyD: bodyData, language: currentLanguage });
  
  objectData.result[0].subtheme = objectData.result[0].subtheme.split(",").map((v) => v.trim());
  objectData.result[0].contents = yaml.load(objectData.result[0].contents)
  objectData.result[0].dynamic_category = yaml.load(objectData.result[0].dynamic_category)

  const query=`page("objects").children.filterBy('uuid', '==', 'page://${slug}')`
  
  return <ObejectWrapper pageData={objectData.result[0]} query={query} currentLanguage={currentLanguage} />;
};

export default ObjectPage;
