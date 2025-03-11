const LoadingBox2 = () => {
    return <div className="w-screen h-screen bg-white flex justify-center items-center p-4">
            <div className="w-full max-w-screen-2xl h-full flex flex-col justify-center items-center py-12">
                <div 
                style={{backgroundImage: `url(/assets/loading-animations/placeholder-playground_A.svg)`}}
                className="flex-[1] w-full bg-no-repeat bg-center bg-contain">
                </div>
            </div>
    </div>
}

export default LoadingBox2;