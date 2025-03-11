const HSubContainer = ({children}) => {
    return (
        <div className="w-full min-h-[100svh] h-full flex flex-col lg:flex-row gap-4 lg:gap-8">
            {children}
        </div>
    )
}

export default HSubContainer;