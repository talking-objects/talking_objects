const TermContainer = ({children}) => {
    return (
        <div className="flex flex-col lg:grid w-full h-full grid-cols-2 auto-rows-auto gap-4">
            {children}
        </div>
    )
}

export default TermContainer;