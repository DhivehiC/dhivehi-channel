import { FC, HTMLAttributes } from 'react'
import Image from "next/image";
import OmmitProps from '@sikundi/hooks/ommitProp'
import { twMerge } from 'tailwind-merge'

interface Props extends HTMLAttributes<HTMLSpanElement> {
    src?: string,
    layout?: string,
    alt: string,
    objectFit?: string,
    transparent?: boolean,
    width?: number,
    height?: number,
    priority?: boolean,
    imgClassName?: string
}

const Img:FC<Props> = (props) => {
    return (
        <span {...OmmitProps(['src', 'layout', 'alt', 'height', 'width', 'objectFit', 'transparent'], props)} className={twMerge([
            'block relative z-0',
            !props?.transparent && 'bg-tertiary',
            props?.className && props?.className
        ])}>
            {
                (props?.src && props?.alt) &&
                <Image src={props?.src} className={twMerge([`w-full h-full z-0 object-cover`, props.imgClassName])} fill sizes={"100%"} alt={props?.alt} height={props?.height} width={props?.width} priority={props?.priority} />
            }
        </span>
    )
}

export default Img