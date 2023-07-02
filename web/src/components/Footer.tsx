import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaViber } from 'react-icons/fa'

const Footer:FC<Props> = (props) => {
    return (
        <footer className={twMerge([
            'bg-dark-accent',
            props?.className
        ])}>
            <div className='container mx-auto px-4 py-12 grid grid-cols-12 gap-x-4 gap-y-12'>
                <div className='lg:col-span-8 col-span-12'>
                    <h1 className='text-accent text-2xl font-bold mb-4 text-center lg:text-start'>{"ސޯޝަލް މީޑިއާ"}</h1>
                    <div className='flex gap-6 justify-center lg:justify-start'>
                        {[FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaViber].map((Component, index)=>(
                            <Link href={"/"} key={index} className='hover:opacity-75 active:opacity-50'>
                                <Component className='text-accent text-2xl' />
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='lg:col-span-4 col-span-12'>
                    <div className='w-20 h-20 relative rounded-full border border-accent lg:mr-auto lg:ml-[unset] mx-auto'>
                        <Image src={'/logo.png'} alt='logo' fill priority />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

interface Props {
    className?: string   
}