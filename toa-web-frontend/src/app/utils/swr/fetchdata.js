import useSWR from "swr";
import { fetchDataOriginAPI } from "../hooks/fetchData";
import yaml from "js-yaml"
import { SUBTHEMELIST } from "@/app/constant/subthemelist";



export const ObjectPageData = ({currentLanguage, query}) => {
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
      cover_text: true,
      object_file_type: true,
      intendedTemplate: true,
      title: true,
      relatedobjs: true,
      contributor: true,
      dynamic_category: true,
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
}

export const DynamicInfoPageChildrenData = ({currentLanguage,slug}) => {
  const bodyData = {
    query: `page("info").children.filterBy('slug', '==', '${slug}')`,
    select: {
      slug: true,
      uuid: true, 
      info_title: true,
      info_header_text: true,
      contents: true,
    }
  }
  const { data, error, isLoading } = useSWR(
    // The key array will be passed to the fetcher as the argument
    { bodyD:bodyData, language:currentLanguage },  // This will be passed as the first argument to the fetcher
    fetchDataOriginAPI   // The fetcher function
  );

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading
}

}
export const DynamicInfoPageData = ({currentLanguage}) => {
  const bodyData = {
    query: `page("info").children`,
    select: {
      slug: true,
      uuid: true, 
      info_title: true
    }
  }
  const { data, error, isLoading } = useSWR(
    // The key array will be passed to the fetcher as the argument
    { bodyD:bodyData, language:currentLanguage },  // This will be passed as the first argument to the fetcher
    fetchDataOriginAPI   // The fetcher function
  );

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading
}

}

export const HomeData = ({currentLanguage}) => {
  const bodyData = {
    query:`page("objects").children`,
    select: {
      id: true,
      coverimage: true,
      title: true,
      cover_text: true,
      subtheme: true,
      uuid: true,
      slug: true,
    },
    "pagination": {
      "page": 1,
      "limit": 12,
     
    }
 }

 
     const { data, error, isLoading } = useSWR(
        // The key array will be passed to the fetcher as the argument
        { bodyD:bodyData, language:currentLanguage },  // This will be passed as the first argument to the fetcher
        fetchDataOriginAPI   // The fetcher function
      );

    
    return {
        dataSwr: data,
        error: error,
        isLoading: isLoading
    }
}


export const FilteredTermsData = ({currentLanguage, objectData}) => {
// Glossary 
  // Find Glossary List
  const playgroundTermDataBody = {
    query: `page("glossary")`,
    select: {
      id: true,
      title: true,
      glossary_title: true,
      glossary_header_text: true,
      glossary_list: true
      
    },
  };
  const { data, error, isLoading } = useSWR(
    // The key array will be passed to the fetcher as the argument
    { bodyD:playgroundTermDataBody, language:currentLanguage },  // This will be passed as the first argument to the fetcher
    fetchDataOriginAPI   // The fetcher function
  );

  let filteredTerms;

  if(!isLoading && data.result){
    const gList = data.result.glossary_list

    if (typeof gList === 'string' && gList.trim().length > 0) {
      data.result.glossary_list = yaml.load(data.result.glossary_list).map((v) => {
        return {
            word_name: v.word_name,
            word_about: v.word_about
        }
      })
    }else{
      data.result.glossary_list = data.result.glossary_list
    }
  
  
   

  const terms = objectData.glossary_of_entity.split(",").map((v) => v.trim())
  filteredTerms = data.result.glossary_list.filter((v) => {
    if(terms.includes(v.word_name)){
      return v
    }
  })
  data.result.filteredTerms=filteredTerms
  }
  
  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
    filteredTermsSWR: filteredTerms
}
}
// ObjectPage
export const RelationListData = ({currentLanguage, objectData}) => {
  const bodyData = {
    query: `page("objects").children`,
    select: {
      id: true,
      uuid: true,
      slug: true,
      title: true,
      objectname: true,
      subtheme: true,
      coverimage: true,
      entity_type: true
    },
   
 }

 
    const { data, error, isLoading } = useSWR(
        // The key array will be passed to the fetcher as the argument
        { bodyD:bodyData, language:currentLanguage },  // This will be passed as the first argument to the fetcher
        fetchDataOriginAPI   // The fetcher function
      );
      const relationList = {
        cureated: [],
        knowledge: [],
      }
    if(!isLoading && data.result){
     
      objectData.subtheme.slice(0, 2).forEach((v) => {
        relationList[v] = []
      })
    
      const relationListO3 = Object.keys(relationList)[2]
      const relationListO4 = Object.keys(relationList)[3]
    
      const objRelationKnowledgeList = objectData["knowledgeobjs"].split(",").map((v) => v.trim())
      const objRelationCuratedList = objectData["relatedobjs"].split(",").map((v) => v.trim())
     
      for(let i = 0; i < data.result.length; i++){
       const subThemeList = data.result[i]["subtheme"].split(",").map((v) => v.trim())
        if(relationList.knowledge.length < 7){
          if(objRelationKnowledgeList.some((v) => v === data.result[i]["title"])){
            relationList["knowledge"].push(data.result[i])
          }
        }
        if(relationList.cureated.length < 7){
          if(objRelationCuratedList.some((v) => v === data.result[i]["title"])){
            relationList["cureated"].push(data.result[i])
          }
        }
    
        if(relationListO3){
          if(relationList[relationListO3].length < 7){
            if(subThemeList.some((v) => v === relationListO3)){
              relationList[relationListO3].push(data.result[i])
            }
          }
        }
    
        if(relationListO4){
          if(relationList[relationListO4].length < 7){
            if(subThemeList.some((v) => v === relationListO4)){
              relationList[relationListO4].push(data.result[i])
            }
          }
        }
        
    
    
    
        if(relationList.cureated.length >= 7 && relationList.knowledge.length >= 7){
          if(relationListO3 && !Boolean(relationListO4) && relationList[relationListO3].length >= 7){
            
              break;
            
          }
      
          if(relationListO4 && !Boolean(relationListO3) && relationList[relationListO4].length >= 7){
            
              break;
          }
          if(relationListO4 && relationListO4 && relationList[relationListO4].length >= 7 && relationList[relationListO3].length >= 7){
            
              break;
          }
          break;
        }
      }
    }

    
    return {
        dataSwr: data,
        error: error,
        isLoading: isLoading,
        relationListSWR: relationList
    }
}

export const ImagesCaption = ({currentLanguage}) => {
  const bodyData = {
    query: `site`,
    select: {
       images: {
        query: `kirby.page('imgs').files.filterBy('type', 'image')`,  // Fetch the first file in coverimage
        select: {
          id: true,
          uuid: true,
          url: true,            // Fetch the URL of the coverimage
          filename: true,       // Fetch the filename of the image
          type: true,           // Fetch the file type (image)
          content: {
            caption: true,      // Fetch the caption from image metadata
            alt: true,          // Fetch the alt text from image metadata
            layer1_left: true,
            layer1_right: true,
            layer2_left: true,
            layer2_right: true,
          }
        }
      },
    },
   
 }

 
    const { data, error, isLoading } = useSWR(
        // The key array will be passed to the fetcher as the argument
        { bodyD:bodyData, language:currentLanguage },  // This will be passed as the first argument to the fetcher
        fetchDataOriginAPI   // The fetcher function
      );


      return {
        dataSwr: data,
        error: error,
        isLoading: isLoading,
      
    }
}

// Explore & Theme Page
export const FilterData = ({currentLanguage, queryText}) => {
  const bodyData = {
    query:queryText,
    select: {
      id: true,
      uuid: true,
      slug: true,
      objectname: true,
      coretheme: true,
      subtheme: true,
    //   contents: true,
      coverimage: true,
      intendedTemplate: true,
      title: true,
      cover_text: true,
      preview_text: true,
      entity_type: true,
      contributor: true,
      
      dynamic_category: true,
      year_of_object: true,
      provenance: true,
      number_toa: true,
      source_of_origin: true,
      date_of_collection: true,
      measurse: true,
      location: true,
    
     
    },
 
   
 }
  const { data, error, isLoading } = useSWR(
    // The key array will be passed to the fetcher as the argument
    { bodyD:bodyData, language:currentLanguage },  // This will be passed as the first argument to the fetcher
    fetchDataOriginAPI   // The fetcher function
  );

  //  Create Category List
  let categoryList = []

  if(queryText === `page("objects").children`){
    categoryList = [
      {
        name: "coretheme",
        items: [
          "knowledge",
          "resitution",
          "identity",
          "artisticreflections",
          "memory",
        ]
      },
      {
        name: "subtheme",
        items: [
          ...Object.keys(SUBTHEMELIST)
        ]
      }
     ];
  }else{
    categoryList = [
      {
        name: "subtheme",
        items: [
          ...Object.keys(SUBTHEMELIST)
        ]
      }
     ];
  }
  

  if(!isLoading && data.result){
    for(let i = 0; i < data.result.length; i++) {
     
        const dynamicCategory = data.result[i]["dynamic_category"];
      
        try {
          if (typeof dynamicCategory === 'string' && dynamicCategory.trim().length > 0) {
            data.result[i]["dynamic_category"] = yaml.load(dynamicCategory);
          }
        } catch (error) {
          console.error('Error parsing YAML:', error);
          data.result[i]["dynamic_category"] = data.result[i]["dynamic_category"] 
        }
        // if (typeof dynamicCategory === 'string' && dynamicCategory.trim().length > 0) {
        //   data.result[i]["dynamic_category"] = yaml.load(dynamicCategory);
        // }else{
        //   data.result[i]["dynamic_category"] = data.result[i]["dynamic_category"] 
        // }

        if(data.result[i]["dynamic_category"]){
          for(let j = 0; j < data.result[i]["dynamic_category"].length; j++){
            const index = categoryList.findIndex((v) => String(v.name).toLocaleLowerCase() === String(data.result[i]["dynamic_category"][j]["category_box_name"]).toLocaleLowerCase())
            if(index < 0){
              // if not exist
              const newCate = {
                name: data.result[i]["dynamic_category"][j]["category_box_name"],
                items: []
                // items: ["all",...data.result[i]["dynamic_category"][j]["category_box"].split(",").map((v) => v.trim().toLocaleLowerCase())]
              }
              // category_box가 문자열인지 확인한 후 split 사용
              if (typeof data.result[i]["dynamic_category"][j]["category_box"] === "string") {
                newCate.items = ["all", ...data.result[i]["dynamic_category"][j]["category_box"]
                  .split(",")
                  .map((v) => v.trim().toLocaleLowerCase())];
              }
              categoryList.push(newCate)
            }else{
              // // found category
              // categoryList[index] = {
              //   name: categoryList[index].name,
              //   items: []
              //   // items: Array.from(new Set([...categoryList[index].items, ...data.result[i]["dynamic_category"][j]["category_box"].split(",").map((v) => v.trim().toLocaleLowerCase())]))
              // }
              // found category
                  const existingItems = categoryList[index].items;

                  // category_box가 문자열인지 확인한 후 split 사용
                  if (typeof data.result[i]["dynamic_category"][j]["category_box"] === "string") {
                    const newItems = data.result[i]["dynamic_category"][j]["category_box"]
                      .split(",")
                      .map((v) => v.trim().toLocaleLowerCase());
                  
                    categoryList[index] = {
                      name: categoryList[index].name,
                      items: Array.from(new Set([...existingItems, ...newItems])),
                    };
                }
            }
            
          }
        }
        
     
    }

  
    data.result = data.result.sort((a,b) => a.title.localeCompare(b.title))
    
  }

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
    categoryListSwr: categoryList
}
}
// Explore & Theme Page 여기 나중에 search api 사용할때 pagination 으로 변경하기 
export const FilterData2 = ({currentLanguage, queryText}) => {
  const bodyData = {
    query:queryText,
    select: {
      id: true,
      uuid: true,
      slug: true,
      objectname: true,
      coretheme: true,
      subtheme: true,
    //   contents: true,
      coverimage: true,
      intendedTemplate: true,
      title: true,
      cover_text: true,
      preview_text: true,
      entity_type: true,
      contributor: true,
      
      dynamic_category: true,
      year_of_object: true,
      provenance: true,
      number_toa: true,
      source_of_origin: true,
      date_of_collection: true,
      measurse: true,
      location: true,
    
     
    },
    "pagination": {
      "page": 1,
      "limit": 8,
     
    }
 
   
 }
  const { data, error, isLoading } = useSWR(
    // The key array will be passed to the fetcher as the argument
    { bodyD:bodyData, language:currentLanguage },  // This will be passed as the first argument to the fetcher
    fetchDataOriginAPI   // The fetcher function
  );

  
  
    // data.result = data.result.sort((a,b) => a.title.localeCompare(b.title))
    


  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
    
}
}

export const PeronsData = ({currentLanguage}) => {
  const bodyData2 = {
    query: `page("person").children`,
    select: {
      id: true,
      uuid: true,
      title: true,
      coverimage: true,
      jobtitle: true,
      fullname: true
    },
  };

  const { data, error, isLoading } = useSWR(
    { bodyD:bodyData2, language:currentLanguage }, 
    fetchDataOriginAPI 
  );


  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading ,
  
  };


}

export const TeamsData = ({currentLanguage}) => {
      const bodyData = {
        query: `page("team")`,
        select: {
          contents: true
        },
      };

    
    const { data, error, isLoading } = useSWR(
        { bodyD:bodyData, language:currentLanguage }, 
        fetchDataOriginAPI 
      );



    return {
      dataSwr: data,
      error: error,
      isLoading: isLoading,
    
    };
}
export const ContributorsData = ({currentLanguage}) => {
      const bodyData = {
        query: `page("contributors")`,
        select: {
          contents: true
        },
      };

    
    const { data, error, isLoading } = useSWR(
        { bodyD:bodyData, language:currentLanguage }, 
        fetchDataOriginAPI 
      );



    return {
      dataSwr: data,
      error: error,
      isLoading: isLoading,
    
    };
}


export const PersonData = ({currentLanguage, query}) => {
  
  const bodyData = {
    query: query,
    select: {
      id: true,
      uuid: true,
      title: true,
      slug: true,
      coverimage: true,
      bio: true,
      fullname: true,
    },
  };

  const { data, error, isLoading } = useSWR(
    { bodyD:bodyData, language:currentLanguage }, 
    fetchDataOriginAPI 
  );

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
  
  };

}
export const PersonDataEntitiesAsCreator = ({currentLanguage, title}) => {


  const bodyData2 = {
    query: `page("objects").children.filterBy('creator', '*=', "${title}")`,
    select: {
      id: true,
      uuid: true,
      slug: true,
      title: true,
      coverimage: true,
      cover_text: true,
      coretheme: true,
      entity_type: true,
      preview_text: true
    },
  };

  const { data, error, isLoading } = useSWR(
    { bodyD:bodyData2, language:currentLanguage }, 
    fetchDataOriginAPI 
  );

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
  
  };

}
export const PersonDataEntitiesAsContributor = ({currentLanguage, title}) => {


  const bodyData2 = {
    query: `page("objects").children.filterBy('contributor', '*=', "${title}")`,
    select: {
      id: true,
      uuid: true,
      slug: true,
      title: true,
      coverimage: true,
      cover_text: true,
      coretheme: true,
      entity_type: true,
      preview_text: true
    },
  };

  const { data, error, isLoading } = useSWR(
    { bodyD:bodyData2, language:currentLanguage }, 
    fetchDataOriginAPI 
  );

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
  
  };

}

export const PlaygroundChildrenData = ({currentLanguage}) => {
  const bodyData = {
    query: `page("playground").children`,
    select: {
      id: true,
      title: true,
      uuid:true,
      playground_item_blurb: true,
      author: true,
      timestamp: "page.timestamp.toDate('m.d.y')",
      contents: true,
      coverimage: true,

  
    },
  };

  const { data, error, isLoading } = useSWR(
    { bodyD:bodyData, language:currentLanguage }, 
    fetchDataOriginAPI 
  );

  // if(!isLoading){
  //   for(let i = 0; i < data.result.length; i++){
  //     if(typeof data.result[i].contents === "string"){
  //       data.result[i].contents = yaml.load(data.result[i].contents)
  //       data.result[i].contents = data.result[i].contents ? Array.from(new Set(data.result[i].contents.filter((v2) => v2.type === "obj").map((v2) => v2.content.collection_obj))) : []
  //     }
  //   }
    
  // }
  
  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
   
  
  };
}

export const PlaygroundChildrenItemsData = ({titles, currentLanguage}) => {
  const bodyData = {
    query: `page("objects").children.filterBy('title', 'in', ${titles})`,
    select: {
      id: true,
      uuid: true,
      slug: true,
      title: true,
      coretheme: true,
      coverimage: true,
    //   coverimage: true,
    //   cover_text: true,
    },
  };

  const { data, error, isLoading } = useSWR(
    { bodyD:bodyData, language:currentLanguage }, 
    fetchDataOriginAPI 
  );
  // let coreThemeList =[];
  // if(!isLoading){

  //   for(let i = 0; i < data.result.length; i++){
  //     if (typeof data.result[i].coretheme === 'string') {
  //       data.result[i].coretheme = data.result[i].coretheme.split(",").map((v) => v.trim())
  //       // coreThemeList = [...coreThemeList, ...data.result[i].coretheme]
  //     }
  //   }
 
  //   coreThemeList = Array.from(new Set(coreThemeList))
  // }
  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
    // coreThemeList: coreThemeList
   
  
  };
}

export const PlaygroundContentObjCoverImage = ({title, currentLanguage}) => {
  const bodyData = {
    query: `page("objects").children.filterBy('title', '==', '${title}')`,
    select: {
      id: true,
      uuid: true,
      coverimage: true,
 
    },
  };
  const { data, error, isLoading } = useSWR(
    { bodyD:bodyData, language:currentLanguage }, 
    fetchDataOriginAPI 
  );
  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
   
   
  
  };
}

export const PlaygroundContentData = ({query, currentLanguage}) => {
  const bodyData = {
    query: query,
    select: {
      contents: true,
    },
  };

  const { data, error, isLoading } = useSWR(
    { bodyD:bodyData, language:currentLanguage }, 
    fetchDataOriginAPI 
  );

  if(!isLoading){
    if(typeof data.result[0].contents === "string"){
      data.result[0].contents = yaml.load(data.result[0].contents)

    }
  }

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
   
   
  
  };
}

// Object Page
export const GlossaryData = ({currentLanguage}) => {
  // Glossary 
    // Find Glossary List
    const playgroundTermDataBody = {
      query: `page("glossary")`,
      select: {

        glossary_list: true
        
      },
    };
    const { data, error, isLoading } = useSWR(
      // The key array will be passed to the fetcher as the argument
      { bodyD:playgroundTermDataBody, language:currentLanguage },  // This will be passed as the first argument to the fetcher
      fetchDataOriginAPI   // The fetcher function
    );
  
    
  
    if(!isLoading && data.result){
      const gList = data.result.glossary_list
  
      if (typeof gList === 'string' && gList.trim().length > 0) {
        data.result.glossary_list = yaml.load(data.result.glossary_list).map((v) => {
          return {
              word_name: v.word_name,
              word_about: v.word_about
          }
        })
      }else{
        data.result.glossary_list = data.result.glossary_list
      }
    
    
     
  
    }
    
    return {
      dataSwr: data,
      error: error,
      isLoading: isLoading,
      
  }
  }

export const ManifestoContentsData = ({currentLanguage}) => {
  const bodyData = {
    query: `page("manifesto")`,
    select: {
        contents: true,
       
    }
}

    const { data, error, isLoading } = useSWR(
      // The key array will be passed to the fetcher as the argument
      { bodyD:bodyData, language:currentLanguage },  // This will be passed as the first argument to the fetcher
      fetchDataOriginAPI   // The fetcher function
    );

    if(!isLoading && data.result){
      const contents = data.result.contents
    
      if (typeof contents === 'string' && contents.trim().length > 0) {
        data.result.contents = yaml.load(data.result.contents)
      }else{
        data.result.contents  = data.result.contents 
      }
    
    
    
    
    }

return {
  dataSwr: data,
  error: error,
  isLoading: isLoading,
  
}
}


export const AboutContentData = ({currentLanguage}) => {
  const bodyDataForAbout = {
    query:`page("about")`,
    select: {
       
        content: true,
       
    }

  }


const { data, error, isLoading } = useSWR(
  // The key array will be passed to the fetcher as the argument
  { bodyD:bodyDataForAbout, language:currentLanguage },  // This will be passed as the first argument to the fetcher
  fetchDataOriginAPI   // The fetcher function
);

 

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
    
  }
}


export const ObjectRelationTextData = ({currentLanguage}) => {
  const bodyDataForAbout = {
    query:`page("objects")`,
    select: {
      relation_title1: true,
      relation_title2: true,
      curateditem_btn_text: true,
      knowledge_btn_text: true
    }

  }


const { data, error, isLoading } = useSWR(
  // The key array will be passed to the fetcher as the argument
  { bodyD:bodyDataForAbout, language:currentLanguage },  // This will be passed as the first argument to the fetcher
  fetchDataOriginAPI   // The fetcher function
);

 

  return {
    dataSwr: data,
    error: error,
    isLoading: isLoading,
    
  }
}