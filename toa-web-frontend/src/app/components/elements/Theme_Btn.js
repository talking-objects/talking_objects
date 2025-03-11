import { useRouter } from "next/navigation";

const ThemeBtn = ({path, text, color, home}) => {
    const router = useRouter();

    const onPush = (path) => {
        router.push(`/themes/${path}`)
    }

    return (
        <div onClick={() => onPush(path)} style={{backgroundColor: color}} className={`select-none font-headerh1 text-center flex justify-center text-sm md:text-lg lg:text-xl items-center w-full cursor-pointer text-white font-medium ${home ? "last:col-span-2" : "last:col-span-1"} lg:last:col-span-1 transition-all duration-150`}>
            <div className="leading-[1.4rem]">{text}</div>
        </div>
    )
}

export default ThemeBtn;