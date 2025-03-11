"use client"
import Link from "next/link";
import LoadingBox from "../LoadingBox";

const NotFoundWrapper = ({text, notfound=false, reset}) => {
    return <div className="w-screen h-[100svh] overflow-hidden bg-white flex justify-center items-center font-jetBrainsMono relative">
        <div className="w-full h-full flex justify-center items-center">
          <LoadingBox />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-1 flex flex-col justify-center items-center text-white">
          <div className="font-bespokeStencil text-6xl mb-10 text-center">{text.title}</div>
          <div className="flex flex-col items-center justify-center">
            <div className="font-jetBrainsMonoExtraBold text-xl">{text.text1}</div>
            <div className="text-center">{text.text2}</div>
          </div>
          {notfound && <Link href={"/"} className="mt-8 border-2 border-white px-4 py-2 text-xl hover:bg-white hover:text-black transition-all cursor-pointer uppercase text-white">{"Back to Home"}</Link>}
          {!notfound && <div onClick={reset}className="mt-8 border-2 border-white px-4 py-2 text-white text-xl hover:bg-white hover:text-black transition-all cursor-pointer uppercase text-black">Try again</div>}
        </div>
 
    </div>
}

export default NotFoundWrapper;