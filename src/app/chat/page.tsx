import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div>
        <h2 className='pt-[36px] font-bold text-[32px] leading-[131%] text-center text-[#242b3a]'>
            Chat
        </h2>
        <div className='w-full flex gap-[20px] justify-center'>
            <div className='border border-gray-300 rounded-[24px] w-[900px] h-[931px] shadow-lg bg-white p-[36px]'>
                <div className='h-[121px] w-full flex '>
                    <Image
                    src='/chat/profile.png'
                    alt='profile'
                    width={100}
                    height={100}
                    />

                </div>
            </div>
            <div className='border border-[#e7e7e9] rounded-[24px] w-[440px] h-[625px] shadow-[0_6px_24px_rgba(209,209,209,0.15)] bg-white'>
d
            </div>
        </div>
    </div>
  )
}

export default page