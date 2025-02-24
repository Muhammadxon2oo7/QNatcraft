"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"
import { badgeVariants } from "@/components/ui/badge"
import Link from "next/link";
import { Dot } from "@/components/dot/Dot";
import { Arrow } from "./../../public/img/Arrow";
import Video from 'next-video';
import myVideo from '@/../videos/natcraft.mp4'
import PotteryStory from "@/components/pottery-story/pottery-story";
import AnimatedTimeline from "@/components/animated-timeline/animated-timeline";
import Map from "@/components/map/map";
import { useEffect, useState } from "react";
import { log } from "console";
import { cn } from "@/lib/utils";
import CustomSwiper from "@/components/Swiper/Swiper";
import ProfileCard from "@/components/Swiper/Card";
import { Card } from "@/components/ui/card"
import { Phone } from "./../../public/img/phone";
import { Mail } from "./../../public/img/mail";
import { Location } from "./../../public/img/location";
import { Telegram } from "./../../public/img/telegram";
import { Instagram } from "./../../public/img/instagram";
import { Feacebook } from "./../../public/img/feacebook";
import { Youtube } from "./../../public/img/youtube";
import { Footer } from "@/components/footer/Footer";
import { useTranslations } from "next-intl";
import { Banner } from "@/components/Banner/Banner";

const TypeofCrafts = {
  zargarlik: {
    name: 'Zargarlik',
    imgs:[
      '/img/video.jpg',
      '/img/second_craft.png'
    ],
    title: 'O’zbekistonda zargarlik san’ati',
    dec: "Oʻzbekistonda qadimgi zargarlik sanʼati boy tarixga ega bo'lib, xalq hunarmandchiligida alohida o‘rin egallaydi. Bu sanʼat asrlar davomida rivojlanib, boy madaniy merosning muhim qismi bo‘lib kelgan.",
    types: [
      {
        name: 'Zargarlik buyumlari turlari',
        type: [
          { name: 'Bilaguzuklar', dec: 'Keng va murakkab naqshli bilak taqinchoqlari mashhur.' },
          { name: 'Marjonlar', dec: 'Qimmatbaho toshlar va metallar bilan bezatilgan marjonlar.' },
          { name: 'Halqalar va uzuklar', dec: 'Nozik naqshlar va turli shakllarda ishlangan uzuklar.' },
          { name: 'Tilla do‘ppilar', dec: 'Ayollar uchun naqshli, tilla bilan ishlangan bosh kiyimlar.' },
          { name: 'Bezakli kamarlar', dec: 'Kumush va tilladan ishlangan, nozik naqsh bilan bezatilgan kamarlar.' }
        ]
      },
      {
        name: 'Texnikalar',
        type: [
          { name: 'Gravyur (o‘yma)', dec: 'Metallar ustiga murakkab naqsh tushirish' },
          { name: 'Chizma texnikasi', dec: 'Yaltiroq sirt ustida shakllar yaratish' },
          { name: 'Mixlash', dec: 'Qimmatbaho toshlarni metallga joylashtirish texnikasi.' }
        ]
      }
    ]
  },
  kulolchilik: {
    name: 'Kulolchilik',
    imgs:[
'/img/third_img.png',
      '/img/timeline-one.png',
    ],
    title: 'O’zbekistonda kulolchilik san’ati',
    dec: "Oʻzbek kulolchilik sanʼati ko‘p asrlik tarixga ega bo‘lib, bu sanʼat shakllari va uslublari turli mintaqalarda o‘ziga xosliklar bilan ajralib turadi.",
    types: [
      {
        name: 'Kulolchilik buyumlari',
        type: [
          { name: 'Choynaklar', dec: 'An’anaviy va zamonaviy dizayndagi choynaklar.' },
          { name: 'Idishlar', dec: 'Turli funktsiyalar uchun ishlatiladigan keramika idishlar.' },
          { name: 'Heykellar', dec: 'San’at asari sifatida ishlangan baland heykellar.' },
          { name: 'Sahifalar', dec: 'Kulolchilik san’ati yordamida ishlab chiqarilgan sahifalar.' }
        ]
      },
      {
        name: 'Texnikalar',
        type: [
          { name: 'Savatsozlik', dec: 'O‘rgimchak to‘ridan foydalanib, keramika buyumlarini yaratish.' },
          { name: 'Qumlash', dec: 'Keramika buyumlarini dastlabki shaklga keltirish texnikasi.' },
          { name: 'Ishlab chiqarish', dec: 'Keramika mahsulotlarini yuksak sifatda ishlab chiqarish usuli.' }
        ]
      }
    ]
  },
  duradgorlik: {
    name: 'Duradgorlik',
    imgs:[
      '/img/timeline-three.png',
      '/img/timeline-two.png',
    ],
    title: 'O’zbekistonda duradgorlik san’ati',
    dec: "Duradgorlik san’ati asrlar davomida o'zining nafisligi va mustahkamligi bilan mashhur. U nafaqat amaliy, balki estetik jihatdan ham alohida ahamiyatga ega.",
    types: [
      {
        name: 'Duradgorlik buyumlari',
        type: [
          { name: 'Eski yerto‘llar', dec: 'Antik uslubdagi va zamonaviy yerto‘llar.' },
          { name: 'Mebel', dec: 'Sifatli yog‘ochdan ishlangan mebel buyumlari.' },
          { name: 'Dastgohlar', dec: 'Har xil dastgohlar, asboblar va ularning qismlari.' },
          { name: 'Bezama', dec: 'Yog‘ochdan ishlangan murakkab naqshli bezaklar.' }
        ]
      },
      {
        name: 'Texnikalar',
        type: [
          { name: 'Tosh va yog‘ochni birlashtirish', dec: 'Yog‘och va toshni qo‘shib ishlash texnikasi.' },
          { name: 'Aralash usul', dec: 'Yog‘och, metall va boshqa materiallardan birlashtirish.' },
          { name: 'Kukuni o‘tkazish', dec: 'Tegishli kukunlar bilan yog‘ochni ushlash texnikasi.' }
        ]
      }
    ]
  },
  kiyim_kechak: {
    name: 'Kiyim-kechak',
    imgs:[
      '/img/third_img.png',
      '/img/timeline-one.png',
    ],
    title: 'O’zbekistonda kiyim-kechak san’ati',
    dec: "O'zbek kiyim-kechak san’ati turli mintaqalarda o‘ziga xos an’analar va zamonaviy trendlar bilan boyitilgan.",
    types: [
      {
        name: 'Kiyim turlari',
        type: [
          { name: 'Chapanlar', dec: 'An’anaviy va zamonaviy chapanlar.' },
          { name: 'Kasmalar', dec: 'Yorqin rangdagi kasmalar va turli naqshlar bilan bezatilgan kiyimlar.' },
          { name: 'Furushlar', dec: 'Furushlar va ularning nozik naqshlari.' },
          { name: 'Ayollar kiyimi', dec: 'Ayollar uchun mo‘ljallangan kiyimlar.' }
        ]
      },
      {
        name: 'Texnikalar',
        type: [
          { name: 'Kashtachilik', dec: 'Kiyimlarda murakkab naqshlar va chiroyli bezaklar ishlash.' },
          { name: 'Tizimli tikuv', dec: 'Mukammal tikuv texnikasi va ishlash jarayoni.' }
        ]
      }
    ]
  },
  kashtachilik: {
    name: 'Kashtachilik',
    imgs:[
      '/img/video.jpg',
      '/img/second_craft.png',
    ],
    title: 'O’zbekistonda kashtachilik san’ati',
    dec: "Kashtachilik san’ati O’zbekistonda qadimiy an’analarga ega bo‘lib, u ko‘plab zamonaviy kiyim-kechaklar va bezaklarda o‘z aksini topgan.",
    types: [
      {
        name: 'Kashtachilik buyumlari',
        type: [
          { name: 'Kashta naqshlari', dec: 'Turli ranglarda naqshlar va amaliy san’at buyumlari.' },
          { name: 'Yuzak naqshlari', dec: 'Zamonaviy kashtachilikda yuzak naqshlar ishlash.' },
          { name: 'Kashta bilan tikilgan kiyimlar', dec: 'Qiyin va murakkab kashta ishlovlari yordamida tayyorlangan kiyimlar.' }
        ]
      },
      {
        name: 'Texnikalar',
        type: [
          { name: 'Kashta tikish', dec: 'Nozik iplar va tasvirlarni yaratish texnikasi.' },
          { name: 'Qo‘lda kashta tikish', dec: 'Tashqi naqshlar va qismlarni qo‘lda tikish texnikasi.' }
        ]
      }
    ]
  }
}
type CraftType = keyof typeof TypeofCrafts;

export default function Home() {
  const tmain=useTranslations("home.mainSection")
  const tsecond=useTranslations("home.secondSection")
  const tthird=useTranslations("home.thirdSection")
  const tfourth=useTranslations("home.fourthSection")
  const tfifth=useTranslations("home.fifthSection")
  const tsixth=useTranslations("home.sixthSection")

  const [selectedCraft, setSelectedCraft] = useState<typeof TypeofCrafts[keyof typeof TypeofCrafts] | null>(null);
  useEffect(() => {
    if (!selectedCraft) {
      const firstCraftKey = Object.keys(TypeofCrafts)[0] as CraftType;
      setSelectedCraft(TypeofCrafts[firstCraftKey]);
    }
  }, [selectedCraft]);
  
  const handleCraftClick = (key: CraftType) => {
    setSelectedCraft(TypeofCrafts[key]);
  };
  function handleButtonClick(key: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
    <section className="max-w-[1380px] mx-auto section px-[10px]">
      <div className="flex justify-between flex-wrap gap-[10px] mb-[80px] section-title ">
        <div className="max-w-[635px] flex flex-wrap items-end">
        <Badge className="rounded-[24px] mb-[16px] bg-[#fcdbdb] cursor-pointer p-[10px_16px]  h-[36px] badge  gap-[10px] hover:bg-[#fcdbdb] inline-flex items-center" variant="secondary"><Dot/><p className="font-bold text-[16px] leading-none bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">QQRNATCRAFT</p></Badge>
        <h1 className="res-title font-custom font-extrabold text-[40px] leading-[130%] bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
        {tmain('title.first')} <br /> <span className="text-[#606266]">{tmain('title.second')}</span>
        </h1>
        </div>
        <div className="h-full">
          <p className="font-medium text-[20px] leading-[160%] text-gray-500 h-auto  mb-[24px] res-description">
          {tmain('description.p')}
          </p>
          <Button className="primary-bg rounded-[16px] p-[14px_20px] w-[240px] h-[52px] responsive-btn">
            <Link href={'/shop'} className="w-full flex justify-center items-center ">
              {tmain('description.button')} <Arrow/>
            </Link>
          </Button>
        </div>
      </div>
     
      <div >
      <Banner/>
      </div>
    </section>


    <section className="max-w-[1380px] px-[10px] mx-auto" id="madaniymeros">
    <div className="flex justify-between mb-[36px] section-title">
        <div>
        <Badge className="rounded-[24px] mb-[16px] bg-[#fcdbdb] hover:bg-[#fcdbdb] cursor-pointer p-[10px_16px] h-[36px]  gap-[10px] inline-flex items-center badge">
  <Dot/>
  <p className="font-sans  font-bold text-[16px] leading-none bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
    {tsecond('badge')}
  </p>
</Badge>

        <h1 className="font-sans font-bold text-[32px]  text-[#242b3a] res-title">
        {tsecond('title.first')}<br /> <span className="text-[#606266]">{tsecond('title.second')}</span>
        </h1>
        </div>
        <div className="overflow-hidden pr-[15px]">
          <p className="font-medium text-[20px]  h-full text-gray-500  mb-[24px] res-description overflow-wrap break-word ">
          {tsecond('description')}
          </p>
        </div>
      </div>
      <AnimatedTimeline/>
    </section>

    
    <section className="max-w-[1380px] px-[10px] mx-auto mb-[140px]" id="Hunarmandchilikturlari">
    <div className="flex justify-between mb-[36px]  section-title">
        <div>
        <Badge className="rounded-[24px] mb-[16px] bg-[#fcdbdb] hover:bg-[#fcdbdb] cursor-pointer p-[10px_16px] inline-flex h-[36px]  gap-[10px] badge" variant="secondary"><Dot/><p className="font-sans font-bold text-[16px] leading-none bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">{tthird('badge')}</p></Badge>
        <h1 className="font-sans font-bold text-[32px] leading-[131%] text-[#242b3a] res-title">
        {tthird('title')}
        </h1>
        </div>
        <div>
          <p className="font-medium text-[20px] leading-[160%] text-gray-500 w-[525px] mb-[24px] res-description overflow-wrap break-word ">
          {tthird('description')}
          </p>
        </div>
      </div>


      <div className="flex flex-wrap md:flex-nowrap gap-[20px]">
        <div className="md:w-[210px]  flex md:flex-wrap md:h-[90%] 
          gap-[20px] max-h-[560px] overflow-x-scroll no-scrollbar py-[5px] ">
      {Object.entries(TypeofCrafts).map(([key, item]) => (
        <Button
          className={cn(
            "md:rounded-[24px] md:w-full md:h-[96px] bg-[#f6f6f6] hover:bg-[#f6f6f6] responsive-btn text-[#242b3a]",
            selectedCraft === TypeofCrafts[key as CraftType]?'primary-bg text-white':''
          )}
          key={key}
          onClick={() => handleCraftClick(key as CraftType)} 
        >
        <p
  style={{ fontSize: "clamp(1rem, 1.5vw, 2.5rem)", lineHeight: "133%" }}
  className="font-semibold"
>
  {item.name}
</p>


        </Button>
      ))}
    </div>

    <div className="rounded-[24px]  bg-[#fcdbdb] hover:bg-[#fcdbdb] flex flex-grow flex-wrap max-w-[1130px] p-[36px]">
      {selectedCraft ? (
        <>
          <div className="flex flex-wrap gap-[33px]">
          <div className="max-w-[613px]">
          <h2
  style={{ fontSize: "clamp(1.5rem, 2vw, 2.5rem)", lineHeight: "133%" }}
  className="font-semibold text-[#242b3a] mb-[12px]"
>
  {selectedCraft.title}
</h2>

<p
  style={{ fontSize: "clamp(1rem, 1.5vw, 1.5rem)", lineHeight: "133%" }}
  className="font-normal text-[#242b3a] mb-[40px]"
>
  {selectedCraft.dec}
</p>

          
<ul>
  {selectedCraft.types.map((type: any, index: number) => (
    <li
      key={index}
      style={{ fontSize: "clamp(1rem, 1.8vw, 1.125rem)", lineHeight: "133%" }}
      className="text-[#242b3a] font-semibold mb-[30px]"
    >
      <strong>{type.name}:</strong>
      <ul className="pl-[20px]">
        {type.type.map((subType: any, idx: number) => (
          <li key={idx} className="list-disc">
            <p
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", lineHeight: "133%" }}
              className="text-[#242b3a] font-semibold"
            >
              {subType.name} -  
              <span className="font-normal">{subType.dec}</span>
            </p>
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>

          </div>
          <div className="flex flex-wrap gap-[16px] max-w-[412px] justify-center md:justify-normal">
  {selectedCraft.imgs.map((item, index) => (
    <img
      key={index}
      className="w-full sm:w-[clamp(300px, 80vw, 412px)] h-[clamp(200px, 50vw, 274px)] rounded-[27px]"
      src={item}
      alt=""
    />
  ))}
</div>

          </div>
        </>
      ) : (
        <p>Select a craft to see details.</p>
      )}
    </div>
      </div>


    </section>





    
    <section className="max-w-[1380px] px-[10px] mx-auto" id="xarita">
    <div className="flex justify-between mb-[36px] section-title">
        <div>
        <Badge className="rounded-[24px] mb-[16px] bg-[#fcdbdb] hover:bg-[#fcdbdb] cursor-pointer p-[10px_16px]  h-[36px] inline-flex gap-[10px] badge " variant="secondary"><Dot/><p className="font-sans font-bold text-[16px] leading-none bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">{tfourth('badge')}</p></Badge>
        <h1 className="font-sans font-bold text-[32px] text-[#242b3a] res-title">
        {tfourth('title')}
        </h1>
        </div>
        <div className="overflow-hidden pr-[15px]">
          <p className="font-medium text-[20px]  h-full text-gray-500  mb-[24px] res-description overflow-wrap break-word ">
          {tfourth('description')}
          </p>
        </div>
      </div>
      <Map/>
    </section>

    <section className="md:mb-[140px] mg-[80px]">
    <div className="max-w-[1360px] mx-auto flex justify-between mb-[36px] section-title px-[10px]">
        <div>
        <Badge className="rounded-[24px] mb-[16px] bg-[#fcdbdb] hover:bg-[#fcdbdb] cursor-pointer p-[10px_16px] h-[36px] inline-flex gap-[10px]  badge" variant="secondary"><Dot/><p className="font-sans font-bold text-[16px] leading-none bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">{tfifth('badge')}</p></Badge>
        <h1 className="font-sans font-bold text-[32px] text-[#242b3a] res-title">
        {tfifth('title')}
        </h1>
        </div>
        <div className="overflow-hidden pr-[15px]">
          <p className="font-medium text-[20px]  h-full text-gray-500  mb-[24px] res-description overflow-wrap break-word">
          {tfifth('description')}
          </p>
        </div>
      </div>

      <div className="w-full  h-auto">
        <CustomSwiper/>
      </div>
    
    </section>

    <section className="max-w-[1360px] mx-auto mb-[140px] " id="aboutus">
    <div className="flex justify-between mb-[36px]">
        <div>
        <Badge className="rounded-[24px] mb-[16px] bg-[#fcdbdb] hover:bg-[#fcdbdb] cursor-pointer p-[10px_16px]  h-[36px] inline-flex gap-[10px] " variant="secondary"><Dot/><p className="font-sans font-bold text-[16px] leading-none bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">{tsixth('badge')}</p></Badge>
        <h1 className="font-sans font-bold text-[32px] leading-[131%] text-[#242b3a]">
        {tsixth('title')}
        </h1>
        </div>
        <div>
          <p className="font-medium text-[20px] leading-[160%] text-gray-500 w-[525px] mb-[24px]">
          {tsixth('description')}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-wrap gap-[20px] ">
        <div className="rounded-[24px] w-[670px] h-[480px] bg-[#f6f6f6] pt-[35px] pl-[46px] flex ">
          <Image
            src='/img/man.png'
            alt="img"
            width={100}
            height={100}
            className="w-[383px] h-[445px]"
          />
          <div className="w-[294px] translate-x-[-88px] mt-[60px] ">
            <p className="font-bold text-2xl leading-[133%] bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
            Jamshidkhon Imomov
            </p>
            <p className="font-bold text-base leading-[1.37] text-[#242b3a]">
            Asoschi & CEO
            </p>
            <p className="font-normal text-base leading-[1.37] text-[#606266] w-[294px]">
            Bizning asoschimiz Jamshidkhon Imomov, kompaniya boshqaruviga rahbarlik qilib, innovatsion yondashuvlarni qo'llab-quvvatlaydi.
            </p>
          </div>
        </div>
        <div className="flex flex-grow flex-wrap gap-[20px] max-w-[670px]">
          <div className="w-full rounded-[24px]  h-[230px] bg-[#f6f6f6] p-[24px]">
            <p className="font-bold text-base leading-[1.37] text-[#242b3a] mb-[5px]">Bizning Missiya va tariximiz</p>
            <ul>
              <li className="font-normal text-base leading-[1.37] text-[#606266] list-disc">Bizning missiyamiz mijozlarga yuqori sifatli xizmatlar va mahsulotlarni taklif qilish, hamda doimiy ravishda yangi texnologiyalarni kiritish orqali ularning ehtiyojlarini qondirishdir.</li>
              <li className="font-normal text-base leading-[1.37] text-[#606266] list-disc">Kompaniyamiz 2010 yilda tashkil topdi va shu vaqt mobaynida dunyo bo'ylab o'nlab mijozlarga yuqori sifatli xizmatlar ko'rsatdi. Har bir yilda o'z faoliyatini kengaytirib, innovatsion mahsulotlar yaratish va texnologiyalarni rivojlantirishga alohida e'tibor qaratdik.</li>
            </ul>
          </div>
          <div className="rounded-[24px] w-[325px] h-[230px] bg-[#fcdbdb] hover:bg-[#fcdbdb] p-[24px] flex flex-wrap gap-[20px]">
            <p className="font-bold text-base leading-[1.37] text-[#242b3a] ">Bizning aloqa manzillarimiz</p>
            <a className="flex gap-[16px] items-center" href='tel:+998933771283'>
            <Phone/> +998 93 377 1283
            </a>
            
            <a className="flex gap-[16px] items-center" href='mailto:uze.investment@gmail.com'>
            <Mail/>uze.investment@gmail.com
            </a>
            <p className="flex gap-[16px] text-[13px]  items-center">
            <Location/> Chilonzor tumani Islom Karimov ko'chasi 49-uy 100066
            </p>
          </div>
          <div className="rounded-[24px] w-[325px] h-[230px] bg-[#fcdbdb] hover:bg-[#fcdbdb] flex justify-between flex-col p-[24px] flex-wrap">
            <p className="font-bold text-base leading-[1.37] text-[#242b3a]">Bizni ijtimoiy tarmoqlarda kuzatib boring!</p>
            <div className="flex gap-[17px]">
              <Button className="w-[56px] h-[56px] bg-white rounded-[100%] hover:bg-white "><a href="https://t.me/uzeinvestment"><Telegram fill="url(#paint0_linear_2111_27)"/></a> </Button>
              <Button className="w-[56px] h-[56px] bg-white rounded-[100%] hover:bg-white text-[url(#paint0_linear_2111_91)]"><Instagram/></Button>
              <Button className="w-[56px] h-[56px] bg-white rounded-[100%] hover:bg-white text-[url(#paint0_linear_2111_91)]"><Feacebook/></Button>
              <Button className="w-[56px] h-[56px] bg-white rounded-[100%] hover:bg-white text-[url(#paint0_linear_2111_91)]"><Youtube/></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* <Footer/>  */}
   
    </>

  );
}
