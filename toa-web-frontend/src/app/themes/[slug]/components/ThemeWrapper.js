"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import ThemeHeader from "./ThemeHeader";
import { BUTTONLIST } from "@/app/constant/kirbyurl";
import yaml from "js-yaml";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { globalCurrentUrl } from "@/app/utils/recoil/state";

const ThemeWrapper = ({ themePageText, themeButtonText, data, categoryList }) => {
  const params = useParams();
  const router = useRouter();
  const [getObjects, setObjects] = useState(JSON.parse(JSON.stringify(data.result)));
  const { handleSubmit, control, reset } = useForm();
  const { handleSubmit: handleSubmit2, register, setValue, getValues, reset: reset2 } = useForm();

  const setCurrentUrl = useSetRecoilState(globalCurrentUrl)
  const getPathname = usePathname()
  useEffect(() => {
      setCurrentUrl(getPathname)
  },[])
  const onPush = (path) => {
    router.push(path);
  };
  const onSubmit = (cateData) => {
    reset2();
    
    
    const keys = Object.keys(cateData);

    let currentData = JSON.parse(JSON.stringify(data.result));
    for (let i = 0; i < keys.length; i++) {
      // all continue
      // not all filter
      if (cateData[keys[i]][0] === "all") {
        continue;
      } else {
        // 

        if (keys[i] === "subtheme") {
          for (let j = 0; j < cateData[keys[i]].length; j++) {
            // 
            currentData = currentData.filter((obj) => {
              // categories of obj
              const objCategories = obj.subtheme;

              if (objCategories && objCategories.includes(cateData[keys[i]][j])) {
                
                return obj;
              }
            });
          }
        } else {
          // category result
          for (let j = 0; j < cateData[keys[i]].length; j++) {
            // 
            currentData = currentData.filter((obj) => {
              // categories of obj
              const objCategories = yaml.load(obj.dynamic_category);
              const findCategory = objCategories.find((ca) => ca["category_box_name"] === keys[i]);
              // 

              if (findCategory && findCategory["category_box"].includes(cateData[keys[i]][j])) {
                
                return obj;
              }
            });
          }
        }
      }
    }
    setObjects(currentData);
    
  };

  const onSearchSubmit = () => {
    reset();
   
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const getSearchValue = getValues("searchBar");
    const pattern = new RegExp(escapeRegExp(getSearchValue), "gi");
    
    let currentData = JSON.parse(JSON.stringify(data.result));

    currentData = currentData.filter((v) => {
      const matches = String(v.title).match(pattern);
      if (matches) {
        return v;
      }
    });
    setObjects(currentData);

  };
  return (
    <div>
      <ThemeHeader data={data} themePageText={themePageText} params={params} />
      <div className="global-padding w-screen min-h-screen h-full bg-white">
        <div className="py-4 text-3xl">Unveiling the Depths of {BUTTONLIST.find((v) => v.slug === params.slug).name}</div>
        <div className="flex w-full h-full relative gap-4">
          <div className="flex-1 h-full sticky top-0 left-0">
            <form onSubmit={handleSubmit(onSubmit)} className="">
              {Object.keys(categoryList).map((value, idx) => {
                return (
                  <div key={idx}>
                    <div className="font-bold">{value}</div>
                    <Controller
                      name={`${value}`}
                      control={control}
                      defaultValue={["all"]}
                      render={({ field }) => {
                        return (
                          <>
                            {categoryList[value].map((item, idx2) => {
                              return (
                                <div key={idx2} className="flex gap-2">
                                  <input
                                    type="checkbox"
                                    id={`${item}`}
                                    value={item}
                                    checked={field.value.includes(item)}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === "all") {
                                        field.onChange(e.target.checked ? [value] : field.value.filter((v) => v !== value));
                                      } else {
                                        field.onChange(
                                          e.target.checked
                                            ? [
                                                ...field.value.filter((v) => {
                                                  if (v !== "all") {
                                                    return v;
                                                  }
                                                }),
                                                value,
                                              ]
                                            : field.value.filter((v) => v !== value)
                                        );
                                      }
                                    }}
                                  ></input>

                                  <label htmlFor={`${item}`}>{value === "subtheme" ? `${item !== "all" ? themePageText.result[`sub_${item}`] : "all"}` :`${item}`}</label>
                                </div>
                              );
                            })}
                          </>
                        );
                      }}
                    />
                  </div>
                );
              })}

              <button className="w-full py-3 bg-orange-400 rounded-xl flex justify-center">Search</button>
            </form>
          </div>

          <div className="flex-[3] h-full">
            <form onSubmit={handleSubmit2(onSearchSubmit)} className="mb-4">
              <input {...register("searchBar")} type="text" placeholder="Write text..." className="w-full py-2 px-2 bg-white border focus:outline-none focus:border-orange-400 border-neutral-400 rounded-lg" />
            </form>
            <div className="w-full grid grid-cols-3 gap-4">
              {getObjects.map((val, idx) => {
                return (
                  <div onClick={() => onPush(`/objects/${String(val.uuid).slice(7)}`)} key={idx} className="w-full border border-neutral-300 flex flex-col text-wrap break-words rounded-xl overflow-hidden cursor-pointer">
                    <div className="w-full aspect-video bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${process.env.KB_API_FILE}/${yaml.load(val.coverimage)})` }}></div>
                    <div className="px-2 py-2">
                      <div>{val.title}</div>
                      <div>
                        {val.cover_text.slice(0, 50)}
                        {val.cover_text.length > 49 && "..."}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeWrapper;
