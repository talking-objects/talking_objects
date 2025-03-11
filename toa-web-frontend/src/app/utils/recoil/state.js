import { atom } from 'recoil';
export const globalCurrentUrl = atom({
  key: 'globalCurrentUrl', 
  default: '', 
});

export const globalTerm = atom({
  key: "globalTerm",
  default: {
    on: false,
    word: {
      name: "",
      about: "",
    }
  }
})

export const globalDetectNavDirection = atom({
  key: "globalDetectNavDirection",
  default: false,
})


export const globalHeadingFontSize = atom({
  key: "globalHeadingFontSize",
  default: false,
})

export const resetHeaderHeightTrigger = atom({
  key: "resetHeaderHeightTrigger",
  default: false
})

export const ttAnimationTrigger = atom({
  key: "ttAnimationTrigger",
  default: false
})
export const ttAnimationCurrentStyle = atom({
  key: "ttAnimationCurrentStyle",
  default: {
    h3: "text-[30px] md:text-[50px] lg:text-[80px] font-headerh1",
    h1: "text-[30px] md:text-[50px] lg:text-[70px] font-writing",
    hs3: "text-[30px] md:text-[35px] lg:text-[45px] font-headerh1",
    hs1: "text-[30px] md:text-[35px] lg:text-[45px] font-writing",
  }
})