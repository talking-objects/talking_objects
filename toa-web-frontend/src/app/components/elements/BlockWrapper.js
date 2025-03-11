import { useEffect, useMemo, useRef, useState } from "react";
import DContainer from "../containers/DContainer";
import yaml from "js-yaml";
import TermsFilter from "@/app/utils/hooks/termsFilter";
import ReactPlayer from "react-player";
import { TOA_COLORS } from "@/app/constant/kirbyurl";
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import ReactAudioPlayer from "react-audio-player";
import { formatTime, getRandomPlaceHolder } from "@/app/utils/hooks/etc";
import { PlaygroundContentObjCoverImage } from "@/app/utils/swr/fetchdata";
import Image from "next/image";
import HighlightWords from "@/app/utils/hooks/termsFilterNew";
import { useSetRecoilState } from "recoil";
import { globalTerm } from "@/app/utils/recoil/state";
import ReactMarkdown from "react-markdown";
import MarkdownIt from "markdown-it";
import { useRouter } from "next/navigation";


const SourceText = ({children}) => {
  return <span className="p-2 bg-toa-blue text-xs lg:text-[15px] font-headermsemibold leading-tight">
    <span dangerouslySetInnerHTML={{__html: `${children}`}}></span>
  </span>
}
const CenterWrapper = ({ children, align = "left" }) => {
  return (
    <div
      className={`flex ${
        align === "left" ? "justify-start" : "justify-end"
      } w-full lg:w-3/5`}
    >
      {children}
    </div>
  );
};

const ObjTypeImageItem = ({data}) => {
  const router = useRouter()
  const [error, setError] = useState(false)
  const randomImg = useMemo(() => {
    return getRandomPlaceHolder()
  },[])
  const [getImage, setImage] = useState(null)
  const onClick = () => {
    if(data?.uuid){

      router.push(`/objects/${String(data.uuid).slice(7)}`)
    }
  }
   useEffect(() => {
   
      if(data?.coverimage){
        setImage(data.coverimage)
      
      }else{
        
     
      
      }
      

    
  },[data])
  return  <div
  onClick={onClick}
  style={{
    // backgroundImage: getImage ?`url(${process.env.KB_API_FILE}/${yaml.load(getImage)})` : getImage,
  }}
  className={`${data?.uuid ? "pointer-events-auto cursor-pointer": "pointer-events-none cursor-auto"}  flex w-full lg:w-1/3 aspect-video relative lg:aspect-square rounded-xl shadow-lg drop-shadow-md bg-no-repeat bg-cover bg-center bg-white overflow-hidden`}
>
{(Boolean(getImage) && !error) && <Image
    src={`${process.env.KB_API_FILE}/${yaml.load(getImage)}`}
    alt=""
    fill
    quality={60}
    // placeholder="blur" 
    // blurDataURL={randomImg}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
    style={{objectFit:"cover"}}
    onError={() => {
      setError(true)
    }}
    />}
{(Boolean(getImage) && error) && <Image
    src={`${randomImg}`}
    alt=""
    fill
    quality={60}
    // placeholder="blur" 
    // blurDataURL={randomImg}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
    style={{objectFit:"cover"}}
  
    />}
{(!Boolean(getImage) && !error) && <Image
    src={`${randomImg}`}
    alt=""
    fill
    quality={60}
    // placeholder="blur" 
    // blurDataURL={randomImg}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
    style={{objectFit:"cover"}}
  
    />}
</div>
}

const ObjTypeContainer = ({ data, playgroundTermData }) => {
  const router = useRouter()
  const {dataSwr, isLoading} = PlaygroundContentObjCoverImage({title: data.content.collection_obj , currentLanguage: "en"})
  const textObjRef = useRef(null)
  const setGlobalTerm = useSetRecoilState(globalTerm)
  const [objData, setObjData] =useState(null)

  const md = new MarkdownIt({html: true});
  // Define the click handler

  const onClick = () => {
    if(objData?.uuid){
      router.push(`/objects/${String(objData.uuid).slice(7)}`)
    }
  }
  const handleClick = (event) => {
    
    const word = event.target.textContent;
    const glossary = playgroundTermData.find((v) => v.word_name.toLowerCase() === word.toLowerCase())
    setGlobalTerm({
      on: true,
      word: {
        name: glossary.word_name,
        about: glossary.word_about
      }
    })
  };

  const highlightedText = HighlightWords(data.content["collection_obj_text"], playgroundTermData);
  useEffect(() => {
    if(!isLoading){
     
        setObjData(dataSwr.result[0])
      
      

    }
  },[dataSwr])
  useEffect(() => {
    if(textObjRef.current){
      const termWords = textObjRef.current.querySelectorAll(".termWord")
      
     
        // Add click event to each span
      termWords.forEach((span) => {
        
        span.addEventListener("click", handleClick);
      });

      return () => {
        termWords.forEach((span) => {
          span.removeEventListener("click", handleClick);
        });
      };
    }
  },[highlightedText])

  return (
    <div className="w-full flex flex-col gap-2 py-8">
      {objData && <div onClick={onClick} className="text-xl cursor-pointer md:text-xl lg:text-3xl font-headerh1">
        {data.content["collection_obj_title"]}
      </div>}
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <ObjTypeImageItem data={objData} />
        <div ref={textObjRef} className=" w-full lg:w-2/3 font-normal text-base md:text-lg lg:text-xl whitespace-break-spaces" dangerouslySetInnerHTML={{ __html: `${md.render(highlightedText)}` }}>
          
        </div>
      </div>
    </div>
  );
};
const HeadingTypeContainer = ({ data }) => {
  const [getFontSize, setFontSize] = useState("");
  useEffect(() => {
    switch (data.content.level) {
      case "h1":
        setFontSize("text-4xl lg:text-6xl font-bold pt-16 pb-8");
        break;
      case "h2":
        setFontSize("text-3xl lg:text-5xl font-bold pt-16 pb-8");
        break;
      case "h3":
        setFontSize("text-2xl lg:text-4xl font-bold pt-16 pb-8");
        break;
      case "h4":
        setFontSize("text-xl lg:text-3xl font-bold pt-16 pb-8");
        break;
      case "h5":
        setFontSize("text-lg lg:text-2xl font-bold pt-16 pb-8");
        break;
      default:
        // h6
        setFontSize("text-base lg:text-xl font-bold pt-16 pb-8");
    }
  }, []);
  return (
    <div className={`block ${getFontSize} flex justify-center font-headermsemibold text-[#414B5A]`}>
      <CenterWrapper>{<span dangerouslySetInnerHTML={{__html: data.content.text}}></span>}</CenterWrapper>
    </div>
  );
};

const TextTypeContainer = ({ data, playgroundTermData }) => {
  const textRef = useRef(null)
  const setGlobalTerm = useSetRecoilState(globalTerm)
  const md = new MarkdownIt({html: true});
  // Define the click handler
  const handleClick = (event) => {
    
    const word = event.target.textContent;
    const glossary = playgroundTermData.find((v) => v.word_name.toLowerCase() === word.toLowerCase())
    setGlobalTerm({
      on: true,
      word: {
        name: glossary.word_name,
        about: glossary.word_about
      }
    })
  };

  const highlightedText = HighlightWords(data.content.text, playgroundTermData);
  useEffect(() => {
    if(textRef.current){
      const termWords = textRef.current.querySelectorAll(".termWord")
      
        // Add click event to each span
        termWords.forEach((span) => {
         
          span.addEventListener("click", handleClick);
        });
      return () => {
        termWords.forEach((span) => {
          span.removeEventListener("click", handleClick);
        });
      };
    }
  },[highlightedText])

  return (
    <div className="w-full flex justify-center font-normal text-base md:text-lg lg:text-xl text-[#414B5A] py-4">
      <CenterWrapper>      
        <div ref={textRef} className="termContainer whitespace-break-spaces" dangerouslySetInnerHTML={{ __html: `${md.render(highlightedText)}` }}></div>  
      </CenterWrapper>
    </div>
  );
};
const ListTypeContainer = ({ data }) => {
  const md = new MarkdownIt({html: true});
  return (
    <div className="w-full flex justify-center font-normal text-base md:text-lg lg:text-xl py-2">
      <CenterWrapper>
        <div className="whitespace-break-spaces" dangerouslySetInnerHTML={{ __html: `${md.render(data.content.text)}` }}></div>
      </CenterWrapper>
    </div>
  );
};
const QuoteTypeContainer = ({ data }) => {
  const md = new MarkdownIt({html: true});
  return (
    <div className="w-full flex justify-center py-20">
      <CenterWrapper align="right">
        <div className="flex flex-col gap-2 w-2/3">
          <div
            style={{ color: `${TOA_COLORS["blue"]}` }}
            className={`text-xl flex lg:text-3xl font-headersanssemiitalic`}
          >
            {`>>`}
            {/* {data.content.text} */}
            <p dangerouslySetInnerHTML={{__html: `${md.render(data.content.text)}`}}></p>
            {`<<`}
          </div>
          <span className="text-white flex w-fit">
              <SourceText>
                {md.render(data.content.citation)}
              </SourceText>
            </span>
         
        </div>
      </CenterWrapper>
    </div>
  );
};
const VideoTypeContainer = ({ data }) => {
  useEffect(() => {
    
  }, []);
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="w-10/12 lg:w-9/12 aspect-video bg-neutral-400 rounded-lg overflow-hidden">
        {ReactPlayer.canPlay(data.content.link) ? <ReactPlayer
          width={"100%"}
          controls={true}
          height={"100%"}
          url={`${data.content.link}`}
        /> : <div className="w-full h-full bg-neutral-500 text-white flex justify-center items-center">
        <div>The video is currently unavailable.
        Please check the URL or try again later</div>
      </div>}
      </div>
      <div className="text-xs text-neutral-400 w-10/12 lg:w-9/12 font-normal">
        <div className="w-1/3" dangerouslySetInnerHTML={{__html: `${data.content.text}`}}></div>
      </div>
    </div>
  );
};
const LineTypeContainer = () => {
  return (
    <div
      style={{ backgroundColor: `${TOA_COLORS["blue"]}` }}
      className="h-[2px] w-full my-20"
    ></div>
  );
};
const ImageTypeContainer = ({ data, images }) => {
  const [currentImageMeta, setCurrentImageMeta] = useState(null)
  useEffect(() => {
  
    const result = images.find((value) => {
      if(value.uuid === String(data.content.image_content2[0])){
        return value
      }
    })


   
    setCurrentImageMeta(result)

  },[images])

  if(data.content.for_logo &&data.content.for_logo === "true"){
    return <div className="flex justify-center py-2">
      <div className="flex flex-wrap w-full lg:w-9/12">
        <div className="w-full relative">
          <Image
            src={`${process.env.KB_API_FILE}/${yaml.load(data.content.image_content2[0])}`}
            alt=""
            width={1920}
            height={1080}
            layout="responsive"
            objectFit="contain"
          />
        </div>
      </div>
    </div> 
  }


  return (
    
    <div className="flex flex-col items-center gap-2 py-4">
      {(data.content.image_content2[0] && currentImageMeta) && <div className="w-10/12 lg:w-9/12">
        <div
          style={{
            backgroundImage: `url(${process.env.KB_API_FILE}/${yaml.load(data.content.image_content2[0])})`,
            backgroundPosition: currentImageMeta.content?.focus ? `${currentImageMeta.content?.focus}` : `${50}% ${50}%`,
          }}
          className="flex w-full aspect-video rounded-xl bg-no-repeat bg-cover bg-center bg-white"
        />
        {Boolean(currentImageMeta) && <div className="mt-2 text-xs text-neutral-500 flex gap-2 font-normal">
          {currentImageMeta.content?.caption && <div>{currentImageMeta.content.caption}</div>}
          {(currentImageMeta.content?.caption && currentImageMeta.content?.copyright) && <div>{"|"}</div>}
          {currentImageMeta.content?.copyright && <div>&copy; {currentImageMeta.content.copyright}</div>}
          </div>}
      </div>}
    </div>
  );
};
const FootnoteTypeContainer = ({ data }) => {
  const md = new MarkdownIt({html: true});
  return (
    <div className="w-full flex justify-center py-2 pb-16">
      <CenterWrapper>
        <div className="font-headermsemibold w-1/2 text-xs lg:text-sm leading-tight" dangerouslySetInnerHTML={{__html: `${md.render(data.content["footnote_text"])}`}}>
         
        </div>
      </CenterWrapper>
    </div>
  );
};
const IrritatedTextTypeContainer = ({ data }) => {
  const md = new MarkdownIt({html: true});
  const [closeText, setCloseText] = useState(true);
  const toggleCloseText = () => {
    setCloseText((prev) => !prev);
  };
  return (
    <div className="w-full flex justify-center font-normal text-base md:text-lg lg:text-xl py-4">
      <div className="w-full lg:w-10/12">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-4">
              <div
                style={{ textDecorationColor: `${TOA_COLORS["blue"]}` }}
                className={`${
                  closeText ? "line-through" : "no-underline"
                } decoration-4 whitespace-break-spaces`}
                dangerouslySetInnerHTML={{__html: `${md.render(data.content["irritated_text"])}`}}
              >
               
              </div>
              <div className="flex flex-col gap-6">
                <div className="text-white  w-full">
                  <SourceText>
                    {data.content["text_source"]}
                  </SourceText>
                </div>
                <div
                  style={{ backgroundColor: `${TOA_COLORS["blue"]}` }}
                  className="w-full h-[1px]"
                ></div>
                <div
                  onClick={toggleCloseText}
                  className="select-none cursor-pointer flex gap-4 items-center"
                >
                  <div style={{ color: `${TOA_COLORS["blue"]}` }}>
                    {closeText && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                    {!closeText && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="text-sm font-normal">
                    This text is irritated. Click the Icon to read it withouth
                    Irritation
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${md.render(data.content["my_text"])}`}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
const IrritatedQuoteTypeContainer = ({ data }) => {
  const md = new MarkdownIt({html: true});
  const [closeText, setCloseText] = useState(true);
  const toggleCloseText = () => {
    setCloseText((prev) => !prev);
  };
  return (
    <div className="w-full flex justify-center py-20">
      <CenterWrapper align="right">
        <div className="flex flex-col gap-2 w-2/3">
          <div
            style={{ color: `${TOA_COLORS["blue"]}` }}
            className={`text-xl lg:text-3xl font-headersanssemiitalic ${
              closeText ? "line-through" : "no-underline"
            } decoration-4`}
          >
            {`>>`}
            <p dangerouslySetInnerHTML={{__html: `${md.render(data.content["irritated_text"])}`}}></p>
            {`<<`}
          </div>
          <div className="flex flex-col gap-4">
            
            <span className="text-white flex w-fit">
              <SourceText>
              {data.content["text_source"]}
              </SourceText>
            </span>
            <div
              style={{ backgroundColor: `${TOA_COLORS["blue"]}` }}
              className="w-full h-[1px]"
            ></div>
            <div
              onClick={toggleCloseText}
              className="select-none cursor-pointer flex gap-4 items-center"
            >
              <div style={{ color: `${TOA_COLORS["blue"]}` }}>
                {closeText && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
                {!closeText && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </div>
              <div className="text-sm">
                This text is irritated. Click the Icon to read it withouth
                Irritation
              </div>
            </div>
          </div>
        </div>
      </CenterWrapper>
    </div>
  );
};
const EVALinkTypeContainer = ({ data }) => {

  return (
    <div className="flex flex-col items-center justify-center py-28">
      <div className="flex flex-col items-center justify-center w-10/12 lg:w-9/12">
      <a
          target="_blank"
          href={`${data.content["special_link"]}`}
          className="flex flex-col items-center justify-center w-full"
        >
      <Image
        src={"/assets/eva-link-block/eva-link_top.svg"}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }} // optional
        alt="top"
      />
      <div className="w-full lg:w-10/12 flex">
        <div
          className="flex justify-center px-4 py-3 text-lg lg:text-xl font-headerh1 bg-black text-white w-full rounded-lg break-words"
        >
          {data.content["link_text"]}
        </div>
      </div>
      <Image
        src={"/assets/eva-link-block/eva-link_bottom.svg"}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }} // optional
        alt="top"
      />
      </a>
      </div>
    </div>
  );
};
const ImageGalleryTypeContainer = ({ data, images }) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [captionsImage, setCaptionsImage] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const swiper = useSwiper();
  useEffect(() => {
    
    
    const newData = data.content["image_content2"].map((value) => {
      const result = images.find((v) => v.uuid === value)
      return result;
    })
   
    setCaptionsImage(newData)
 
  },[images])
  useEffect(() => {
    if(swiperRef){
      swiperRef.on("transitionEnd", (e) => setCurrentIndex(e.activeIndex))
    }
  },[swiperRef])

  const goToNextSlide = () => {
    if (swiperRef) {
      swiperRef.slideNext(); // Navigate to the next slide
      
    }
  };
  const goToPrevSlide = () => {
    if (swiperRef) {
      swiperRef.slidePrev(); // Navigate to the next slide
      
    }
  };



  
  return (
    <div className="w-full flex justify-center overflow-hidden py-8">
      {(captionsImage && captionsImage.length > 0) && <div className="w-8/12 lg:w-9/12 ">
        <div className="w-full bg-white flex flex-col cursor-grab">
          
          <Swiper 
            className="w-full h-[400px] lg:h-[600px] px-10 overflow-hidden"
            grabCursor={true}
            spaceBetween={0}
            slidesPerView={1}
            // pagination={true}
            pagination={false}
            loop={false}
            effect={'cards'}
            modules={[Pagination, Navigation, EffectCards]}
            navigation={false}
            // lazy={true}  
            // cssMode={true}
            onSwiper={(swiper) => setSwiperRef(swiper)}
            // onSlideChange={() => 
          >
            {
              data.content.image_content2.map((val, idx) => {
                return <SwiperSlide key={idx} className="rounded-xl overflow-hidden">
                  
                  {/* <div style={{backgroundImage: `url(${process.env.KB_API_FILE}/${val.slice(7)})`}} className="w-full h-full bg-no-repeat bg-center bg-cover relative">
                 
                  </div> */}
                  <div className="w-full h-full bg-no-repeat bg-center bg-cover relative">
                  <Image
                        src={`${process.env.KB_API_FILE}/${val.slice(7)}`}
                        alt=""
                        fill
                        quality={60}
                        // placeholder="blur" 
                        // blurDataURL={getRandomAniPlaceHolderUrld}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                        style={{objectFit:"cover"}}
                       
                        />
                  </div>
                </SwiperSlide>
              })
            }
          </Swiper> 
          {(captionsImage && captionsImage.length) > 0 && <div className="mt-2 text-xs text-neutral-500 flex gap-2 font-normal">
            {captionsImage[currentIndex]?.content.caption && <div>{captionsImage[currentIndex].content.caption}</div>}
            {(captionsImage[currentIndex]?.content.caption && captionsImage[currentIndex].content.copyright) && <div>{"|"}</div>}
            {captionsImage[currentIndex]?.content.copyright && <div>&copy; {captionsImage[currentIndex].content.copyright}</div>}
          </div>}
         
        </div>
        <div className="w-full flex justify-center items-center gap-4">
          <div onClick={goToPrevSlide} className={`w-9 h-9 rounded-lg border-2 border-toa-blue flex justify-center items-center select-none cursor-pointer transition-all ${currentIndex !== 0 ? "pointer-events-auto bg-white hover:bg-toa-blue hover:text-white" : "pointer-events-none bg-none border-none"}`}>{currentIndex !== 0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            }
          </div>
          <div onClick={goToNextSlide} className={`w-9 h-9 rounded-lg border-2 border-toa-blue flex justify-center items-center select-none cursor-pointer transition-all ${currentIndex < (captionsImage.length - 1) ? "pointer-events-auto bg-white hover:bg-toa-blue hover:text-white" : "pointer-events-none bg-none border-none"}`}>{currentIndex < (captionsImage.length - 1) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                  }             
          </div>
        </div>
      </div>}
    </div>
  );
};

const FileDownloadTypeContainer = ({ data }) => {
  // {data.content["pdf_file"][0]}
  const md = new MarkdownIt({html: true});
  return (
    <div className="flex justify-center py-16">
      <div className="w-full lg:w-10/12">
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex justify-center">
            <a
              target="_blank"
              href={`${process.env.KB_API_FILE}/${data.content[
                "pdf_file"
              ][0].slice(7)}`}
              download={`${process.env.KB_API_FILE}/${data.content[
                "pdf_file"
              ][0].slice(7)}`}
              className="cursor-pointer w-1/2 aspect-square rounded-full bg-[#84A6FF] text-[#84A6FF] bg-opacity-20 flex justify-center items-center lg:hover:scale-105 lg:hover:bg-toa-blue lg:hover:text-white transition-all "
            >
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
                  />
                </svg>
              </div>
            </a>
          </div>
          <div className="flex-1 font-normal text-base md:text-lg lg:text-xl whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${md.render(data.content["file_text"])}`}}></div>
        </div>
      </div>
    </div>
  );
};

const ChatBoxTypeWrapper = ({data}) => {
  const md = new MarkdownIt({html: true});
  const QuestionWapper = ({children}) => {
    return <div className="w-full lg:w-1/2 lg:translate-x-1/3 font-headermedium">
        {children}
    </div>
  }
  const AnswerWrapper = ({children}) => {
    return <div className="flex flex-col items-start w-full lg:w-1/2 lg:-translate-x-1/3">
        {children}
    </div>
  }
  const MessageBox = ({message, answer=false}) => {
    return <div className={`border ${answer ? "border-toa-blue" : "border-black"} rounded-lg p-4 w-full whitespace-break-spaces`} dangerouslySetInnerHTML={{__html: `${md.render(message)}`}}></div>
  }

  const TextSourceBox = ({message}) => {
    return<span className="text-white flex w-full bg-toa-blue"><SourceText>{message}</SourceText></span>
  }

  const ChatLine = ({answerGab=false}) => {
    return <div className={`flex justify-center w-full ${answerGab ? "lg:translate-x-1/3" : "lg:w-1/2 translate-x-0"}`}>
    <div className={`w-[1px] ${answerGab ? "h-[8px]" : "h-[32px]"} bg-toa-blue `}></div>
  </div>
  }

  return <div className="w-full relative text-base md:text-lg lg:text-xl font-normal">
      {
        data.content.chat_structure.length > 0 ? <div className="w-full flex flex-col bg-white border-t border-b border-toa-blue px-4">
          {
            data.content.chat_structure.map((v,idx) => {
              return <div key={idx} className="flex flex-col items-center w-full">
                <ChatLine />
                <QuestionWapper>
                  <MessageBox message={v.question} />
                </QuestionWapper>
                <ChatLine />
                <AnswerWrapper >
                  <MessageBox message={v.answer} answer={true} />
                  <ChatLine answerGab={true} />
                  <TextSourceBox message={v.answer_text_source} />
                </AnswerWrapper>
                <ChatLine />
              </div>
            })
          }
        </div> : <div>Write Contents</div>
      }
  </div>
} 

const XrayTypeText = ({data}) => {
  let pos1 = 0;
  let pos2 = 0;

  const WrapperBox = useRef(null);
  const XrayCursor = useRef(null);
  const XrayBox = useRef(null);
  const md = new MarkdownIt({html: true});
  useEffect(() => {
    const handleMouseMove = (e2) => {
      e2.preventDefault();
      const clientY = e2.type === "touchmove" ? e2.touches[0].clientY : e2.clientY

      pos2 = pos1 - clientY; // Calculate the difference
      pos1 = clientY;

      const cursorTop = XrayCursor.current.offsetTop - pos2;
      const maxHeight = WrapperBox.current.clientHeight;

      // Clamp cursor position within the wrapper box
      const clampedTop = Math.max(0, Math.min(cursorTop, maxHeight));

      // Update XrayBox height and XrayCursor position
      XrayBox.current.style.height = `${maxHeight - clampedTop}px`;
      XrayCursor.current.style.top = `${clampedTop}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
      // document.onmousemove = null;
      // document.onmouseup = null;  // Clear the event listener
    };

    const handleMouseDown = (e) => {
      e.preventDefault();
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      pos1 = clientY;

      // Add mousemove and mouseup event listeners
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("touchend", handleMouseUp);
    };

    // Ensure refs are available and bind the mousedown event
    if (XrayCursor.current) {
      XrayCursor.current.addEventListener("mousedown", handleMouseDown);
      XrayCursor.current.addEventListener("touchstart", handleMouseDown);
    }

    // Cleanup event listeners when component unmounts
    return () => {
      if (XrayCursor.current) {
        XrayCursor.current.removeEventListener("mousedown", handleMouseDown);
        XrayCursor.current.removeEventListener("touchstart", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  
  return <div className="w-full flex justify-center text-base md:text-lg lg:text-xl py-8">
    <CenterWrapper>
      <div ref={WrapperBox} className="w-full flex gap-2 h-fit">
        <div className="flex items-start font-bold text-toa-blue">
          <div className="-translate-y-1/2">
            {`>>`}
          </div>
        </div>
        <div className="h-full break-all relative">
          <p className="w-full break-words font-normal white whitespace-break-spaces" dangerouslySetInnerHTML={{__html: `${md.render(data.content.my_text)}`}}>
           
          </p>
          <div ref={XrayBox} className="absolute w-full h-full bottom-0 left-0 bg-white bg-opacity-90 border-t-2 border-toa-blue flex justify-center">

          </div>
          <div className="absolute w-full h-0 top-0 left-0 flex justify-center ">
            <div ref={XrayCursor} className="w-12 h-12 bg-toa-blue flex -translate-y-1/2 cursor-pointer rounded-full justify-center items-center text-white relative group select-none">
            <div className="absolute top-1/2 left-1/2 translate-x-[0px] opacity-0 select-none pointer-events-none group-hover:opacity-100 group-hover:translate-x-[30px] -translate-y-1/2 bg-neutral-700 px-3 py-2 rounded-xl transition-all duration-300 text-[11px] leading-tight break-words w-[150px] z-[50]">Drag up or down, and release to move the button vertically</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
              <div className="flex absolute top-0 left-1/2 -translate-x-1/2 translate-y-[calc(58px)] w-[250px]  bg-opacity-100 select-none pointer-events-none "><SourceText>{data.content.text_source}</SourceText></div>
            </div>
          </div>
        </div>
        <div className="flex items-end font-bold text-toa-blue">
        <div className="translate-y-1/2">
          {`<<`}
        </div>
      </div>
      </div>
    </CenterWrapper>
</div>
}


const AudioTypeText = ({data}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [getDuration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentVolume, setCurrentVolume] = useState(null)
  const [toggleSound, setToggleSound] = useState(false)
  const audioRef = useRef(null);

  // useEffect(() => {
  //   if(audioRef){
  //     const audioBox = audioRef.current.audioEl.current;
  //     
  //     if(audioBox){
  //       setTimeout(() => {
  //         
  //         if(audioBox.duration){
  //           setDuration(audioBox.duration)
  //         }
  //       }, 300)
  //     }
  //   }
  // },[])

  useEffect(() => {
    
    if(isPlaying){
      if(audioRef){
        const audioBox = audioRef.current.audioEl.current;
        if(audioBox){
          const onTimeUpdate = () => {
        
            // 
            setCurrentTime(audioBox.currentTime)
            if(audioBox.ended){
              // video ended
              // - update play icon
              // - update progress bar
              
              setIsPlaying(false)
              setCurrentTime(0)
           }
          }
          audioBox.ontimeupdate = onTimeUpdate

          return () => {
            audioBox.ontimeupdate = null
          }
        }
      }
    }
  },[isPlaying])

  const onLoaded = (e) => {
 
    setCurrentVolume(e.currentTarget.volume)
    setDuration(e.currentTarget.duration)
  }
  const onClickProgressBar = (e) => {
    const newTime = e.target.value;
    const audioBox = audioRef.current.audioEl.current;
    
    if (audioBox) {
      audioBox.currentTime = newTime;
      // 
      setCurrentTime(newTime); // Ensure the UI reflects the new time
    }
 }
  const onClickVolumeBar = (e) => {
    let newVolume = parseFloat(e.target.value);
    
    // 값이 0과 1 사이인지 확인
    if (newVolume < 0) newVolume = 0;
    if (newVolume > 1) newVolume = 1;

    const audioBox = audioRef.current.audioEl.current;

    if (audioBox) {
        audioBox.volume = newVolume; // 볼륨 설정
        setCurrentVolume(newVolume); // UI 업데이트를 위한 상태 설정
    }
 }

  const onClick = () => {
    if(audioRef){
      const audioBox = audioRef.current.audioEl.current;
      if(audioBox){
        if(audioBox.paused){
          
          audioBox.play()
          setIsPlaying(true)
        }else{
          audioBox.pause()
          setIsPlaying(false)
        }
        
        
      }
    }
  }
  return (
    <div className="w-full flex flex-col justify-center items-center text-base md:text-lg lg:text-xl py-8">
      <ReactAudioPlayer ref={audioRef} src={`${process.env.KB_API_FILE}/${String(yaml.load(data.content.audio_contents[0]))}`} onLoadedMetadata={(e) => onLoaded(e)} />
      {(audioRef && currentVolume) && <div className="flex items-center w-10/12 md:min-w-[500px] md:w-fit px-2 py-2 rounded-lg border-toa-blue bg-white border-2 gap-1">
        <div onClick={onClick} className="min-w-10 w-10 h-10 flex justify-center items-center rounded-full  text-toa-blue cursor-pointer hover:bg-toa-blue hover:text-white transition-all">
          {!isPlaying && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>}
          {isPlaying && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>}
        </div>
        <div className="text-xs w-full flex items-center gap-2 pr-3">
          <div>{formatTime(currentTime)}</div>
          <div className="w-full h-[4px] bg-toa-blue ">
               <div className="w-full h-[4px] rounded-full relative">
                  <input onChange={(e) => onClickProgressBar(e)} step={0.01} min={0} max={getDuration} defaultValue={0} type="range" className="w-full bg-toa-blue range-custom" />
                  <progress value={currentTime} max={getDuration} className="absolute bg-toa-blue w-full h-full select-none pointer-events-none"></progress>
              </div>
          </div>
          <div>{formatTime(getDuration)}</div>
        </div>
        {/* <div onClick={() => setToggleSound(true)} onMouseLeave={() => setToggleSound(false)} onMouseEnter={() => setToggleSound(true)} className="flex items-center gap-1 pl-2">
          <div className={`${toggleSound ? "w-20" : "w-0"} h-2 bg-toa-blue overflow-hidden transition-all duration-150 flex justify-center`}>
              <div className="w-full h-[8px] rounded-full relative">
                  <input onChange={(e) => onClickVolumeBar(e)} step={0.01} min={0} max={1} defaultValue={0} type="range" className="w-full bg-toa-blue range-custom" />
                  <progress value={currentVolume} max={1} className="absolute bg-toa-blue w-full h-full select-none pointer-events-none"></progress>
              </div>
          </div>
          <div className="w-10 aspect-square flex justify-center items-center text-toa-blue cursor-pointer hover:bg-toa-blue transition-all hover:text-white rounded-full">
            {<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
              }
          </div>
         
        </div> */}
      </div>}
      <div className="mt-2 text-xs text-neutral-500 flex font-normal">{data.content.captions}</div>
    </div>
  )
}
const BlockWrapper = ({ content, playgroundTermData=[], images=[] }) => {
  const [getTypeContainer, setTypeContainer] = useState(null);
  useEffect(() => {
 
    switch (content.type) {
      case "obj":
        setTypeContainer(
          <ObjTypeContainer
            data={content}
            playgroundTermData={playgroundTermData}
          />
        );
        break;
      case "heading":
        setTypeContainer(<HeadingTypeContainer data={content} />);
        break;
      case "text":
        setTypeContainer(
          <TextTypeContainer
            data={content}
            playgroundTermData={playgroundTermData}
          />
        );
        break;
      case "list":
        setTypeContainer(<ListTypeContainer data={content} />);
        break;
      case "quote":
        setTypeContainer(<QuoteTypeContainer data={content} />);
        break;
      case "line":
        setTypeContainer(<LineTypeContainer />);
        break;
      case "cimg":
        setTypeContainer(<ImageTypeContainer data={content} images={images} />);
        break;
      case "videourl":
        setTypeContainer(<VideoTypeContainer data={content} />);
        break;
      case "footnote":
        setTypeContainer(<FootnoteTypeContainer data={content} />);
        break;
      case "irritatedtext":
        setTypeContainer(<IrritatedTextTypeContainer data={content} />);
        break;
      case "irritatedquote":
        setTypeContainer(<IrritatedQuoteTypeContainer data={content} />);
        break;
      case "speciallink":
        // EVA Link
        setTypeContainer(<EVALinkTypeContainer data={content} />);
        break;
      case "galleryimg":
        setTypeContainer(<ImageGalleryTypeContainer data={content} images={images} />);
        break;
      case "pdfdownload":
        setTypeContainer(<FileDownloadTypeContainer data={content} />);
        break;
      case "chatbox":
        setTypeContainer(<ChatBoxTypeWrapper data={content} />);
        break;
      case "xraytext":
        setTypeContainer(<XrayTypeText data={content} />);
        break;
      case "audio":
        setTypeContainer(<AudioTypeText data={content} />);
        break;
      default:
        setTypeContainer(
          <div className="text-red-400 font-bold border-2 p-4 border-red-400 rounded-xl">
            Block Error
          </div>
        );
    }
  }, []);
  return (
    <DContainer
      color={content.type === "obj" ? "blue" : "white"}
      paddingOn={true}
      block={true}
    >
      <span className="text-[#414B5A]">{getTypeContainer}</span>
    </DContainer>
  );
};

export default BlockWrapper;
