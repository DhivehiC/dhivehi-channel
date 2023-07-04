import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { HiMagnifyingGlass, HiOutlineTv, HiMagnifyingGlassCircle, HiXMark } from 'react-icons/hi2'
import Button from './Button'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header:FC<Props> = (props) => {
    const [searchBar, setSearchBar] = useState(false)
    const [isScrolledToTop, setIsScrolledToTop] = useState(true)
    const router = useRouter()

    useEffect(()=>{
        if (router.pathname === "/") {
            setIsScrolledToTop(true)
            const handleScroll = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        
                if (scrollTop === 0) {
                    setIsScrolledToTop(true)
                } else {
                    setIsScrolledToTop(false)
                }
            }
        
            window.addEventListener('scroll', handleScroll)
        
            return () => {
                window.removeEventListener('scroll', handleScroll)
            }
        } else {
            setIsScrolledToTop(false)
        }
    }, [router.pathname, router.query])

    return (
        <header className={twMerge([
            'p-4 fixed top-0 w-full z-50 bg-transparent transition-all',
            !isScrolledToTop && 'bg-[#00000095]',
            props?.className
        ])}>
            <div className='container mx-auto grid grid-cols-12 gap-4 items-center px-4'>
                <div className={twMerge('col-span-3 opacity-100 lg:opacity-100 transition-all', searchBar && 'opacity-0')}>
                    <Link href={"/"} className='w-16 h-16 relative rounded-full border border-accent block'>
                        <Image src={'/logo.png'} alt='logo' fill priority />
                    </Link>
                </div>
                <div className='col-span-6 flex justify-center'>
                    <div className={twMerge([
                        'lg:w-full w-[calc(100%-2rem)] transition-all lg:max-w-2xl lg:relative lg:top-[unset] lg:translate-y-[unset] absolute top-1/2 -translate-y-1/2 left-4 z-50',
                        !searchBar && '-top-full'
                    ])}>
                        <button  onClick={()=>setSearchBar((s)=>!s)}>
                            <HiXMark className='absolute left-6 top-1/2 -translate-y-1/2 text-xl text-dark-accent rotate-[360deg] lg:hidden' />
                        </button>
                        <input type='search' className='border border-accent w-full bg-white py-3 pl-6 pr-14 rounded-full text-base focus-within:outline-none' placeholder='ހޯދާ' />
                        <HiMagnifyingGlass className='absolute right-6 top-1/2 -translate-y-1/2 text-xl text-dark-accent rotate-[360deg]' />
                    </div>
                </div>
                <div className={twMerge([
                    'col-span-3 flex items-center justify-end gap-4 opacity-100 lg:opacity-100 transition-all',
                    searchBar && 'opacity-0'
                ])}>
                    <Button onClick={()=>setSearchBar((s)=>!s)}  className={'p-0 bg-transparent lg:hidden'}>
                        <HiMagnifyingGlassCircle className='text-5xl' />
                    </Button>
                    <Button className='flex items-center gap-4 relative'>
                        <HiOutlineTv className='text-xl' />
                        <span className='mt-[-7px] hidden lg:block'>{"ލައިވް ޓީވީ"}</span>
                        <span className="absolute flex h-3 w-3 top-[-3px] left-[-3px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3131]"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF3131]"></span>
                        </span>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header

interface Props {
    className?: string
}