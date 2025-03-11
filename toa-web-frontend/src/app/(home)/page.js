import { fetchDataOriginAPI } from "../utils/hooks/fetchData";
import HomeWrapper from "./components/Wrapper";
import { cookies } from 'next/headers';

export default async function Home(props) {
  const cookieStore = cookies();
  let currentLanguage = cookieStore.get('language')?.value || 'en';


//   const bodyData = {
//     query:`page("objects").children`,
//     select: {
//       id: true,
//       coverimage: true,
//       title: true,
//       cover_text: true,
//       subtheme: true
//     },
//     "pagination": {
//       "page": 1,
//       "limit": 12,
     
//     }
//  }

 // const homeData = await fetchDataOriginAPI({bodyD: bodyData, language: currentLanguage})
  const bodyData2 = {
    query:`page("home")`,
    select: {
      id: true,
      slug: true,
      home_header: true,
      home_sub_header: true,
      // about
      home_about_title: true,
      home_about_text: true,
      // playground
      home_playground_title: true,
      home_playground_text: true,
      // team
      home_team_title: true,
      home_team_text: true,
      // button list
      open_about_btn: true,
      open_playground_btn: true,
      open_team_btn: true,

      

    },
    
 }
 
  const homeText = await fetchDataOriginAPI({bodyD: bodyData2, language: currentLanguage})
 
  return (
   
    <HomeWrapper homeText={homeText} currentLanguage={currentLanguage} />
  );
}
