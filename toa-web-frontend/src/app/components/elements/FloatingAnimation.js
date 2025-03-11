import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, Sine } from "gsap";
import yaml from "js-yaml";
import { globalHeadingFontSize } from "@/app/utils/recoil/state";
import { useRecoilValue } from "recoil";
import { getRandomPlaceHolder } from "@/app/utils/hooks/etc";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FloatingAnimation = ({ headerImages, noAnimation=true, opacity=false }) => {
  const [positions, setPositions] = useState([]);
  const parentRef = useRef(null);
  const boxesRef = useRef([]);
 

  const runRandomPosObj = () => {
    // Function to shuffle and slice the array
    const getRandomList = (items) => {
   
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 9);
    };
    const randomList = getRandomList(headerImages);

    const parent = parentRef.current;
    const newPositions = [];

    let imageSize;

    if(opacity){
      imageSize = {
        width: parent.clientWidth / 3 > 230 ? parent.clientWidth / 4 : 130,
        height: parent.clientWidth / 3 > 230 ? parent.clientHeight / 4 : 150,
      };
    }else{
      imageSize = {
        width: parent.clientWidth / 4 > 330 ?  parent.clientWidth / 4 : 230,
        height: parent.clientWidth / 4 > 330 ? parent.clientHeight / 3 : 250,
      };
    }
   

    if (parent) {
      const maxX = parent.clientWidth; // width of child (80vw) converted to px
      const maxY = parent.clientHeight; // height of child (64vh) converted to px
      //   const maxX = parent.clientWidth - 400; // width of child (80vw) converted to px
      //   const maxY = parent.clientHeight - 300; // height of child (64vh) converted to px

      for (let i = 0; i < randomList.length; i++) {
        
        const r = Math.random() * i;
        if(opacity){
          newPositions.push({
            x: Math.sin(i + Math.random()) * (maxX / 3.5) + maxX / 2 - imageSize.width / 2,
            y: Math.cos(i + Math.random()) * (maxY / 3.5) + maxY / 2 - imageSize.height / 2,
            // x: Math.random() * maxX - 150,
            // y: Math.random() * maxY - 50,
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
            coverImage: randomList[i].coverimage,
            cover_text: randomList[i].cover_text,
            title: randomList[i].title,
            uuid: randomList[i].uuid
          });
        }else{
          newPositions.push({
            x: Math.sin(i + Math.random()) * (maxX / 2.5) + maxX / 2 - imageSize.width / 2,
            y: Math.cos(i + Math.random()) * (maxY / 2.5) + maxY / 2 - imageSize.height / 2,
            // x: Math.random() * maxX - 150,
            // y: Math.random() * maxY - 50,
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
            coverImage: randomList[i].coverimage,
            cover_text: randomList[i].cover_text,
            title: randomList[i].title,
            uuid: randomList[i].uuid
          });
        }
       
      }

      setPositions(newPositions);
    }
  };

  useEffect(() => {
    runRandomPosObj();
  }, [headerImages]);
  useEffect(() => {
    window.addEventListener("resize", runRandomPosObj);
    return () => {
      window.removeEventListener("resize", runRandomPosObj);
    };
  }, [headerImages]);
  useEffect(() => {
    if (!headerImages || headerImages.length === 0) {return};
     
    // Function to generate a random value function
    function random(min, max) {
      const delta = max - min;
      return (direction = 1) => (min + delta * Math.random()) * direction;
    }

    // Apply animations
    boxesRef.current.forEach((v) => {
     
      const randomX = random(-100, 100);
      const randomY = random(-200, 200);
      const randomTime = random(1, 2);

      // gsap.set(v, {
      //   x: randomX(-1),
      //   y: randomY(1),
      // });

      function moveX(target, direction) {
        gsap.to(target, {
          duration: randomTime(),
          x: randomX(direction),
          ease: Sine.easeInOut,
          onComplete: moveX,
          onCompleteParams: [target, direction * -1],
        });
      }

      function moveY(target, direction) {
        gsap.to(target, {
          duration: randomTime(),
          y: randomY(direction),
          ease: Sine.easeInOut,
          onComplete: moveY,
          onCompleteParams: [target, direction * -1],
        });
      }

      // // Start the animations
      if(noAnimation){
        moveX(v, 1);
        moveY(v, -1);
      }
     
    });
  }, [headerImages, positions]); // Dependencies in useEffect

  // Assign refs to box elements
  return (
    <div ref={parentRef} className="w-full h-full relative overflow-hidden">
      {positions.length > 0 &&
        positions.map((pos, index) => (
          <ImageBox key={index} index={index} boxesRef={boxesRef} pos={pos} noAnimation={noAnimation} opacity={opacity} />
        ))}
    </div>
  );
};


const ImageBox = ({index, boxesRef, pos, noAnimation, opacity}) => {
  const [src, setSrc] = useState(`${process.env.KB_API_FILE}/${yaml.load(pos.coverImage)}`)
  const getGlobalHeadingFontSize = useRecoilValue(globalHeadingFontSize);
  const getRandomPlaceHolderUrl = useMemo(() => {
    return getRandomPlaceHolder()
  },[])
  const router = useRouter();
  const onClick = () => {
    router.push(`/objects/${pos.uuid.slice(7)}`)
  }
 
  // const randomColor = useMemo(() => {
  //   const bgColor = [
  //     '#FF5B1C',
  //     '#FEA30C',
  //     '#AC05F1',
  //     '#800020',
  //     '#84A6FF',
  //   ]
  //   return bgColor[Math.floor(Math.random() * bgColor.length)]
  // },[])

  const randomPlaceHolder = useMemo(() => {
    return getRandomPlaceHolder()
  },[])
  return (
    <div
    onClick={onClick}
    ref={(el) => (boxesRef.current[index] = el)}
    style={{
      position: "absolute",
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      width: `${pos.width}`,
      height: `${pos.height}`,
      // ...(!Boolean(pos.coverImage) && {backgroundImage: `url(${randomPlaceHolder})`}),
      // ...(!Boolean(pos.coverImage) && {backgroundColor: randomColor}),
      // ...(Boolean(pos.coverImage) && {backgroundImage: `url(${process.env.KB_API_FILE}/${yaml.load(pos.coverImage)})`})
    }}
    className={`box cursor-pointer group rounded-xl overflow-hidden select-none bg-cover bg-center bg-no-repeat transition-all duration-500 ${opacity && "shadow-md"} relative`}
  >     
  {Boolean(pos.coverImage) && <Image
    src={src}
    alt=""
    fill
    placeholder="blur" 
    blurDataURL={getRandomPlaceHolderUrl}
    style={{objectFit:"cover"}}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
    onError={() => {      
      setSrc(getRandomPlaceHolderUrl)
    }}
    />}
    <div className={`absolute top-0 left-0 ${!getGlobalHeadingFontSize ? noAnimation ? "bg-black" : "bg-white" : "bg-white"} w-full h-full ${opacity ? "bg-opacity-0" : "bg-opacity-70"} group-active:bg-opacity-0 lg:group-hover:bg-opacity-0 transition-all duration-500 `}></div>
    <div className={`absolute bottom-0 left-0 p-4 w-full opacity-0 text-white text-sm text-opacity-90 ${opacity ? "bg-opacity-0" : "group-active:group-hover:opacity-100 lg:group-hover:opacity-100"} transition-all duration-500 bg-toa-black bg-opacity-50`}>
      {pos["title"] && <div className="lg:text-2xl font-semibold">{pos["title"]}</div>}
      {pos["cover_text"] && <div className="break-all">{pos["cover_text"].slice(0,100)}{pos["cover_text"].length > 100 && "..."}</div>}
    </div>
  </div>
  )
}

export default FloatingAnimation;
