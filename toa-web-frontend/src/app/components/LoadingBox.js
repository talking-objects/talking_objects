import Image from "next/image";

const LoadingBox = () => {
    return <>
        <Image
           src={"/assets/loading-animations/placeholder-playground_A.svg"}
           width={0}
           height={0}
        //    sizes="100vw"
           style={{ width: '100%', height: 'auto' }} // optional
           alt="top"
        />
    </>
}

export default LoadingBox;