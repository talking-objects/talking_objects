import { setCookie } from "@/app/utils/hooks/cookies";

const LangBtn = ({title, lang, currentLang}) => {

    const onChangeLanguage = (ln) => {
        setCookie("language", ln);
        window.location.reload();
      };
    return (
        <div onClick={() => onChangeLanguage(lang)} className={` text-toa-black select-none lg:text-white ${currentLang === lang ? "opacity-100 shadow-toa-blue": "opacity-50"} font-normal w-full flex justify-center px-4 py-4 lg:hover:opacity-100 cursor-pointer transition-all rounded-xl shadow-md drop-shadow-md lg:drop-shadow-none lg:shadow-none lg:rounded-none`}>
        {title}
      </div>
    )
}

export default LangBtn;