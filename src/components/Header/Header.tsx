
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
  
export const Header = () => {
  return (
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
        <Select >
  <SelectTrigger className="w-[117px] h-[52px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent className='absolute block index  '>
    <SelectItem className='cursor-pointer' value="light">O’zb</SelectItem>
    <SelectItem className='cursor-pointer' value="dark">English</SelectItem>
    <SelectItem className='cursor-pointer' value="system">Ru</SelectItem>
  </SelectContent>
</Select>

        <Dialog >
        <div className='
        '>
  <DialogTrigger className='flex justify-center items-center h-[52px] bg-[#fcefe5]  gap-[8px] w-[180px] rounded-[16px]   hover:cursor-pointer hover:bg-[#fcefe5] cursor-pointer'>
    
<p className='font-medium text-[18px] leading-[133%] cursor-pointer bg-gradient-to-br from-[#cb651c] to-[#813b0a] bg-clip-text text-transparent'>
            Kirish
            </p>
            <Login/>
        
  
  </DialogTrigger>
  </div>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

      </div>
      
    </div>
    <div className='w-full primary-bg h-[56px]'>
            <div className='max-w-[1360px]  mx-auto'>
            <Navbar/>
            </div>
    </div>
</header>
  )
}
