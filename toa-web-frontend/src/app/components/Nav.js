"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCookieValue } from "../utils/hooks/cookies";
import LangBtn from "./nav_elements/LangBtn";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { BUTTONLIST } from "../constant/kirbyurl";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { globalCurrentUrl, globalDetectNavDirection, globalHeadingFontSize, globalTerm, ttAnimationTrigger } from "../utils/recoil/state";
import Image from "next/image";
import h1Icon from "/public/assets/icons/complex-view-icon.svg"
import h3Icon from "/public/assets/icons/easy-view-icon.svg"
import h1Logo from "/public/assets/logos/logo-collapsed-menu.svg"
import h3Logo from "/public/assets/logos/logo-full-menu.svg"

gsap.registerPlugin(ScrollTrigger);
const NavLeftBtn = ({ children, clickEvent, mobile = false, noPadding=false }) => {
  return (
    <div
      onClick={clickEvent}
      className={`${noPadding ? "px-0" : "px-4"} h-full flex items-center cursor-pointer select-none ${
        mobile ? "border-none" : "border-r border-white"
      }`}
    >
      {children}
    </div>
  );
};

const NavLeftWrapper = ({ children }) => {
  return (
    <div className="flex h-full items-center justify-start">{children}</div>
  );
};

const NavRightWrapper = ({ children }) => {
  return (
    <div className="flex h-full items-center justify-start border-l border-white">
      {children}
    </div>
  );
};

const MenuItem = ({ text, path = "/", closeMenu, sub=false, ready=true, external=false }) => {
  const router = useRouter();
  const onPush = (pathText) => {
    if(external){
      const link = document.createElement('a'); // <a> 태그 생성
      link.href = `https://${pathText}`; // 경로 설정
      link.target = '_blank'; // 새로운 탭에서 열기
      link.rel = 'noopener noreferrer'; // 보안 설정
      document.body.appendChild(link); // <a> 태그를 DOM에 추가
      link.click(); // 링크 클릭 실행
      document.body.removeChild(link); // <a> 태그 제거
    }else{

      router.push(pathText);
      closeMenu();
    }
  };
  return (
    <div
      onClick={() => onPush(path)}
      className={`flex ${!ready && "pointer-events-none text-neutral-400"} ${sub ? " justify-start items-center text-xs lg:text-xl py-2 px-8 lg:p-3 lg:px-8 text-center border-r last:border-0 border-neutral-200" : " text-lg lg:text-2xl px-4 py-2 lg:p-3"}  w-full active:bg-[#84A6FF] active:text-white lg:hover:bg-[#84A6FF] lg:hover:text-white transition-all duration-150 cursor-pointer select-none font-normal`}
    >
      {text}{!ready && " (🚧 Launching Soon)"}
    </div>
  );
};
const MenuItemSubContainer = ({openSubMenu,closeSubMenu, text, closeMenu }) => {
  const newClose = () => {
    closeSubMenu(false)
    closeMenu();
  }
  
  return (
    <div>
      <div
        onClick={() => closeSubMenu(prev => !prev)}
         className="px-4 py-2 font-normal lg:p-3 text-lg lg:text-2xl w-full active:bg-[#84A6FF] active:text-white lg:hover:bg-[#84A6FF] lg:hover:text-white transition-all duration-150 cursor-pointer select-none flex items-center gap-2"
      >
        <div>{text}</div>
        <div>
          {!openSubMenu && <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>}
          {openSubMenu && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>}
        </div>
      </div>
      {openSubMenu && <div className="flex flex-col">
          {
            BUTTONLIST.map((val, idx) => {
              return <MenuItem key={idx} closeMenu={newClose} path={`/themes/${val.slug}`} text={val.name} sub={true} />
            })
          }
          
        
      </div>}
    </div>
  );
};
const MenuLearnMoreContainer = ({openLearnMore, setOpenLearnMore, text, closeMenu }) => {
  const newClose = () => {
    setOpenLearnMore(false)
    closeMenu();
  }
  
  return (
    <div>
      <div
        onClick={() => setOpenLearnMore(prev => !prev)}
         className="px-4 py-2 font-normal lg:p-3 text-lg lg:text-2xl w-full active:bg-[#84A6FF] active:text-white lg:hover:bg-[#84A6FF] lg:hover:text-white transition-all duration-150 cursor-pointer select-none flex items-center gap-2"
      >
        <div>{text}</div>
        <div>
          {!openLearnMore && <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>}
          {openLearnMore && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>}
        </div>
      </div>
      {openLearnMore && <div className="flex flex-col">
        <MenuItem closeMenu={newClose} path={`/about`} text={"About"} sub={true} />
        <MenuItem closeMenu={newClose} path={`/info/documentation`} text={"Documentation"} sub={true} />
        <MenuItem closeMenu={newClose} path={`eva.talkingobjectsarchive.org`} text={"Experimental Video Archive"} external={true} sub={true} />
      </div>}
    </div>
  );
};
const MenuListWrapper = ({openLearnMore, setOpenLearnMore, openSubMenu, closeSubMenu, isOpened, closeMenu, currentLang }) => {
  const [getGlobalHeadingFontSize,setGlobalHeadingFontSize] = useRecoilState(globalHeadingFontSize)
  const setTtAnimationTigger = useSetRecoilState(ttAnimationTrigger)
  const router = useRouter()
  const onClickLogo = () => {
    router.push("/")
    closeMenu()
  }
  const changeHeading = (heading) => {
    setTtAnimationTigger(true)
    setGlobalHeadingFontSize(heading)
    closeMenu()
  }
  return (
    <>
      <div
        onClick={closeMenu}
        className={`select-none  fixed top-0 left-0 w-screen h-[100svh] lg:h-screen z-[200] bg-black transition-all duration-500 ${
          isOpened
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <div
        className={`fixed top-0 left-0 w-screen h-[100svh] lg:h-4/5 flex flex-col z-[203] bg-[#bfcfff] overflow-hidden ${
          isOpened ? "translate-y-0" : "-translate-y-full"
        } transition-all duration-500`}
      >
        <div className="flex w-full justify-between items-center p-4">
          <div onClick={() => onClickLogo()} className="select-none w-full max-w-[200px] cursor-pointer">
            <Image priority alt="Logo" src={h3Logo} />
          </div>
          <div className="cursor-pointer" onClick={closeMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-10 lg:size-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-scroll py-4">
        <MenuItem closeMenu={closeMenu} path={"/"} text={"Home"} />
        <MenuItem closeMenu={closeMenu} path={"/explore"} text={"Explore"} />
        <MenuItemSubContainer
          openSubMenu={openSubMenu}
          closeSubMenu={closeSubMenu}
          closeMenu={closeMenu}
          text={"Core Themes"}
        />
        <MenuItem
          closeMenu={closeMenu}
          path={"/playground"}
          text={"Playground"}
        />
        <MenuItem closeMenu={closeMenu} path={"/glossary"} text={"Glossary"} />
        <MenuItem closeMenu={closeMenu} path={"/team"} text={"Team"} />
        <MenuItem closeMenu={closeMenu} path={"/contributors"} text={"Contributors"} />
        <MenuItem closeMenu={closeMenu} path={"/manifesto"} text={"Manifesto"} />
        {/* <MenuItem closeMenu={closeMenu} path={"/about"} text={"About"} /> */}
        <MenuLearnMoreContainer
          openLearnMore={openLearnMore}
          setOpenLearnMore={setOpenLearnMore}
          closeMenu={closeMenu}
          text={"Learn More"}
        />
       
        <div className="flex lg:hidden px-4 py-2 border-t">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full text-center text-xl">Languages</div>
            <div className="flex w-full gap-4">
              <LangBtn title={"EN"} lang={"en"} currentLang={currentLang} />
              <LangBtn title={"DE"} lang={"de"} currentLang={currentLang} />
              <LangBtn title={"FR"} lang={"fr"} currentLang={currentLang} />
            </div>
          </div>
        </div>
        <div className="flex lg:hidden px-4 py-2 pt-8">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full text-center text-xl">Heading</div>
            <div className="flex w-full gap-4">
               <div onClick={() => changeHeading(true)} className={`text-toa-black select-none  ${getGlobalHeadingFontSize ? "opacity-100 shadow-toa-blue": "opacity-50"} w-full flex justify-center px-4 py-4 lg:hover:opacity-100 cursor-pointer transition-all rounded-xl shadow-md drop-shadow-md lg:drop-shadow-none lg:shadow-none lg:rounded-none`}>
               { <Image
              priority
              src={h1Icon}
              alt="Change to H1 Font Icon"
            />
                }
                
                </div>
               <div onClick={() => changeHeading(false)} className={`text-toa-black select-none  ${!getGlobalHeadingFontSize ? "opacity-100 shadow-toa-blue": "opacity-50"} w-full flex justify-center px-4 py-4 lg:hover:opacity-100 cursor-pointer transition-all rounded-xl shadow-md drop-shadow-md lg:drop-shadow-none lg:shadow-none lg:rounded-none`}>
             
                  {<Image
              priority
              src={h3Icon}
              alt="Change to H1 Font Icon"
            />

                  }
                </div>
            </div>
          </div>
        </div>
        </div>
        
      </div>
    </>
  );
};

const Nav = ({ data }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [currentLang, setCurrentLang] = useState("");
  const router = useRouter();
  const [showNav, setShowNav] = useState(false);
  const [showCoreNav, setShowCoreNav] = useState(false);
  const coreNavRef = useRef(null);
  const gcurrentURL = useRecoilValue(globalCurrentUrl);
  const [currentURL, setCurrentURL] = useState("");
  const [getGlobalTerm, setGlobalTerm] = useRecoilState(globalTerm);
  const [showNavGlobal, setShowNavGlobal] = useRecoilState(globalDetectNavDirection);
  const params = useParams();
  const getPathname = usePathname();
  const [openSubMenu, closeSubMenu] = useState(false)
  const [getGlobalHeadingFontSize,setGlobalHeadingFontSize] = useRecoilState(globalHeadingFontSize)
  const setTtAnimationTigger = useSetRecoilState(ttAnimationTrigger)
  const [openLearnMore, setOpenLearnMore] = useState(false)


  const changeHeadingText = () => {
    setGlobalHeadingFontSize((prev) => !prev)
    setTtAnimationTigger(true)
  }
  useEffect(() => {
    setCurrentURL(getPathname);
    // cancel globalTerm
    setGlobalTerm({
      on: false,
      word: getGlobalTerm.word,
    });
  }, [gcurrentURL]);

  useEffect(() => {
    console.log(`%c${data["nav_title"]}`, "font-family:monospace; font-size:40px; color:black; background:white; padding:10px; font-weight:bold; text-transform: uppercase;")
  },[])

  useEffect(() => {
    const scrollheader = document.querySelector(".scrollheader");

    let event;

    event = ScrollTrigger.create({
      trigger: "body",
      onUpdate: (self) => {
        if (scrollheader && coreNavRef) {
          if (self.scroll() > scrollheader.clientHeight) {
            // const coreNavWidth = coreNavRef.current.clientWidth;
            setShowCoreNav(true);
          } else {
            setShowCoreNav(false);
          }
        }
        if (self.direction !== self.prevDirection) {
          // Detect Scroll Movement
          if (self.direction < 0) {
            // Hoch Scroll
            setShowNav(true);
            setShowNavGlobal(true)
          } else {
            setShowNav(false);
            setShowNavGlobal(false)
          }
          self.prevDirection = self.direction;
        }
      },
    });
    // Cleanup function to remove the ScrollTrigger event
    return () => {
      if (event) {
        event.kill(); // Remove the ScrollTrigger event
      }
    };
  }, [gcurrentURL]);

  useEffect(() => {
    const lang = getCookieValue("language");
    setCurrentLang(lang);
  }, []);

  const moveToHome = () => {
    router.push("/");
  };
  const openMenu = () => {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
    setIsOpened(true);
  };
  const closeMenu = () => {
    const body = document.querySelector("body");
    body.style.overflow = "auto";
    setIsOpened(false);
    closeSubMenu(false)
    setOpenLearnMore(false)
  };

  const onPush = (path) => {
    router.push(`/themes/${path}`)
  }

  const [mobileNavClicked, setMobileNavClicked] = useState("")
  const onPushMobile = (path) => {
    // router.push(`/themes/${path}`)
    if(path === mobileNavClicked){
      router.push(`/themes/${path}`)
    }
    setMobileNavClicked(path)
  }


  return (
    <>
      <MenuListWrapper
        isOpened={isOpened}
        openLearnMore={openLearnMore}
        setOpenLearnMore={setOpenLearnMore}
        closeMenu={closeMenu}
        currentLang={currentLang}
        openSubMenu={openSubMenu}
        closeSubMenu={closeSubMenu}
      />
      {(currentURL === "/" 
      // || currentURL.includes("themes")
    ) && (
        <div
          ref={coreNavRef}
          
          className={`hidden lg:fixed ${
            true ? "top-[56px]" : "top-[56px] lg:top-0"
          } right-0 z-[200] hidden lg:flex flex-wrap w-fit h-20 items-center gap-4 transition-all duration-500 px-4 ${
            showCoreNav ? "translate-x-0" : "translate-x-full"
          } pointer-events-none`}
        >
          {BUTTONLIST.map((val, idx) => {
            if (val.slug !== params.slug) {
              return (
                <div
                  key={idx}
                  onClick={() => onPush(val.slug)}
                  style={{ backgroundColor: val.color }}
                  className="select-none corenavitem w-fit h-14 rounded-xl pointer-events-auto group px-4 flex items-center shadow-md drop-shadow-md cursor-pointer font-headerh1 text-sm"
                >
                  <div className="text-white">{val.name}</div>
                </div>
              );
            }
          })}
        </div>
      )}
      {/* Mobile Coretheme Nav bar */}
      {(currentURL === "/" 
      // || currentURL.includes("themes")
    ) && (
        <div
          ref={coreNavRef}
         
          className={`fixed ${
            true ? "top-[45px]" : "top-0"
          }  right-0 z-[200] flex lg:hidden w-screen h-fit items-center transition-all duration-500 ${
            showCoreNav ? "translate-x-0" : "translate-x-full"
          } pointer-events-none shadow-lg drop-shadow-lg`}
        >
          {BUTTONLIST.map((val, idx) => {
            if (val.slug !== params.slug) {
              return (
                <div
                  key={idx}
                  onClick={() => onPushMobile(val.slug)}
                  style={{ backgroundColor: val.color }}
                  className={`corenavitem ${mobileNavClicked === val.slug ? "flex-[5]" : "flex-1"} h-12 pointer-events-auto group px-4 flex items-center justify-center transition-all duration-300 text-white text-xs font-medium overflow-hidden whitespace-nowrap select-none`}
                >{mobileNavClicked === val.slug ? val.name : `${val.name.slice(0, 1)}...`}</div>
              );
            }
          })}
        </div>
      )}
      {/* <div
        ref={coreNavRef}
        className={`fixed bottom-[0px] right-0 z-[200] flex lg:hidden w-screen h-fit items-center transition-all duration-500 ${
          showCoreNav ? "translate-y-0" : "translate-y-full"
        } pointer-events-none`}
      >
        {BUTTONLIST.map((val, idx) => {
          if (val.slug !== params.slug) {
            return (
              <div
                key={idx}
                onClick={() => 
                style={{ backgroundColor: val.color }}
                className="corenavitem w-full h-14 pointer-events-auto group px-4 flex items-center justify-center"
              >
               
              </div>
            );
          }
        })}
      </div> */}
      <div
        id={"navContainer"}
        className={`fixed top-0 left-0 text-sm ${
          false ? "-translate-y-full" : "translate-y-0"
        } hidden lg:flex items-center font-normal justify-between text-white bg-toa-black border-b-[0.5px] border-white w-screen h-[56px] max-h-[56px] overflow-hidden z-[201] transition-all duration-500`}
      >
        <NavLeftWrapper>
          <NavLeftBtn clickEvent={moveToHome} noPadding={getGlobalHeadingFontSize}>
            {!getGlobalHeadingFontSize && <div className="font-headermsemibold text-base">{data["nav_title"]}</div>}
            
            {getGlobalHeadingFontSize && <div className="flex justify-center items-center p-2 bg-white w-full max-w-[700px] h-full">
              <Image priority src={h1Logo} alt="Logo" />
              </div>}
            
          </NavLeftBtn>
          <NavLeftBtn clickEvent={openMenu}>
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <div>{data["nav_menu"]}</div>
            </div>
          </NavLeftBtn>
          {/* <NavLeftBtn>
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>

              <div>{data["nav_3d"]}</div>
            </div>
          </NavLeftBtn> */}
        </NavLeftWrapper>
        <NavRightWrapper>
          <div className="px-4 cursor-pointer select-none opacity-80 hover:opacity-100 transition-all" onClick={() => changeHeadingText()}>
            {!getGlobalHeadingFontSize && <Image
              priority
              src={h1Icon}
              alt="Change to H1 Font Icon"
            />
            }
            {getGlobalHeadingFontSize && <Image
              priority
              src={h3Icon}
              alt="Change to H1 Font Icon"
            />

            }
          </div>
          <NavRightWrapper>
            <LangBtn title={"EN"} lang={"en"} currentLang={currentLang} />
            <LangBtn title={"DE"} lang={"de"} currentLang={currentLang} />
            <LangBtn title={"FR"} lang={"fr"} currentLang={currentLang} />
          </NavRightWrapper>
        </NavRightWrapper>
      </div>
      <div
        className={`fixed ${
          false ? "-translate-y-full" : "translate-y-0"
        } top-0 left-0 flex lg:hidden items-center justify-between text-white border-b-[0.5px] border-white bg-toa-black w-screen h-[45px] z-[201] max-h-[56px] overflow-hidden transition-all duration-500`}
      >
        <NavLeftBtn clickEvent={openMenu} mobile={true}>
          <div className="flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            {/* <div>{data["nav_menu"]}</div> */}
          </div>
        </NavLeftBtn>
      </div>
    </>
  );
};

export default Nav;
