const GlobalPadding = ({children, paddingOn=true, block=false}) => {

  if(block){
    return <div className={`w-full max-w-screen-2xl h-full mx-auto ${paddingOn ? "px-4 md:px-8 3xl:px-0": "p-0"}`}>
    {children}
    </div>
  }
    return <div className={`w-full max-w-screen-2xl h-full mx-auto ${paddingOn ? "px-4 md:px-8 3xl:px-0 py-4": "p-0"}`}>
    {children}
  </div>
}

export default GlobalPadding