import { globalHeadingFontSize, ttAnimationCurrentStyle, ttAnimationTrigger } from "@/app/utils/recoil/state";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";




const HeadingText = ({text, button=false, sub=false, defaultColor="black", founded=false}) => {
    const wRef = useRef()
    const getGlobalHeadingFontSize = useRecoilValue(globalHeadingFontSize);
    const [getTtAnimationTrigger, setTtAnimationTigger] = useRecoilState(ttAnimationTrigger)
    const getTtAnimationCurrentStyle = useRecoilValue(ttAnimationCurrentStyle)

  const router = useRouter();

  const moveToExplore = (button) => {
    if(button){
      router.push(`/explore`)
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
          color: defaultColor
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
                color: founded ? "rgb(254 163 12)" : defaultColor
            },
    
            stagger: {
                amount: t1 ? 1.5 : 0.3,
                from: "random",
                ease: "power3.inOut"
            },
            onComplete: () => {
                setTtAnimationTigger(false)
                
            },
        });
    };

   

    // getGlobalHeadingFontSize가 true일 때만 해당 애니메이션 실행
    if (parentDiv && getGlobalHeadingFontSize) {
        // lg: 1024px 이상
        mm.add("(min-width: 1024px)", () => {
            const animation = changeFont("55px", "WritingObjects");
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

        // md: 768px ~ 1023px
        mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
            const animation = changeFont("45px", "WritingObjects");
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

        // sm: 767px 이하
        mm.add("(max-width: 767px)", () => {
            const animation = changeFont("30px", "WritingObjects");
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

    // getGlobalHeadingFontSize가 false일 때만 해당 애니메이션 실행
    } else if (parentDiv && !getGlobalHeadingFontSize) {
        const family = `IBMMonoBoldItalic`;
        // lg: 1024px 이상
        mm.add("(min-width: 1024px)", () => {
            const animation = changeFont("45px", family, false);
            return () => animation.kill(); // 미디어 쿼리 떠날 때 애니메이션 정리
        });

        // md: 768px ~ 1023px
        mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
            const animation = changeFont("35px", family, false);
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
    if(wRef.current && text){
      changeSizeAnimation()
    }
  },[getGlobalHeadingFontSize, text])

    return <div ref={wRef} onClick={() => moveToExplore(button)} className={`select-none ${(button && !getGlobalHeadingFontSize && founded) ? " border-b-4 cursor-pointer pl-4" : " border-b-0 cursor-auto"} font-headerh1 border-toa-yellow w-fit pointer-events-auto ${sub ? "text-center" : "text-start"}`}>
        <div>
        {text.split("").map((v, idx) => {
          return <span 
          key={idx}
          className={`text-black leading-tight pointer-events-auto select-none  ${(!getTtAnimationTrigger && !getGlobalHeadingFontSize) ? getTtAnimationCurrentStyle.hs3 : getTtAnimationCurrentStyle.hs1}`} 
         
          >{v}</span>
        })}
 
        
        </div>
        
    </div>
}

export default HeadingText;