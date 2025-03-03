"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const geoUrl = "/data/qoraqalpogiston.json"; 

const QoraqalpogistonMap = () => {
  const tfourth=useTranslations("home.fourthSection")
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Xaritani yuklashda xatolik:", error));
  }, []);

  const regions = [
    { id: "Qo`ng`irot tumani", name: tfourth('regions.first') },
    { id: "Mo`ynoq tumani", name: tfourth('regions.second') },
    { id: "Shumanag tumani", name: tfourth('regions.third') },
    { id: "Taxtako`pir tumani", name: tfourth('regions.fourth') },
    { id: "Amudaryo tumani", name: tfourth('regions.fifth') },
    { id: "Nukus tumani", name: tfourth('regions.sixth') },
    { id: "Xo`jayli tumani", name: tfourth('regions.seventh') },
    { id: "Taxiatosh tumani", name: tfourth('regions.eight') },
    { id: "Beruniy tumani", name: tfourth('regions.nine') },
    { id: "Ellik qal`a tumani", name: tfourth('regions.ten') },
    { id: "To`rtko`l tumani", name: tfourth('regions.eleven') },
    { id: "Qorao`zak tumani", name: tfourth('regions.twelve') },
    { id: "Chimboy tumani", name: tfourth('regions.thirteen') },
    { id: "Bo`zatov tumani", name:tfourth('regions.fourteen') },
    { id: "Kegeyli tumani", name: tfourth('regions.fifteen') },
    { id: "Qanliko`l tumani", name: tfourth('regions.sixteen') },
  ];
  const TypeofCrafts=['Zargarlik','Kulolchilik','Duradgorlik','Kiyim-kechak','Kashtachilik']
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const selectedButtonRef = useRef<HTMLButtonElement | null>(null);

const setButtonRef = useCallback(
  (node: HTMLButtonElement | null, regionId: string) => {
    if (node && selectedRegion === regionId) {
      selectedButtonRef.current = node;
    }
  },
  [selectedRegion]
);

useEffect(() => {
  if (selectedButtonRef.current) {
    selectedButtonRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
}, [selectedRegion]);
  const handleClick = (index: number) => {
    setClickedIndex(index === clickedIndex ? null : index); 
  };
 

  return (
    <div className="">
      <div className="flex gap-[20px] overflow-x-scroll no-scrollbar mb-[20px] py-[5px]">
        {
          TypeofCrafts.map((item,index)=>
            <Button

          key={index}
          onClick={() => handleClick(index)}
          className={`flex items-center justify-start rounded-lg p-2.5 w-[293px] h-[52px] shadow-none  responsive-btn
            ${clickedIndex === index ? 'primary-bg text-white' : 'bg-[#f6f6f6] text-[#242b3a]'} 
            hover:bg-[#f6f6f6]`}
        >
               {item}
              </Button>
          )
        }
      

      </div>
      <div className="w-full flex flex-wrap gap-[20px] justify-between">
        <div className="md:rounded-[14px] md:w-[25%] md:h-[744px] md:bg-[#f6f6f6] md:p-[16px] pb-[60px] flex flex-wrap gap-[8px] overflow-hidden">
        
         
  <p className="font-semibold text-lg leading-[133%] text-[#242b3a] mb-[16px] border-b border-b-gray-300 w-full pb-[16px] hidden md:block">
        Hududlar
      </p>
      <div className="h-full overflow-y-scroll w-full no-scrollbar pb-[16px] mb-[20px] hidden md:block">
          {regions.map((region) => (
          <Button
            key={region.id}
            
            ref={(node) => setButtonRef(node, region.id)}
            className={cn(
              "flex items-center justify-start rounded-lg p-2.5 w-full h-[52px]  shadow-none bg-[#f6f6f6]   text-[#242b3a] hover:bg-[#f6f6f6] responsive-btn",
              selectedRegion === region.id
                ? "primary-bg text-white"
                : "bg-[#f6f6f6]",
              hoveredRegion === region.id ? "bg-red-300" : ""
            )}
            onClick={() => setSelectedRegion(region.id)}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
           {region.name} 
          </Button>
        ))}
          </div>

         
      <div className="w-full flex gap-2 overflow-x-auto no-scrollbar md:hidden ">
        {regions.map((region) => (
          <Button
         
          ref={(node) => setButtonRef(node, region.id)}
          key={region.id}
          className={cn(
            "flex items-center justify-start rounded-lg p-2.5 w-[293px] h-[52px]  shadow-none bg-[#f6f6f6]   text-[#242b3a] hover:bg-[#f6f6f6] responsive-btn",
            selectedRegion === region.id
              ? "primary-bg text-white"
              : "bg-[#f6f6f6]",
            hoveredRegion === region.id ? "bg-red-300" : ""
          )}
          onClick={() => setSelectedRegion(region.id)}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            {region.name}
          </Button>
        ))}
      </div>
        </div>
        <div className=" flex w-full md:max-w-[1015px] md:w-[70%]  items-end  flex-wrap">
          <div className="w-full flex justify-center items-center ">
            <div className="svg__Wrapper md:w-[650px] w-[300px]  mb-[10px]">
              <svg
                data-v-463741c6=""
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 919 659"
              >
                <defs>
                  <linearGradient
                    id="regionGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#9E1114" />
                    <stop offset="100%" stopColor="#530607" />
                  </linearGradient>
                  <linearGradient
                    id="regionGradient-hover"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#9E1114" />
                    <stop offset="100%" stopColor="#530607" />
                  </linearGradient>
                </defs>
                <title data-v-463741c6=""></title>
                <g data-v-463741c6="" id="Слой_3" data-name="Слой 3">
                  <g
                    data-v-463741c6=""
                    id="Республика_Каракалпакстан"
                    data-name="Республика Каракалпакстан "
                  >
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Qo`ng`irot tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Qo`ng`irot tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      d="M382.38,384.62s-7.13,3.63-9.26,6-2.62,7.26-2.62,7.26-8-.88-9.88-2.63-6.74,0-6.74,0,1.24,6.37-1.26,8.21a2.89,2.89,0,0,1-2,.5c-2.4-.15-5.24-2.36-6-2.84-1-.62-6.74-.87-6.74-.87a17.78,17.78,0,0,1-1.5,4.75c-1,1.75-4.41,1.66-4.41,1.66l-2.22-2.41-1.5,4s3,1.75,2.5,4.25-3.5-1-4.75.5,2.5,2.25,1.25,7-5,1.75-5,1.75a41.67,41.67,0,0,1-6.75.5c-4,0-13-4-17.5-4.75s-10.25,5.25-10.25,5.25l-3.5,2v3.75a56.59,56.59,0,0,1,7.25,5.25c2,2,6.5,1.25,6.5,1.25s3.75,5.75,4.25,10.25,6.75,11,6.75,11l1,4s10.75,5.5,9.5,8.75-5.75.25-5.75.25-3.75,1.5-5.25.75-.75-10.75-.75-10.75l-6-9.5-11.5-2.5L282,450.5s-3.25-3-4.25-3,0-4-3-5.5-8,2-8,2l-1,6.75s-2.5-4.5-5.5-1.75,2.5,5.75,3.5,8.5-.25,4.75-.75,7.5.75,9.5-1.25,12-7-.75-7-.75l-1.5,3.5S256.75,484,255,486s-1.75-.75-8-.75S240,488,235.5,489s-10.75-8.5-29,0-15,18.25-18.25,24.5-7.75,4-13.25,7S169.12,551,171.75,560c5.5,6.5,2.25,11.5,2.25,11.5l1.75,13L181,592c3.25,0,4.5-1.75,6.5-1.5s.5,4.5-2,5.5-7.75,3-7.75,7-2.08,4-2.08,4-99.34-8.33-100.34-7.67,1-488.9,1-488.9L323.67,35c.35.31.76.65,1.23,1,0,0-3,3.87-3,7.24s-.26,7.63-1.13,10.13-5.75,8.74-8.13,12.5-5.5,9.12-6.87,15-2.75,6.87-2.63,9.87.86,4.25,0,5.5-2.62-.37-3.24,1.5-5.26,12.37-5.38,13.63.38,2.74,0,3.74-1.25-.87-2.12,2.13-3.76,10.13-3.63,15.75.75,9.5,2.63,13.25,4.74,8.5,5.5,12.13a13.26,13.26,0,0,1,.24,5.5h-2l-4.87,8.74s-1,9.13,0,10.88a32.65,32.65,0,0,1,2.5,10c0,2.25-1,10.75,0,13.5s7.5,11,7.5,15.25v21.5c0,3,4.75,8.5,4.75,11.25v5.75s-5.5-3.75-6.25,5.5.5,9.75,2,12.75L310,297.5s8.75-2.25,8,6c0,0-7.5,1.25-10.5,2.75s-8.75,4-10.25,10.25a95,95,0,0,0-2,11s4.75,6.25,24.5,8,25.25,0,25.25,0,2.75,7,6.75,7.5,10.75-1.75,10.75-1.75l1.75,1.82h7s2.5,1.05,2.5,5v6.06h5.78c.52,1.41,1,2.74,1.35,3.76C382,361.25,382.38,384.62,382.38,384.62Z M342.62,45.85v7.77s-3.74,3.76-4.24,4.13,0,7.13,0,7.13l-1.63.37L336,68.5l-2.25,2.25V76.5l-1.37,2.25-.63,11.5s-4.87,3.25-5.13,3.63.13,15.37.26,19.12,2.74,4.75,2.74,4.75l-.24,4.63s-5.88,4.5-7.5,10.37,1.12,16.37,1.37,21.13,1.65,19,1.65,19l-9.52,7.87h-8.56a51.15,51.15,0,0,1-6.2-3.13c-2.87-1.74-10.37-5-10.37-5l4.87-8.74h2a13.26,13.26,0,0,0-.24-5.5c-.76-3.63-3.63-8.38-5.5-12.13s-2.5-7.63-2.63-13.25,2.75-12.75,3.63-15.75,1.74-1.13,2.12-2.13-.12-2.5,0-3.74,4.75-11.76,5.38-13.63,2.37-.25,3.24-1.5.13-2.5,0-5.5,1.26-4,2.63-9.87,4.5-11.26,6.87-15,7.26-10,8.13-12.5,1.13-6.76,1.13-10.13,3-7.24,3-7.24C328.37,38.62,335.09,42.3,342.62,45.85Z"
                      
                      
                      onClick={() => setSelectedRegion("Qo`ng`irot tumani")}
                      onMouseEnter={() => setHoveredRegion("Qo`ng`irot tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Mo`ynoq tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Mo`ynoq tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Mo`ynoq tumani")}
                      onMouseEnter={() => setHoveredRegion("Mo`ynoq tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M572.88,232.12c0,4-.13,10.5-1.76,14.26s-2,8.12-2.12,13-.38,11.37-2.25,12.87-5.75.75-7,3,.5,6.87-1.13,8.75-5.5,1.5-5.5,1.5-.62,6.12-1.62,7.75-3.75,2.75-4.75,5.5-1.63,4.75-1.75,5.13a10.38,10.38,0,0,1-6.11,2.87c-2.89.13-28.51-.63-28.51-.63s-4.13-2.12-6.26,0-4.37,6.13-6.12,6.63-6.38,0-6.38,0l-4-1.25-11.74,2.88s-3.63,7.24-6.63,7.62-9-1.12-9-1.12l-4.37,4.62L449,328.62s-.62-5-2.25-4.62-1.5,3.62-1.5,3.62l-3.5-.87-1,1.87-2.63.87v4.13c-3.53-3.75-5.78-2.17-7.77-1.17a7.39,7.39,0,0,1-1,.43c-2.26.74-8.28.74-8.13,0,1.13-5.5-2-6.38-2-6.38s-3-.25-6.54-.88-8.09-1-11,0a46.33,46.33,0,0,1-8.25,1.5s-.38,1.88-1.5,6.5a7.9,7.9,0,0,1-5,5.76V343c-4-.5-8.88.88-9.5,2.75-.43,1.31.84,5.07,2,8.37h-5.78v-6.06c0-3.94-2.5-5-2.5-5h-7l-1.75-1.82s-6.75,2.25-10.75,1.75-6.75-7.5-6.75-7.5-5.5,1.75-25.25,0-24.5-8-24.5-8a95,95,0,0,1,2-11c1.5-6.25,7.25-8.75,10.25-10.25S318,303.5,318,303.5c.75-8.25-8-6-8-6L300.75,279c-1.5-3-2.75-3.5-2-12.75s6.25-5.5,6.25-5.5V255c0-2.75-4.75-8.25-4.75-11.25v-21.5c0-4.25-6.5-12.5-7.5-15.25s0-11.25,0-13.5a32.65,32.65,0,0,0-2.5-10c-1-1.75,0-10.88,0-10.88s7.5,3.26,10.37,5a51.15,51.15,0,0,0,6.2,3.13h8.56l9.52-7.87s-1.4-14.26-1.65-19-3-15.26-1.37-21.13,7.5-10.37,7.5-10.37l.24-4.63s-2.62-1-2.74-4.75-.5-18.75-.26-19.12,5.13-3.63,5.13-3.63l.63-11.5,1.37-2.25V70.75L336,68.5l.75-3.25,1.63-.37s-.5-6.76,0-7.13,4.24-4.13,4.24-4.13V45.85a197.51,197.51,0,0,0,21.71,8.82c14.34,4.66,34.5,15.83,39.34,20.33s107.66,90.67,114.16,95.5,34,26.17,37.17,30.5c1.94,2.65,12.4,10.59,20.25,16.37C575.43,217.5,572.88,228.12,572.88,232.12Z"
                     
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Shumanag tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Shumanag tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Shumanag tumani")}
                      onMouseEnter={() => setHoveredRegion("Shumanag tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M384.44,440.69a12.86,12.86,0,0,0-2.56-2.07c-2-.87-5.38,2.5-8.26,2.88s-10.5-2.88-13.37-3.75S348.75,425,345,420.88c-2.72-3-9.5-10.38-13-14.22,0,0,3.41.09,4.41-1.66a17.78,17.78,0,0,0,1.5-4.75s5.74.25,6.74.87c.77.48,3.61,2.69,6,2.84,0,0,3.25,7.92,3.49,8.29s5.5-.25,7.63.63S372,418.62,372,418.62v7.76l4.5,2.24V431s1,0,2.38.21c2.38.32,5.82,1.08,6.62,2.91C386.71,436.9,384.59,440.44,384.44,440.69Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Taxtako`pir tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Taxtako`pir tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Taxtako`pir tumani")}
                      onMouseEnter={() =>
                        setHoveredRegion("Taxtako`pir tumani")
                      }
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M714.5,332.83s-17.72,29.09-33.13,54.49l-4.49-6.07-48.13-20.13-5.24,9.63-30.39-16.63-36.74,8.32s-25.26,41.81-25.5,47.44,2.87,25.24,3.5,28.24,4.62,10,4.62,10-.14,4.87-.1,9.26L490.5,428s-3.62-7.75-.88-15.25,13.76-14.13,13.76-14.13-1.38-4-7.38-3.87l-3.62-9.87-3.79-1L485.12,388l-5.24-6.12-1-14.5s-3-2-3-10.63,1.37-12.13,1.37-12.13l-.5-6.7,3.37-5.42,4-3-1.37-6.38,4.37-5.24.5-6.38,4,1.25s4.63.5,6.38,0,4-4.5,6.12-6.63,6.26,0,6.26,0,25.62.76,28.51.63a10.38,10.38,0,0,0,6.11-2.87c.12-.38.75-2.38,1.75-5.13s3.75-3.87,4.75-5.5,1.62-7.75,1.62-7.75,3.88.38,5.5-1.5-.12-6.5,1.13-8.75,5.13-1.5,7-3,2.13-8,2.25-12.87.5-9.26,2.12-13,1.76-10.26,1.76-14.26,2.55-14.62,2.37-14.75c5,3.66,8.92,6.46,8.92,6.46L656.83,312l27-4.33,9.34,15.66Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Amudaryo tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Amudaryo tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Amudaryo tumani")}
                      onMouseEnter={() => setHoveredRegion("Amudaryo tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M520.6,498.82c-1.07,1.61-1.72,2.8-1.72,2.8l-3.48,7.47a3.4,3.4,0,0,0-1.57-2.09c-1.83-1.33-3.83,1.67-7,1.67s-3-4.67-4.83-4.84-.17,1.5-.83,2.84-2-.5-3.67-.17.67,1.5-.33,3.67-1.67.33-3.34.83-.66,2.17-2.83,2.5-1-3-3-3.33-1.87,2.83-2.21,4.66,4.34,3.5,1,6.84c-1.5,1-1.16-1.5-3-2.17s-8,5.67-8,5.67c-1.75-2.5-7.45-1.79-10.95-6.92a4.55,4.55,0,0,0-4.5-2.75c-1.63,0-3-2.25-3.26-4.75s6.26-.37,7.76-2.37-2.38-6-2.38-6l.12-5.63s-.5-.63-2.37-3.13-.5-4.87,2.37-4.74,4,0,4.5-3-4.74-4.88-7.62-6a5.84,5.84,0,0,1-.76-.36s-.62-8.14,3.51-9.64,10,1.57,17.52-.55c4.92,2.44,12,3.75,16.73,6.79,5.25,3.38,7.62,15.13,10.12,19.5S520.6,498.82,520.6,498.82Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Nukus tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Nukus tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Nukus tumani")}
                      onMouseEnter={() => setHoveredRegion("Nukus tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M446.5,442.88c.5,3.74-5.25,10.74-5.25,10.74-6.63,1-9-.24-9-.18s-3.63-6.69-3.63-6.69-4,5.13-6.62,3-.88-6.5-3.12-8-11.88,0-11.88,0L405.38,436H401.5l-1.62-2.38H397l-.74-2.83a4.28,4.28,0,0,0,1.62-2.17c1.5-3.74-2.63-8-2.38-14.5s-6.79-11.62-7-15.62a27.61,27.61,0,0,0-.66-5.75l2.37,1.13,3.87,6.74a38.57,38.57,0,0,1,4.08.88c.46.25,3.92,2.46,3.92,2.46a2.66,2.66,0,0,1,3.38-1.08c2.12,1,2.25,5.37,2.25,5.37a5.57,5.57,0,0,0,5-2.37l1.75,4.87H418c7.75,9,12.25,22,12.25,22a54.61,54.61,0,0,1,9.75-6.5c5.25-2.63,6.53,1.75,6.53,1.75s-4.78,2.25-5.28,4.5S446,439.12,446.5,442.88Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Xo`jayli tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Xo`jayli tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Xo`jayli tumani")}
                      onMouseEnter={() => setHoveredRegion("Xo`jayli tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M432.2,453.4c0,0-3.6-6.7-3.6-6.7s-4,5.1-6.6,3s-0.9-6.5-3.1-8s-11.9,0-11.9,0l-1.6-5.8h-3.9  l-1.6-2.4H397l-0.7-2.8c-1.5,0.9-3.5,0.1-5.3-0.7c-2.5-1.1-5.9-5.2-5.9-5.2l-5.4,2.6l-0.9,3.7c2.4,0.3,5.8,1.1,6.6,2.9  c1.2,2.8-0.9,6.3-1.1,6.6c3.4,3.3,8.7,9.4,8.6,11.4c-0.1,1.8-0.5,3.5-1.1,5.1c0,0,10.6,11.8,11,11.8s3,3.8,3,3.8l29.9-1.6  c2.4-5.6,4.6-11.2,5.1-17.5C434.5,454.6,432.3,453.4,432.2,453.4z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Taxiatosh tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Taxiatosh tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Taxiatosh tumani")}
                      onMouseEnter={() => setHoveredRegion("Taxiatosh tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M478.2,468.5c-4.9-3-8.8-3.3-13.2-6.4s-6.2-3.9-10.5-5s-6.6-4.5-13.2-3.5c-0.1,0-0.2,0-0.4,0  c-0.5,6.2-2.7,11.9-5.1,17.5l0.2,0c0,0,6.1,3,6.6,2.6c1.2-1.5,2.3-3,3.3-4.6c0,0,6.7,2,7.6,4.3c1,2.6,2.9,4.7,5.2,6.1  c0,0-0.6-8.1,3.5-9.6c4.1-1.5,10,1.6,17.5-0.5C479.2,469.1,478.7,468.8,478.2,468.5z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Beruniy tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Beruniy tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Beruniy tumani")}
                      onMouseEnter={() => setHoveredRegion("Beruniy tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M622,453.12c1.12,1.63,1.25,6.63,1.5,12.63s-5.62,14-12.75,21.13-5.37,7.74-6.5,9.5-29.5.62-33,1.62-5,9-5,9-1.87-3.5-4.5-3.88-6.87,6.88-6.87,6.88-5-.38-6.38,0-1.75,4.88,0,7.5,1.25,1.75,6.88,2.38,2.87,6.12.37,9.5-1.63,8,0,9.5,3.63-3.13,5.25-2.76-.5,4,0,5.88,4.26,7.38,4.26,7.38a4.89,4.89,0,0,0-.51,1.87c-.25,4.75,8.75,15,9,17a24.06,24.06,0,0,1,0,4.5s-3.25.25-4.5,1.5a51.73,51.73,0,0,0-3.54,4.43,8.58,8.58,0,0,0-1.54-3c-1.17-1.34-2.34,1.5-4,1.5s-1.5-2.34-4.17-4.67-4.83-1.67-6.5-2.67-.17-3.5-2.67-7.16-5.16-.84-6.83-2.34.83-4.83,0-6.5-2.67,0-5.67-2,0-4.33-2.83-9.5-8.12-1.21-9.29-4,.46-2.62.62-5-.66-1.83-2.16-2.5-1-2-3-5.33-.34-4.33-1-6.67a20.64,20.64,0,0,1-1-6.33,24.49,24.49,0,0,0-.27-3.41l3.48-7.47s.65-1.19,1.72-2.8a32.5,32.5,0,0,1,4.15-5.07c3.37-3.25,2.87-5.37,4.5-10.25s6.37-6.5,8.75-10,1.25-7.5,1-12.12c-.06-1.15-.09-2.55-.1-4,0-4.39.1-9.26.1-9.26s-4-7-4.62-10-3.76-22.62-3.5-28.24,25.5-47.44,25.5-47.44l36.74-8.32,30.39,16.63c.13,3.13-5.63,9-7.13,11.75s.62,5.5-.76,8.25-3.87,7.87-.87,16.37.13,21.26,2,27.38S619,451.38,619,451.38A4.28,4.28,0,0,1,622,453.12Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Ellik qal`a tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Ellik qal`a tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Ellik qal`a tumani")}
                      onMouseEnter={() =>
                        setHoveredRegion("Ellik qal`a tumani")
                      }
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M654.5,472.17l7.17,18.66a5.11,5.11,0,0,1-3.92,2.67c-2.75.25-8.75-2-11.5,0s-6.75,7.25-11.75,7.75-11-3-15.25-1.75S612,505,597,502.75c0,0,3.5,5.25,0,6.5s-16.5-2.75-16.5-2.75.75,7.5,0,10.75-5,9.5-5,9.5,2,10.75,0,13.25c-1.73,2.16-8.33,5.45-10.24,9.38,0,0-3.76-5.5-4.26-7.38s1.62-5.5,0-5.88-3.62,4.26-5.25,2.76-2.5-6.13,0-9.5,5.25-8.88-.37-9.5-5.13.24-6.88-2.38-1.38-7.12,0-7.5,6.38,0,6.38,0,4.24-7.25,6.87-6.88,4.5,3.88,4.5,3.88,1.5-8,5-9,31.87.12,33-1.62-.63-2.38,6.5-9.5,13-15.13,12.75-21.13-.38-11-1.5-12.63a4.28,4.28,0,0,0-3-1.74s-.38-10.76-2.25-16.88,1-18.88-2-27.38-.5-13.62.87-16.37-.74-5.5.76-8.25,7.26-8.62,7.13-11.75l5.24-9.63,48.13,20.13,4.49,6.07c-11.83,19.49-22.3,36.82-22.37,37.18C653,442.83,654.5,472.17,654.5,472.17Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "To`rtko`l tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "To`rtko`l tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("To`rtko`l tumani")}
                      onMouseEnter={() => setHoveredRegion("To`rtko`l tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M701.5,627.5l-27.67,13.33c-.66.34-34.66-41-34.66-41l-5.5-3.83-28.5-2-7.34,5.33a66.23,66.23,0,0,1-2,7.5,4.12,4.12,0,0,0,1.34,4.5,1.92,1.92,0,0,1,0,2.84c-1.5,1.33-3.5-3.17-5.5-3.67a6.33,6.33,0,0,1-4.67-4.67c-.5-2.5,1.5-5.16,1.17-8.33s-3.5-2.67-6.67-3.5-3.67-2.5-6-4.83-2.5,0-4.33-.17-4.34-6.33-4.84-8.17c-.19-.71-.39-1.44-.62-2.15a51.73,51.73,0,0,1,3.54-4.43c1.25-1.25,4.5-1.5,4.5-1.5a24.06,24.06,0,0,0,0-4.5c-.25-2-9.25-12.25-9-17a4.89,4.89,0,0,1,.51-1.87c1.91-3.93,8.51-7.22,10.24-9.38,2-2.5,0-13.25,0-13.25s4.25-6.25,5-9.5,0-10.75,0-10.75,13,4,16.5,2.75,0-6.5,0-6.5c15,2.25,18-2,22.25-3.25s10.25,2.25,15.25,1.75,9-5.75,11.75-7.75,8.75.25,11.5,0a5.11,5.11,0,0,0,3.92-2.67l4.16,7s-30.16,16-30.83,16.5,9.5,19.34,11,23,18,26.5,20.17,30.17Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Qorao`zak tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Qorao`zak tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Qorao`zak tumani")}
                      onMouseEnter={() => setHoveredRegion("Qorao`zak tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      
                      d="M538,473.5c-2.38,3.5-7.12,5.12-8.75,10s-1.13,7-4.5,10.25a32.5,32.5,0,0,0-4.15,5.07s-11.48,1.18-14-3.2-4.87-16.12-10.12-19.5c-4.74-3-11.81-4.35-16.73-6.79-.53-.26-1-.54-1.52-.83-4.87-3-8.75-3.25-13.25-6.38s-6.25-3.87-10.5-5-6.62-4.5-13.25-3.5c0,0,5.75-7,5.25-10.74s-5.75-8.13-5.25-10.38,5.28-4.5,5.28-4.5l12.18-1.75s4.41-9.75,5.67-12.37-1.13-6.63-1.13-6.63L457,409.12s0-8.24-4.38-11c0,0,1.38-1.37,3.13-6.37s-.75-8.63-1.31-12,2.44-2.87,5.06-3,2-4.13,1.25-6.5-5-1-7-1.5-3.87-3.5-4.87-5.75-.88-20.62-.88-20.62l-9.88-8.76v-4.13l2.63-.87,1-1.87,3.5.87s-.13-3.24,1.5-3.62,2.25,4.62,2.25,4.62l6.88-3.12,4.37-4.62s6,1.5,9,1.12,6.63-7.62,6.63-7.62l11.74-2.88-.5,6.38-4.37,5.24,1.37,6.38-4,3-3.37,5.42.5,6.7s-1.37,3.5-1.37,12.13,3,10.63,3,10.63l1,14.5,5.24,6.12,3.47-4.12,3.79,1,3.62,9.87c6-.13,7.38,3.87,7.38,3.87s-11,6.63-13.76,14.13.88,15.25.88,15.25l48.4,29.38c0,1.45,0,2.85.1,4C539.25,466,540.38,470,538,473.5Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Chimboy tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Chimboy tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Chimboy tumani")}
                      onMouseEnter={() => setHoveredRegion("Chimboy tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M459.5,376.75c-2.62.13-5.62-.37-5.06,3s3.06,7,1.31,12-3.13,6.37-3.13,6.37c-4.37-2.74-12.37,4.63-12.37,4.63h-4.5a8.54,8.54,0,0,0-3.25-6c-3.25-2.75-8,.63-10-2s-1.26-10.87-1.26-10.87-8-6.5-9.63-11.88,2.76-6.38,3.5-7.25.13-3.25.13-3.25a38.11,38.11,0,0,0,3.87,0c1.5-.12,4.63-2.5,4.63-2.5a4.1,4.1,0,0,0,3.13,1.38,42.4,42.4,0,0,1,4.3,0,10.62,10.62,0,0,1-2.06-4.88c-.12-2.38,2.76-4.5,2.88-4.88a15.06,15.06,0,0,0-.82-3s-2.18-.74-2.56-4,5.13-3.5,5.13-3.5l-2.87-3.62,1.74-.62-2.27-3.43c2-1,4.24-2.58,7.77,1.17l9.88,8.76s-.12,18.37.88,20.62,2.87,5.25,4.87,5.75,6.25-.87,7,1.5S462.12,376.62,459.5,376.75Z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Bo`zatov tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Bo`zatov tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Bo`zatov tumani")}
                      onMouseEnter={() => setHoveredRegion("Bo`zatov tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M410,390c0-1-2-2-1-3c2-3,4-4,7-3c-3.4-2.6-3.2-5.1-2.4-8.3c-0.8-1.2-1.5-2.5-1.9-3.7  c-1.6-5.4,2.7-6.4,3.5-7.2s0.1-3.2,0.1-3.2c1.3,0.1,2.6,0.1,3.9,0c1.5-0.1,4.6-2.5,4.6-2.5c0.8,0.9,1.9,1.4,3.1,1.4  c1.4-0.1,2.9-0.1,4.3,0c-1.1-1.4-1.8-3.1-2.1-4.9c-0.1-2.4,2.8-4.5,2.9-4.9c-0.2-1-0.4-2-0.8-3c0,0-2.2-0.8-2.6-4s5.1-3.5,5.1-3.5  l-2.9-3.6l1.7-0.6l-2.3-3.4c-0.3,0.2-0.7,0.3-1,0.4c-2.3,0.7-8.3,0.7-8.1,0c1.1-5.5-2-6.4-2-6.4s-3-0.3-6.5-0.9c-3.6-0.6-8.1-1-11,0  c-2.7,0.7-5.5,1.3-8.2,1.5c0,0-0.4,1.9-1.5,6.5c-0.6,2.7-2.5,4.8-5,5.8v3.6c-4-0.5-8.9,0.9-9.5,2.8c-0.5,1.3,0.8,5.1,2,8.4  c0.5,1.4,1,2.8,1.3,3.8c1.1,3.4,1.5,26.7,1.5,26.7c0.2,4.5,5.5,8.1,5.5,8.1l2.4,1.1l3.9,6.7c1.4,0.2,2.7,0.5,4.1,0.9  c0.5,0.2,3.9,2.5,3.9,2.5c0.7-1.2,2.1-1.6,3.4-1.1c2.1,1,2.2,5.4,2.2,5.4c1.1,0.1,2.2-0.2,3.1-0.7C409.2,401.7,412.9,395.9,410,390z  "
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Kegeyli tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Kegeyli tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Kegeyli tumani")}
                      onMouseEnter={() => setHoveredRegion("Kegeyli tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M463.4,407.2l-6.2,1.9c0,0,0-8.3-4.4-11s-12.4,4.6-12.4,4.6h-4.5c-0.2-2.4-1.4-4.5-3.2-6  c-3.3-2.8-8,0.6-10-2c-2-2.6-1.3-10.9-1.3-10.9s-4.8-3.9-7.8-8.2c-0.8,3.2-1,5.8,2.4,8.3c-3-1-5,0-7,3c-1,1,1,2,1,3  c2.9,5.9-0.8,11.7,0.9,17.6c0.7-0.4,1.4-1,1.9-1.7l1.8,4.9h3.5c7.8,9,12.2,22,12.2,22c3-2.5,6.3-4.7,9.8-6.5  c5.2-2.6,6.5,1.8,6.5,1.8l12.2-1.8c0,0,4.4-9.8,5.7-12.4C465.6,411.2,463.4,407.2,463.4,407.2z"
                      
                    ></path>
                    <path
                      data-v-463741c6=""
                      className={cn(
                        "fill-[#fcefe5] stroke-[#570709] ",
                        selectedRegion === "Qanliko`l tumani"
                          ? "fill-[url(#regionGradient)]"
                          : "fill-[#fcefe5]",
                        hoveredRegion === "Qanliko`l tumani"
                          ? "fill-[url(#regionGradient-hover)]"
                          : ""
                      )}
                      onClick={() => setSelectedRegion("Qanliko`l tumani")}
                      onMouseEnter={() => setHoveredRegion("Qanliko`l tumani")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      d="M397.88,428.62a4.28,4.28,0,0,1-1.62,2.17c-1.53.93-3.49.13-5.26-.67-2.5-1.12-5.88-5.24-5.88-5.24l-5.37,2.62-.87,3.71c-1.36-.18-2.38-.21-2.38-.21v-2.38l-4.5-2.24v-7.76s-8.12-4.87-10.25-5.74-7.37-.26-7.63-.63-3.49-8.29-3.49-8.29a2.89,2.89,0,0,0,2-.5c2.5-1.84,1.26-8.21,1.26-8.21s4.87-1.75,6.74,0,9.88,2.63,9.88,2.63.5-4.88,2.62-7.26,9.26-6,9.26-6c.24,4.5,5.5,8.13,5.5,8.13a27.61,27.61,0,0,1,.66,5.75c.17,4,7.21,9.12,7,15.62S399.38,424.88,397.88,428.62Z"
                      
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
          </div>
     
          <div className="w-full flex justify-center ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:w-full max-w-[1024px] w-full place-items-center ">
  {[
    { value: "100", label: tfourth("statistic.first") },
    { value: "80", label: tfourth("statistic.second") },
    { value: "300", label: tfourth("statistic.third") },
  ].map((item, index, array) => (
    <div
      key={index}
      className={`rounded-[14px] px-5 py-4 bg-[#f6f6f6] flex flex-col items-center text-center w-full ${
        array.length === 1 ? "max-w-full" : "max-w-[325px]"
      }`}
    >
      <p className="font-bold text-[36px] leading-[122%] bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent res-title">
        {item.value}
      </p>
      <span className="font-medium text-[18px] leading-[133%] text-[#242b3a] res-description">
        {item.label}
      </span>
    </div>
  ))}
</div>


</div>

        </div>
      </div>
    </div>
  );
};

export default QoraqalpogistonMap;
