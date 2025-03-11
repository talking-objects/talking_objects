const HomeText = ({text, big=true}) => {
    return (
        <div className={`text-base md:text-lg lg:text-xl font-normal w-full ${big ? "lg:w-4/5" : "w-full"}`}>
            {text}
        </div>
    )
}

export default HomeText;