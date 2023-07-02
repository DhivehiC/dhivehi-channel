import React, { FC, useRef } from 'react'
import { PostCardBigProps } from '@DhivehiChannel/components/cards/PostCardBig'
import { HiOutlineArrowLeftCircle, HiOutlineArrowRightCircle } from 'react-icons/hi2'
import Button from '../Button'
import Image from 'next/image'
import FeatureCard from '../cards/FeatureCard'

const CarouselBlock:FC<CarouselBlockProps> = (props) => {
    const scrollContainerRef = useRef<any>(null);
  
    const handleScrollLeft = () => {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    };
  
    const handleScrollRight = () => {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    };

    return (
        <div className='bg-dark-accent py-7 px-4 mb-12 lg:mb-24'>
            <h1 className='text-white text-4xl text-center font-black leading-loose'>{props.title}</h1>
            <h4 className='text-accent text-base leading-loose text-center mb-6'>{props.sub_title}</h4>
            <div className='container flex mx-auto gap-12 lg:gap-x-24 items-center'>
                <Button className='p-0 bg-transparent' onClick={handleScrollRight}>
                    <HiOutlineArrowRightCircle className='text-accent text-5xl' />
                </Button>
                <div className='w-full flex gap-x-4 overflow-x-auto carousel snap-x snap-mandatory scroll-smooth' ref={scrollContainerRef}>
                    {props?.posts?.map((post, index)=>(
                        <FeatureCard key={index} {...post} />
                    ))}
                </div>
                <Button className='p-0 bg-transparent' onClick={handleScrollLeft}>
                    <HiOutlineArrowLeftCircle className='text-accent text-5xl' />
                </Button>
            </div>
        </div>
    )
}

export default CarouselBlock

export interface CarouselBlockProps {
    block_name: "carousel_block",
    title: string,
    sub_title: string,
    posts: PostCardBigProps[]
}