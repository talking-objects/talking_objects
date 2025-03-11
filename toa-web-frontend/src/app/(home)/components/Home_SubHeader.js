import HContainer from "@/app/components/containers/HContainer";
import { SUBTHEMELIST } from "@/app/constant/subthemelist";
import { useEffect, useState } from "react";
import HeadingText from "../../components/elements/HeadingText";
import Image from "next/image";
import ShuffleIcon from "/public/assets/icons/shuffle-icon.svg"
import DragAnimationHome from "@/app/components/elements/DragAnimationHome";
const HomeSubHeader = ({ randomEntities, text }) => {
  const [randomSubTheme, setRandomSubTheme] = useState("");
  const [start, setStart] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const [randomEntitiesList, setRandomEntitiesList] = useState([]);
  function getRandomElements(array, count) {
    let nCount = count 
    if (count > array.length) {
      nCount = array.length - 1;

        // throw new Error("Count cannot be greater than the array length.");
    }

    // 배열 복사본 생성
    const arrayCopy = [...array];
    const randomElements = [];

    for (let i = 0; i < nCount; i++) {
        // 랜덤 인덱스 선택
        const randomIndex = Math.floor(Math.random() * arrayCopy.length);

        // 랜덤 요소 추출 및 배열에서 제거
        randomElements.push(arrayCopy.splice(randomIndex, 1)[0]);
    }
   

    return randomElements;
}
// const changeRandomSubTheme = ({first=false}) => {
//   let duration = 3; // Duration of the shuffle effect in seconds
//   let startTime = Date.now();
//   setRandomSubTheme("");
//   setShuffling(true);
//   setLoadingImage(true);
//   if(!first){
//     setStart(true)
//   }else{
//     setStart(false)
//   }
//   let shuffleInterval = setInterval(() => {
//     let elapsed = (Date.now() - startTime) / 1000; // Time in seconds

//     if (elapsed >= duration && !shuffling) {
//       clearInterval(shuffleInterval);

//       let randomList = [];
//       let getRandomKey;
//       let attempt = 0;
      
//       // 랜덤 리스트가 빈 배열일 경우 계속해서 새로운 랜덤 키와 리스트를 찾음
//       do {
//         const subThemeListKeys = Object.keys(SUBTHEMELIST);
//         getRandomKey = subThemeListKeys[Math.floor(Math.random() * subThemeListKeys.length)];
//         randomList = randomEntities.filter((entity) => entity.subtheme.includes(getRandomKey));
//         attempt++;
//         if (attempt > 10) break; // 무한 루프 방지
//       } while (randomList.length === 0);

//       // randomList가 비어 있지 않을 때만 업데이트
//       if (randomList.length > 0) {
//         // 랜덤 서브테마 설정
//         const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
//         setRandomSubTheme(selectedRandomSubTheme);

//         // 랜덤 엔티티 리스트 업데이트
//         setRandomEntitiesList(getRandomElements(randomList, 8));
//         setShuffling(false);
//       }else{
//         const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
//         setRandomSubTheme(selectedRandomSubTheme);

//         // 랜덤 엔티티 리스트 업데이트
//         setRandomEntitiesList(getRandomElements(randomList, 8));
//         setShuffling(false);
//         setLoadingImage(false)
//       }

//     } else {
//       const subThemeListKeys = Object.keys(SUBTHEMELIST);
//       const getRandomKey = subThemeListKeys[Math.floor(Math.random() * subThemeListKeys.length)];

//       // 랜덤 서브테마 설정
//       const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
//       setRandomSubTheme(selectedRandomSubTheme);
//     }
//   }, 100);
// };

const changeRandomSubTheme = async ({ first = false }) => {
  setRandomSubTheme("");
  setShuffling(true);
  setLoadingImage(true);

  if (!first) {
    setStart(true);
  } else {
    setStart(false);
  }

  const findRandomListAndLoadImage = async () => {
    let randomList = [];
    let getRandomKey;
    let attempt = 0;

    do {
      const subThemeListKeys = Object.keys(SUBTHEMELIST);
      getRandomKey = subThemeListKeys[Math.floor(Math.random() * subThemeListKeys.length)];
      randomList = randomEntities.filter((entity) => entity.subtheme.includes(getRandomKey));
      attempt++;
      if (attempt > 10) break;
    } while (randomList.length === 0);

    if (randomList.length > 0) {
      const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
      setRandomSubTheme(selectedRandomSubTheme);
      setRandomEntitiesList(getRandomElements(randomList, 8));
    } else {
      const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
      setRandomSubTheme(selectedRandomSubTheme);
      setRandomEntitiesList(getRandomElements(randomList, 8));
    }

    await loadImage();
    // setLoadingImage(false);
  };

  await findRandomListAndLoadImage();
  setShuffling(false);
};

const loadImage = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
};

useEffect(() => {
  let shuffleInterval;
  if (loadingImage || shuffling) {
    if(start){
      shuffleInterval = setInterval(() => {
        const subThemeListKeys = Object.keys(SUBTHEMELIST);
        const getRandomKey = subThemeListKeys[Math.floor(Math.random() * subThemeListKeys.length)];
  
        const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
        setRandomSubTheme(selectedRandomSubTheme);
      }, 100);
    }
  } else {
    clearInterval(shuffleInterval);
  }

  return () => clearInterval(shuffleInterval);
}, [loadingImage, shuffling, start]);

  // const changeRandomSubTheme = () => {
  // let duration = 1; // Duration of the shuffle effect in seconds
  // let startTime = Date.now();
  // setRandomSubTheme("")
  // setShuffling(true)
  // setLoadingImage(true)
  // let shuffleInterval = setInterval(() => {
  //   let elapsed = (Date.now() - startTime) / 1000; // Time in seconds

  //   if (elapsed >= duration && !shuffling) {
  //     clearInterval(shuffleInterval);
  //     const subThemeListKeys = Object.keys(SUBTHEMELIST);
  //     const getRandomKey = subThemeListKeys[Math.floor(Math.random() * subThemeListKeys.length)];
     
  
  
  //     // random subtheme
  //     const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
  //     setRandomSubTheme(selectedRandomSubTheme);
  //     let randomList = randomEntities.filter((entity) => {
  //       if (entity.subtheme.includes(getRandomKey)) {
  //         return entity;
  //       }
  //     });
     
    
  //     // update random entities List

  //     setRandomEntitiesList(getRandomElements(randomList, 8));
  //     setShuffling(false)
     
  
  //   } else {
  //     const subThemeListKeys = Object.keys(SUBTHEMELIST);
  //     const getRandomKey = subThemeListKeys[Math.floor(Math.random() * subThemeListKeys.length)];
     
  
  
  //     // random subtheme
  //     const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
  //     setRandomSubTheme(selectedRandomSubTheme);
  //     // setShuffling(false)
  //   }
  // },100)
    
  // };
  
  useEffect(() => {
    if (randomEntities) {
      let notFound = true;
      let index = 0
      const findRandomList = () => {
        setShuffling(true);
        setLoadingImage(true);
        while (notFound && index < 10) {
          const subThemeListKeys = Object.keys(SUBTHEMELIST);
          const getRandomKey = subThemeListKeys[Math.floor(Math.random() * subThemeListKeys.length)];
  
          // 랜덤 subtheme 선택
          const selectedRandomSubTheme = `${SUBTHEMELIST[getRandomKey]}`;
          setRandomSubTheme(selectedRandomSubTheme);
  
          // get randomList
          const randomList = randomEntities.filter((entity) => entity.subtheme.includes(getRandomKey));
  
          index += 1;
          if (randomList && randomList.length > 0) {
            // randomList가 있을 때만 상태 업데이트
            // setRandomEntitiesList(randomList.slice(0, 6));
            setRandomEntitiesList(getRandomElements(randomList, 6));
            setShuffling(false)
            // setLoadingImage(false)
            notFound = false;
          }
         
        }
      };
    
      findRandomList();
    }
  }, [randomEntities]);

  
  return (
    <HContainer block={true} color={"white"}>
      <div className={`w-screen h-[100svh] overflow-hidden absolute top-0 left-0 flex ${loadingImage ? "opacity-0" : "opacity-100"} duration-300`}>{randomEntitiesList.length > 0 && (!shuffling) && <DragAnimationHome imageData={randomEntitiesList} relation={true} setShuffling={setLoadingImage} />}</div>
      {/* {!shuffling && !loadingImage && <div className="w-full h-full bg-white absolute top-0 left-0 bg-opacity-50 select-none pointer-events-none"></div>} */}
       <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none p-4 2xl:p-0 ">
           <div className={`flex w-full h-full flex-col ${randomSubTheme === "" && !start ? "justify-center" : "justify-center"} gap-2 flex-wrap`}>
             <div className={`flex flex-col items-center justify-center`}>
              <HeadingText sub={true} text={"TALKING OBJECTS"} />
              <HeadingText sub={true} text={"Connected By"} />
              {(start) && <HeadingText sub={true} text={randomSubTheme} button={true} founded={randomSubTheme !== "" && !shuffling} />}
             </div>
             <div className="flex flex-col items-center gap-2 flex-wrap mt-8">
              <div onClick={!loadingImage ? changeRandomSubTheme : () => {}} className={`flex items-center justify-center gap-2 cursor-pointer bg-white rounded-full shadow-2xl px-4 py-4 ${loadingImage ? "pointer-events-none opacity-80" : "pointer-events-auto active:scale-90 active:border-toa-orange active:shadow-toa-orange active:text-toa-orange transition-all duration-0"}`}>
               <div className={`relative h-[36px] aspect-square ${loadingImage ? "opacity-50" : "opacity-100"}`}>
                <Image
                 priority
                 alt="Shuffle Icon"
                 src={ShuffleIcon}
                />
               </div>

               {(shuffling || loadingImage) && <div className="font-headerh1 text-base md:text-lg lg:text-xl">{"Shuffling"}</div>}
               {/* {!shuffling && loadingImage && <div className="font-headerh1 text-base md:text-lg lg:text-xl">{"Loading Objects..."}</div>} */}
               {!shuffling && !loadingImage && <div className="font-headerh1 text-base md:text-lg lg:text-xl">{"Shuffle to discover"}</div>}
              </div>
             </div>
           </div>
       </div>
       </HContainer>
  
  );
};

export default HomeSubHeader;
