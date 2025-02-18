import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Phone } from '../../../public/img/phone'
import { Mail } from '../../../public/img/mail'
import { Location } from '../../../public/img/location'
import { Telegram } from '../../../public/img/telegram'
import { Instagram } from '../../../public/img/instagram'
import { Youtube } from '../../../public/img/youtube'
import { Feacebook } from '../../../public/img/feacebook'

export const Footer = () => {
  return (
    <div className='bg-[#242b3a] w-full py-[80px]'>
        <div className='max-w-[1360px] rounded-[24px] w-[1360px] h-[357px] bg-white/5 px-[56px] pt-[56px] mx-auto '>
          <div className='w-full flex flex-wrap gap-[98px] border-b border-b-white/20 pb-[56px]'>
          <div className='w-[250px]'>
            <Image
            src={'/img/footer_logo.png'}
            alt='footer logo'
            width={100}
            height={100}
            className='mb-[32px] w-[200px] h-[72px]'
            />
            <p className='font-medium text-base leading-[137%] text-white'>
            Qoraqalpoq hunarmandchiligi – <span className='text-white text-opacity-70'>tarixiy meros va nafis san'atning uyg'unligi.</span>
            </p>
          </div>
          <div>
            <p className='font-bold text-2xl text-white opacity-40 mb-[24px]'>
            Sahifalar
            </p>
            <ul className='flex flex-wrap w-[144px] mb-[16px]'>
              <li className='w-full'><Link className='font-normal text-[18px] text-white' href={'/'}>Bosh sahifa</Link></li>
              <li className='w-full'><Link className='font-normal text-[18px] text-white' href={'/'}>Mening kurslarim</Link></li>
              <li className='w-full'><Link className='font-normal text-[18px] text-white' href={'/'}>Kurslar</Link></li>
              <li className='w-full'><Link className='font-normal text-[18px] text-white' href={'/'}>Yangiliklar</Link></li>
            </ul>
          </div>
          <div>
            <p className='font-bold text-2xl text-white opacity-40 mb-[24px]'>
            Bog’lanish
            </p>
            <ul className='flex flex-wrap w-[265px] mb-[16px]'>
              <li className='w-full'><a  className='font-normal text-[18px] text-white flex gap-[16px] items-center' href='tel:+998933771283'><Phone/> +998 93 377 1283</a></li>
              <li className='w-full'><a className='font-normal text-[18px] text-white flex gap-[16px] items-center'  href='mailto:uze.investment@gmail.com'><Mail/> uze.investment@gmail.com</a></li>
              <li className='w-full'><a className='font-normal text-[18px] text-white flex gap-[16px] items-center' href='/'><Location/> Toshkent, O’zbekiston</a></li>
            </ul>
          </div>
          <div>
            <p className='font-bold text-2xl text-white opacity-40 mb-[24px]'>
            Ijtimoiy tarmoqlar
            </p>
            <div className='flex flex-wrap w-[272px] gap-[16px]'>
              <div className='w-[56px] h-[56px] rounded-[100%] flex justify-center items-center bg-[rgba(255,255,255,0.08)] cursor-pointer hover:bg-[linear-gradient(225deg,#cb651c_0%,#813b0a_100%)] text-[#e5ecff]'><a href="https://t.me/uzeinvestment"><Telegram fill='white'/></a></div>
              <div className='w-[56px] h-[56px] rounded-[100%] flex justify-center items-center bg-[rgba(255,255,255,0.08)] cursor-pointer hover:bg-[linear-gradient(225deg,#cb651c_0%,#813b0a_100%)] text-[#e5ecff]'><Instagram fill='white'/></div>
              <div className='w-[56px] h-[56px] rounded-[100%] flex justify-center items-center bg-[rgba(255,255,255,0.08)] cursor-pointer hover:bg-[linear-gradient(225deg,#cb651c_0%,#813b0a_100%)] text-[#e5ecff]'><Youtube fill='white'/></div>
              <div className='w-[56px] h-[56px] rounded-[100%] flex justify-center items-center bg-[rgba(255,255,255,0.08)] cursor-pointer hover:bg-[linear-gradient(225deg,#cb651c_0%,#813b0a_100%)] text-[#e5ecff]'><Feacebook fill='white'/></div>
            </div>
          </div>
          </div>
          <div className='w-full  flex flex-wrap justify-between pt-[16px]'>
          <p className='font-light text-[18px] leading-[133%] text-white/60 '>©QQRNatcraft.uz Barcha huquqlar himoyalangan</p>
          <p className='font-light text-[18px] leading-[133%] text-white/60 '>Sayt <span className='font-normal text-white'>E-investment</span> tomonidan ishlab chiqilgan!</p>

          </div>
        </div>
    </div>
  )
}
