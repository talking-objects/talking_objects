import { useParams } from "next/navigation";
import { BUTTONLIST } from "../constant/kirbyurl";
import ThemeBtn from "./elements/Theme_Btn";



const CoreThemeWrapper = ({home=false, headerId="#header"}) => {
  const params = useParams();
  
  
  return (
    <div className={`select-none absolute bottom-0 left-0 w-full h-[149px] lg:h-[75px] grid grid-cols-2 ${home ? "lg:grid-cols-5" : "lg:grid-cols-4"} z-[102]`}>
      {BUTTONLIST.map((val, idx) => {
        if (val.slug !== params.slug) {
          return (
            <ThemeBtn
              key={idx}
              path={val.slug}
              text={val.name}
              color={val.color}
              home={home}
            />
          );
        }
      })}
    </div>
  );
};

export default CoreThemeWrapper;

