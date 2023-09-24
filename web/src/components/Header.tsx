import Image from 'next/image'
import React, { FC, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { HiMagnifyingGlass, HiOutlineTv, HiMagnifyingGlassCircle, HiXMark } from 'react-icons/hi2'
import Button from './Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDebounce, useOnClickOutside } from 'usehooks-ts'
import transliterate from '@DhivehiChannel/libs/transliterate'
import axios from 'axios'
import dayjs from 'dayjs'
import HijriDate,{toHijri} from 'hijri-date/lib/safe';

const Header:FC<Props> = (props) => {
    const [searchBar, setSearchBar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isScrolledToTop, setIsScrolledToTop] = useState(true)
    const [searchBarActive, setSearchBarActive] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const router = useRouter()
    const ref = useRef<any>(null)
    const [search, setSearch] = useState<string>("")
    const debouncedValue = useDebounce<string>(search, 500)
    const handleClickOutside = () => setSearchBarActive(false)
    useOnClickOutside(ref, handleClickOutside)
  
    useEffect(() => {
        (async ()=>{
            try {
                const { data, status } = await axios.get(`/api/search?query=${search}`, {
                    method: "get",
                    headers: {
                        authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
                    }
                })
                if (data?.articles && status === 200) {
                    setResults(data?.articles)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [debouncedValue])

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
        setSearch("")
        setResults([])
        setSearchBar(false)
    }, [router.pathname, router.query])

    return (
        <header className={twMerge([
            'fixed top-0 w-full z-50 bg-transparent transition-all',
            !isScrolledToTop && 'bg-[#00000095]',
            props?.className
        ])}>
            <div className={"w-full bg-black"}>
                <div className='container mx-auto px-4 py-2'>
                    <h6>{dayjs(new Date()).toString()}</h6>
                    <h6>{(new HijriDate())}</h6>
                </div>
            </div>
            <div className='container mx-auto grid grid-cols-12 gap-4 items-center px-8 py-4'>
                <div className={twMerge('col-span-3 opacity-100 lg:opacity-100 transition-all', searchBar && 'opacity-0')}>
                    <Link href={"/"} className='w-16 h-16 relative rounded-full border border-accent block'>
                        <Image src={'/logo.png'} alt='logo' fill priority />
                    </Link>
                </div>
                <div className='col-span-6 flex justify-center'>
                    <div ref={ref} className={twMerge([
                        'lg:w-full w-[calc(100%-2rem)] transition-all lg:max-w-2xl lg:relative lg:top-[unset] lg:translate-y-[unset] absolute top-1/2 -translate-y-1/2 left-4 z-50',
                        !searchBar && '-top-full'
                    ])}>
                        <button  onClick={()=>setSearchBar((s)=>!s)}>
                            <HiXMark className='absolute left-6 top-1/2 -translate-y-1/2 text-xl text-dark-accent rotate-[360deg] lg:hidden' />
                        </button>
                        <input type='search' value={search} placeholder='ހޯދާ' onFocus={()=>{setSearchBarActive(true); setSearchBar(true)}} className={twMerge([
                            'border border-accent w-full py-2 pl-6 pr-14 rounded-3xl text-base leading-loose focus-within:outline-none',
                            (searchBar && searchBarActive && search?.length > 0) && 'rounded-b-none border-0 border-t border-x'
                        ])} onChange={(e)=>{
                            const value = transliterate(e.currentTarget.value)
                            setSearch(value)
                            if (value.length === 0) {
                                setResults([])
                            } else {
                                setLoading(true)
                            }
                        }} />
                        <HiMagnifyingGlass className='absolute right-6 top-1/2 -translate-y-1/2 text-xl text-dark-accent rotate-[360deg]' />
                        <div className={twMerge([
                            'w-full h-0 bg-white absolute top-full rounded-2xl rounded-t-none overflow-auto',
                            (searchBar && searchBarActive) && 'max-h-[50vh] h-auto',
                            (searchBar && searchBarActive && search) && 'border-accent border border-t-0'
                        ])}>
                            {results?.map((result, index)=>(
                                <Link key={index} href={`/${result?.id}`} className='px-6 py-4 block text-gray-700 hover:opacity-75 active:opacity-50'>
                                    {result?.title}
                                </Link>
                            ))}
                            {
                                (search && results?.length === 0) && (
                                    loading ?
                                    <p className='p-4 text-center'>{`ލޯޑިން`} {"..."}</p> :
                                    <p className='p-4 text-center'>{`"${search}" އާއި ގުޅުންހުރި ލިޔުމެއް ނެތެވެ.`}</p>
                                )
                            }
                        </div>
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