import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
    children?: string,
    className?: string
}

const RichText:FC<Props> = (props) => {
    return (
        <article dangerouslySetInnerHTML={{__html: props.children?.replace(/ style="(.*?)"/g, "") || "" }} className={twMerge([
            'rich-text',
            props?.className
        ])}></article>
    )
}

export default RichText