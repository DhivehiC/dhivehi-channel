import React, { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { FacebookShareButton, TwitterShareButton, ViberShareButton, WhatsappShareButton, TelegramShareButton } from 'next-share'
import { FaFacebookSquare, FaTwitter, FaViber, FaWhatsapp, FaTelegram } from 'react-icons/fa'


interface Props {
    className?: string
    href?: string
    children?: string
    hashTag?: string
    separator?: string
}

const ProfileCard:FC<Props> = (props) => {
    const className = twMerge([
        'flex items-center gap-6 lg:gap-8 justify-end text-primary',
        props?.className
    ])

    return (
        <div className={className}>
            <FacebookShareButton 
                className='relative'
                url={props?.href || "/"}
                quote={props?.children}
                hashtag={props?.hashTag}
            >
                <FaFacebookSquare className='h-8 w-8 text-quinary breaking:text-tertiary' />
            </FacebookShareButton>
            <TwitterShareButton 
                className='relative'
                url={props?.href || "/"}
                title={props?.children}
            >
                <FaTwitter className='h-8 w-8 text-quinary breaking:text-tertiary' />
            </TwitterShareButton>
            <ViberShareButton 
                className='relative'
                url={props?.href || "/"}
                title={props?.children}
            >
                <FaViber className='h-8 w-8 text-quinary breaking:text-tertiary' />
            </ViberShareButton>
            <TelegramShareButton 
                className='relative'
                url={props?.href || "/"}
                title={props?.children}
            >
                <FaTelegram className='h-8 w-8 text-quinary breaking:text-tertiary' />
            </TelegramShareButton>
            <WhatsappShareButton 
                className='relative'
                url={props?.href || "/"}
                title={props?.children}
                separator=":: "
            >
                <FaWhatsapp className='h-8 w-8 text-quinary breaking:text-tertiary' />
            </WhatsappShareButton>
        </div>
    )
}

export default ProfileCard