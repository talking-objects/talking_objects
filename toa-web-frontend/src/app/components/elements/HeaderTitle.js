import { globalHeadingFontSize, resetHeaderHeightTrigger, ttAnimationCurrentStyle, ttAnimationTrigger } from "@/app/utils/recoil/state";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";



const HeaderTitle = ({ text, notHome=false }) => {
  const [allowAni, setAllowAni] = useState(false)
  const wRef = useRef()
  const getGlobalHeadingFontSize = useRecoilValue(globalHeadingFontSize);
  const setResetHeaderHeightTrigger = useSetRecoilState(resetHeaderHeightTrigger)
  const [getTtAnimationTrigger, setTtAnimationTigger] = useRecoilState(ttAnimationTrigger)
  const getTtAnimationCurrentStyle = useRecoilValue(ttAnimationCurrentStyle)

  // Home Title Mouse Hover Animation
  const randomColorList = [ '#FF5B1C', '#FEA30C', '#AC05F1', '#800020', '#84A6FF', ]
  const randomAni = ({target}) => {
    if(!allowAni && !getGlobalHeadingFontSize){
      const element = document.querySelector(`#ch${target}`); 
      const randomColor = randomColorList[Math.floor(Math.random() * randomColorList.length)];
      gsap.killTweensOf(element);
      gsap.to(element, {
        duration: 1,
        css: {
          color: randomColor,
        },
        onComplete: () => {
          gsap.to(element, {
            delay: 1,
            duration: 1.5,
            css: {
              color: "white"
            }
          })
        },
      });
    }
  }
  const changeSizeAnimation = () => {
    const parentDiv = wRef.current;
    const elements = parentDiv.querySelectorAll(`span`); 
    const mm = gsap.matchMedia(); // matchMedia 객체 초기화
    // 기존 미디어 쿼리와 애니메이션을 먼저 정리
    const clearPreviousAnimations = (els) => {
      gsap.set(els, { 
        css: {
          color: "white"
        }
        // clearProps: "all" 
      }); // 이전 애니메이션에서 설정된 모든 인라인 스타일 제거
  };
    mm.revert();
    const changeFont = (fontSize, fontFamily, t1 = true) => {
      gsap.killTweensOf(elements);
      clearPreviousAnimations(elements)

        return gsap.to(elements, {
            // duration: 1,
            css: {
                fontSize: fontSize,
                fontFamily: fontFamily,
                background: t1 ? "none" : "none",
                // color: t1 ? "black" : "white"
            },
            onStart: () => {
              setResetHeaderHeightTrigger((prev) => !prev)
                setAllowAni(true);
            },
            stagger: {
                amount: t1 ? 1.5 : 0.3,
                from: "random",
                ease: "power3.inOut"
            },
            onComplete: () => {
                setAllowAni(false);
                setTtAnimationTigger(false)
                setResetHeaderHeightTrigger((prev) => !prev)
               
                
            },
        });
    };

   

    // getGlobalHeadingFontSize가 true일 때만 해당 애니메이션 실행
    if (parentDiv && getGlobalHeadingFontSize) {
        // lg: 1024px 이상
        mm.add("(min-width: 1024px)", () => {
            const animation = changeFont(notHome ? "70px" :"70px", "WritingObjects");
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

        // md: 768px ~ 1023px
        mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
            const animation = changeFont(notHome ? "40px" : "50px", "WritingObjects");
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

        // sm: 767px 이하
        mm.add("(max-width: 767px)", () => {
            const animation = changeFont(notHome ? "30px" : "30px", "WritingObjects");
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

    // getGlobalHeadingFontSize가 false일 때만 해당 애니메이션 실행
    } else if (parentDiv && !getGlobalHeadingFontSize) {
        const family = `IBMMonoBoldItalic`;

        // lg: 1024px 이상
        mm.add("(min-width: 1024px)", () => {
            const animation = changeFont("80px", family, false);
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

        // md: 768px ~ 1023px
        mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
            const animation = changeFont("50px", family, false);
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

        // sm: 767px 이하
        mm.add("(max-width: 767px)", () => {
            const animation = changeFont("30px", family, false);
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });
    }
};

  
  useEffect(() => {
    if(wRef && getTtAnimationTrigger){
      changeSizeAnimation()
    }
  },[getGlobalHeadingFontSize, getTtAnimationTrigger])
  if(notHome){
    return (
    
      <div ref={wRef} className={`flex-1 static leading-[1.1] text-white z-50 font-bold w-full lg:w-2/3 flex justify-center text-center lg:text-start lg:justify-start pointer-events-none select-none break-word`}>
        {/* {text} */}
        <div>
        {text.split("").map((v, idx) => {
          return <span 
          id={`ch${idx}`}
          key={idx}
          className={`text-white pointer-events-auto select-none ${(!getTtAnimationTrigger && !getGlobalHeadingFontSize) ? getTtAnimationCurrentStyle.h3 : getTtAnimationCurrentStyle.h1}`} 
          onMouseEnter={() => randomAni({target: idx})}  
          >{v}</span>
        })}
        </div>
      </div>
    );
  }

    
    return (
      <div ref={wRef} className={`absolute leading-[1.1] top-1/2 -translate-y-1/2 h-fit left-1/2 -translate-x-1/2 w-full max-w-screen-2xl text-white z-50 font-bold pointer-events-none select-none break-word p-8 text-center overflow-hidden`}>
        {text.split("").map((v, idx) => {
          return <span 
          id={`ch${idx}`}
          key={idx}
          className={`text-white pointer-events-auto select-none ${(!getTtAnimationTrigger && !getGlobalHeadingFontSize) ? getTtAnimationCurrentStyle.h3 : getTtAnimationCurrentStyle.h1}`} 
          onMouseEnter={() => randomAni({target: idx})}  
          >{v}</span>
        })}
      </div>
    );
  };


export default HeaderTitle;