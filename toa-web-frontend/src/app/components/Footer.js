"use client";
import { useEffect, useMemo, useState } from "react";
import HContainer from "./containers/HContainer";
import yaml from "js-yaml"
import { useRouter } from "next/navigation";
import { DynamicInfoPageData } from "../utils/swr/fetchdata";
import Image from "next/image";

const BoxText = ({path=true, clickData, text}) => {
  const router = useRouter()


  const onClick = ({path, email=false, sns=false, web=false}) => {
    // if(email){
    //   const link = document.createElement('a');
    //   link.href = `mailto:${path}`;
    //   link.style.display = 'none'; // 화면에 보이지 않게
    //   document.body.appendChild(link); // body에 추가
    //   link.click(); // 클릭 이벤트 실행
    //   document.body.removeChild(link); 
    // }
    if(sns){
      const cleanPath = path.replace(/^https?:\/\//, '');
      const link = document.createElement('a');
      link.setAttribute("target", "_blank")
      link.href = `https://${cleanPath}`;
      link.style.display = 'none'; // 화면에 보이지 않게
      document.body.appendChild(link); // body에 추가
      link.click(); // 클릭 이벤트 실행
      document.body.removeChild(link); 
    }
    if(web){
      router.push(path)
    }
   
  }
  if(Boolean(clickData?.email)){
    return <a href={`mailto:${clickData.path}`} className="font-headermregular break-words text-toa-yellow cursor-pointer">Email:{clickData.path}</a>
  }
  if(!path){
    return <div className="font-headermregular break-words">{text}</div>
  }
  return <div onClick={() => onClick(clickData)} className="font-headermregular break-words text-toa-yellow cursor-pointer" dangerouslySetInnerHTML={{__html: text}}></div>
}
const BoxTitle = ({title}) => {
  return <div className="font-headermbold">{title}</div>
}
const BoxWrapper = ({children}) => {
  return <div className="flex flex-col gap-[2px]">{children}</div>
}
const BoxContainer = ({children}) => {
  return <div className="flex-1 flex flex-col justify-between gap-4">{children}</div>
}

const Footer = ({ footerData }) => {
  const {dataSwr, isLoading}= DynamicInfoPageData({currentLanguage:"en"})
  const [dynamicInfos, setDynamicInfos] = useState(null)

  useEffect(() => {
    if(!isLoading){
      setDynamicInfos(dataSwr.result)
    }
  },[dataSwr])
  return (
    <div>
    <HContainer color="footer-black" footerMode={true}>
      <div className="py-4 w-full h-full text-xs md:text-sm lg:text-[15px] text-white flex items-stretch text-[14px] gap-12 flex-wrap">
        <div className="w-[400px]">
          <div className="font-ibm_mono_medium">{footerData?.footer_about}</div>
        </div>
        <div className="flex-[1] flex justify-between gap-4">
          <BoxContainer>
            <BoxWrapper >
              <BoxTitle title={"Contact"} />
              <BoxText path={false} text={footerData?.footer_contact_name} />
            </BoxWrapper>
            <BoxWrapper >
              <BoxText clickData={{path:footerData?.footer_contact_email, email: true}} text={`Email:${footerData?.footer_contact_email}`} />
              {footerData?.footer_contact_meta && <BoxText clickData={{path:footerData?.footer_contact_meta, sns: true}} text={`FaceBook`} />}
              {footerData?.footer_contact_meta && <BoxText clickData={{path:footerData?.footer_contact_instagram, sns: true}} text={`Instagram`} />}
            </BoxWrapper>
            {(!isLoading && Boolean(dynamicInfos)) && <BoxWrapper>
              <BoxTitle title={"Other"} />
              {
                dynamicInfos.length > 0 && dynamicInfos.map((val, idx) => {
                  return <BoxText key={idx} clickData={{path:`/info/${val.slug}`, web:true}} text={`${val.info_title}`} />
                })
              }
              
              
            </BoxWrapper>}
          </BoxContainer>
          <BoxContainer>
            <BoxWrapper>
              <BoxTitle title={"Archive"} />
              <BoxText clickData={{path:`/explore`, web:true}} text={"Explore our Archive"} />
              <BoxText clickData={{path:`/themes/knowledge`, web:true}} text="Knowledge" />
              <BoxText clickData={{path:`/themes/resitution`, web:true}} text="Restitution and Reclamation" />
              <BoxText clickData={{path:`/themes/identity`, web:true}} text="Identity" />
              <BoxText clickData={{path:`/themes/artistic-reflections`, web:true}} text="Artistic Reflections" />
              <BoxText clickData={{path:`/themes/memory-the-imaginary`, web:true}} text="Memory and the Imaginary" />
            </BoxWrapper>
            <BoxWrapper>
              <BoxTitle title={"Info"} />
              <BoxText clickData={{path:`/about`, web:true}} text={"About"} />
              <BoxText clickData={{path:`/team`, web:true}} text={"Team"} />
              <BoxText clickData={{path:`/contributors`, web:true}} text={"Contributors"} />
              <BoxText clickData={{path:`/manifesto`, web:true}} text={"Manifesto"} />
              <BoxText clickData={{path:`/glossary`, web:true}} text={"Glossary"} />
            </BoxWrapper>
          </BoxContainer>
          {footerData?.footer_optional_page && <BoxContainer>
            <BoxWrapper>
              <BoxTitle title={`Other(Optional)`} />
              {
                yaml.load(footerData?.footer_optional_page).map((val,idx) => {
                  return (
                    <BoxText key={idx} clickData={{path:val.o_url, sns:true}} text={val.o_name} />
                  )
                })
              }
            </BoxWrapper>
          </BoxContainer>}
        </div>
      </div>
    </HContainer>
    <HContainer footerMode={true} color="white" >
      <div className="w-full lg:max-w-[80%] flex flex-col justify-center font-headermsemibold py-4 gap-8">
        <div>
          <div className="">The TALKING OBJECTS ARCHIVE is funded by</div>
          <div className="w-full border-b lg:border-b-2 border-black">
            <div className="w-full lg:w-11/12">
              <div className="relative w-full h-[140px] lg:h-[160px] flex justify-start">
              <Image 
                src={"/assets/footer/supporter.png"}
                alt=""
                layout="fill"
                // width={1920} // 원본 이미지의 가로 크기
                // height={1080} // 원본 이미지의 세로 크기
                objectFit="contain"
              />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="">Developed in collaboration with</div>
          <div className="w-full border-b lg:border-b-2 border-black">
            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-[140px] lg:h-[160px]  flex justify-start">
                <Image 
                  src={"/assets/footer/collaborator.png"}
                  alt=""
                  layout="fill"
                  // width={1920} // 원본 이미지의 가로 크기
                  // height={1080} // 원본 이미지의 세로 크기
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HContainer>
    </div>
  );
};

export default Footer;
