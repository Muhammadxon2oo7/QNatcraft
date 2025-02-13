// "use client"
import React from 'react'
import Image from 'next/image'
import { Logo } from '../../../public/img/header/Logo'
import { Button } from '../ui/button'
import { Search } from '../../../public/img/header/Search'
import { ChatIcon } from '../../../public/img/header/ChatIcon'
import { HeartICon } from '../../../public/img/header/HeartICon'


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import { Login } from '../../../public/img/header/Login'
import AnimatedSearchTransform from '../SearchComponent/animated-search-transform'
import Navbar from '../Navbar/Navbar'
import LocaleSwitcher from './LocaleSwitcher'
import { ClientHeader } from './clientHeader'
import Link from 'next/link'

export const Header = () => {

  return (
<ClientHeader>
<header className=' block fixed inset-0 bg-white h-[156px] '>
<div className='flex flex-wrap max-w-[1360px]  mx-auto justify-between  z-100'>
      <div className='py-[28px]'>
        <Logo/>
      </div>
      <div className='flex gap-[16px] py-[28px]'>
        <AnimatedSearchTransform/>
        <Button className='bg-[#f6f6f6] hover:bg-[#f6f6f6] hover:cursor-pointer flex gap-[8px] h-[52px]
        '>
            <ChatIcon/>
            <p className='font-medium text-[18px] leading-[133%] text-[#242b3a]'>Chat</p>
        </Button>
        <Button className='bg-[#f6f6f6] hover:bg-[#f6f6f6] hover:cursor-pointer h-[52px]
        '>
            <HeartICon/>
        </Button>
  <LocaleSwitcher/>
       
        <div className=''>
  <Button className='flex justify-center items-center h-[52px] bg-[#fcdbdb]  gap-[8px] w-[180px] rounded-[16px]   hover:cursor-pointer hover:bg-[#fcdbdb] cursor-pointer'>
    
<Link href={'/register'} className='font-medium text-[18px] leading-[133%] cursor-pointer bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent
'>
            Kirish
            </Link>
            <Login/>
        
  
  </Button>
  </div>
 

      </div>
      
    </div>
    <div className='w-full primary-bg h-[56px]'>
            <div className='max-w-[1360px]  mx-auto'>
            <Navbar/>
            </div>
    </div>
</header>
</ClientHeader>
  )
}
