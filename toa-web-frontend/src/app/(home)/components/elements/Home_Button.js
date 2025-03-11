import { useRouter } from "next/navigation";

const HomeButton = ({text, color, path=""}) => {
    const router = useRouter();
    const bgColor = {
        'orange': 'bg-[#FF5B1C]',
        'yellow': 'bg-[#FEA30C]',
        'violet': 'bg-[#AC05F1]',
        'red': 'bg-[#800020]',
        'blue': 'bg-[#84A6FF]',
        'black': 'bg-[#1D0C01]'
    }
    const textColor = {
        'orange': 'active:text-[#FF5B1C]',
        'yellow': 'active:text-[#FEA30C]',
        'violet': 'active:text-[#AC05F1]',
        'red': 'active:text-[#800020]',
        'blue': 'active:text-[#84A6FF]',
        'black': 'active:text-[#1D0C01]'
    }
    const shadowColor = {
        'orange': 'active:shadow-[#FF5B1C]',
        'yellow': 'active:shadow-[#FEA30C]',
        'violet': 'active:shadow-[#AC05F1]',
        'red': 'active:shadow-[#800020]',
        'blue': 'active:shadow-[#84A6FF]',
        'black': 'active:shadow-[#1D0C01]'
    }


    const onPush = (path) => {
        router.push(`/${path}`)
    }
    return (
        <div onClick={() => onPush(path)} className={`${bgColor[color]} font-headerh1 text-center w-full max-w-full lg:max-w-[275px] flex justify-center items-center text-white px-4 py-4 rounded-xl text-base md:text-lg lg:text-xl cursor-pointer shadow-md transition-all duration-100 active:bg-white ${textColor[color]} ${shadowColor[color]} active:scale-95 active:shadow-md select-none`}>
            {text}
        </div>
    )
}

export default HomeButton;