import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Button from './Button'
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon'
import QueueListIcon from '@heroicons/react/24/solid/QueueListIcon'
import Bars3BottomLeftIcon from '@heroicons/react/24/solid/Bars3BottomLeftIcon'
import Bars3BottomRightIcon from '@heroicons/react/24/solid/Bars3BottomRightIcon'
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon'
import ArrowUturnLeftIcon from '@heroicons/react/24/solid/ArrowUturnLeftIcon'
import LinkIcon from '@heroicons/react/24/solid/LinkIcon'
import ArrowUturnRightIcon from '@heroicons/react/24/solid/ArrowUturnRightIcon'
import PhotoIcon from '@heroicons/react/24/solid/PhotoIcon'
import ArrowsPointingInIcon from '@heroicons/react/24/solid/ArrowsPointingInIcon'
import ArrowsPointingOutIcon from '@heroicons/react/24/solid/ArrowsPointingOutIcon'
import MediaPicker from './MediaPicker'
import sanitizeHtml from 'sanitize-html'
import dayjs from 'dayjs'

interface Props {
    value?: string
    timeStamp?: any
}

const WYSIWYG = forwardRef((props:Props, ref) => {
    const localRef = useRef<any>(null)
    const [ active, setActive ] = useState(false)
    const [ full, setFull ] = useState(false)
    const [ linkActive, setLinkActive ] = useState(false)
    useImperativeHandle(ref, ()=> localRef.current)
    const styles = twMerge([
        'relative bg-background p-3 rounded-md max-w-full',
        full && 'fixed w-screen h-screen z-50 top-0 left-0'
    ])
    useEffect(()=>{
        if (props.value) {
            localRef.current.innerHTML = props.value
        }
    }, [])

    return (
        <Fragment>
            <div className={styles}>
                <header className='p-1 bg-secondary rounded-md flex gap-1 flex-wrap mb-2'>
                    <Btn onClick={()=>document.execCommand('formatBlock', false, '<p>')}>
                        P
                    </Btn>
                    <Btn onClick={()=>document.execCommand('formatBlock', false, '<h1>')}>
                        H1
                    </Btn>
                    <Btn onClick={()=>document.execCommand('formatBlock', false, '<h2>')}>
                        H2
                    </Btn>
                    <Btn className='lg:mr-2 mr-1' onClick={()=>document.execCommand('formatBlock', false, '<h3>')}>
                        H3
                    </Btn>
                    
                    <Btn onClick={()=>document.execCommand('bold', false)}>
                        B
                    </Btn>
                    <Btn className='lg:mr-2 mr-1' onClick={()=>document.execCommand('underline', false)}>
                        U
                    </Btn>
                    <Btn onClick={()=>document.execCommand('insertUnorderedList', false)}>
                        <ListBulletIcon className='h-4 w-4' />
                    </Btn>
                    <Btn onClick={()=>document.execCommand('insertOrderedList', false)}>
                        <QueueListIcon className='h-4 w-4' />
                    </Btn>
                    <Btn className='lg:mr-2 mr-1' onClick={()=>document.execCommand('formatBlock', false, '<blockquote>')}>
                        {`"`}
                    </Btn>
                    <Btn onClick={()=>addLink()}>
                        <LinkIcon className='h-4 w-4' />
                    </Btn>
                    <Btn className='lg:mr-2 mr-1' onClick={()=>setActive(true)}>
                        <PhotoIcon className='h-4 w-4' />
                    </Btn>
                    <Btn onClick={()=>document.execCommand('justifyLeft', false)}>
                        <Bars3BottomLeftIcon className='h-4 w-4' />
                    </Btn>
                    <Btn onClick={()=>document.execCommand('justifyCenter', false)}>
                        <Bars3Icon className='h-4 w-4' />
                    </Btn>
                    <Btn onClick={()=>document.execCommand('justifyRight', false)}>
                        <Bars3BottomRightIcon className='h-4 w-4' />
                    </Btn>
                    <Btn className='ml-auto' onClick={()=>document.execCommand('undo', false)}>
                        <ArrowUturnLeftIcon className='h-4 w-4' />
                    </Btn>
                    <Btn onClick={()=>document.execCommand('redo', false)}>
                        <ArrowUturnRightIcon className='h-4 w-4' />
                    </Btn>
                    <Btn className='lg:mr-2 mr-1' onClick={()=>{
                        setFull(!full)
                        toggleFullScreen()
                    }}>
                        {
                            full ?
                            <ArrowsPointingInIcon className='h-4 w-4' />
                            : <ArrowsPointingOutIcon className='h-4 w-4' />
                        }
                    </Btn>
                </header>
                <div className={twMerge('h-64 w-full editor focus-within:outline-none text-accent overflow-y-auto leading-relaxed', full && 'h-full')} contentEditable dir='rtl' ref={localRef} onKeyDown={(e)=>{
                    const parentTagName = window?.getSelection()?.getRangeAt(0)?.commonAncestorContainer?.parentNode?.nodeName
                    const tagName = window?.getSelection()?.getRangeAt(0)?.commonAncestorContainer?.nodeName
                    if (props.timeStamp() && e.keyCode === 13) {
                        document.execCommand('insertHTML', false, "<br />")
                        document.execCommand('insertHTML', false, `<p class='bg-danger text-white py-1 px-3 inline'>${dayjs(new Date().toISOString()).format('HH:mm:ss')}</p>`)
                    } else if (
                        (
                            e.keyCode === 13 &&
                            (parentTagName!=="OL" && tagName!=="OL") &&
                            (parentTagName!=="UL" && tagName!=="UL") &&
                            (parentTagName!=="LI" && tagName!=="LI") &&
                            (parentTagName!=="H1" && tagName!=="H1") &&
                            (parentTagName!=="H2" && tagName!=="H2") &&
                            (parentTagName!=="H3" && tagName!=="H3")
                        )
                        ||
                        (parentTagName==="DIV" && tagName!=="BLOCKQUOTE" && tagName!=="H1" && tagName!=="H2" && tagName!=="H3")
                    ) {
                        setTimeout(function() {
                            document.execCommand('formatBlock', false, '<p>')
                        }, 1)
                    }
                }} onPaste={(e)=>{
                    e.preventDefault()
                    if (e.clipboardData.getData('text').startsWith('https://twitter.com/')) {
                        // fetch(`/api/other/twitter-embed?url=${e.clipboardData.getData('text')}`, {
                        //     method: "GET",
                        // }).then(async (res)=>{
                        //     const url = await res.json()
                        //     document.execCommand('insertHTML', false, url.html)
                        //     setTimeout(()=>{
                        //         document.execCommand('selectAll', false)
                        //         document?.getSelection()?.collapseToEnd()
                        //         document.execCommand('insertParagraph',false)
                        //         document.execCommand('formatBlock', false, '<p>')
                        //     }, 50)
                        // }).catch((e)=>{
                        //     console.log(e)
                        // })

                        fetch(`https://publish.twitter.com/oembed?url=${e.clipboardData.getData('text')}`, {
                            method: "GET",
                            mode: "cors"
                        }).then(async (resp)=>{
                            const url = await resp.json()
                            document.execCommand('insertHTML', false, url.html)
                            setTimeout(()=>{
                                document.execCommand('selectAll', false)
                                document?.getSelection()?.collapseToEnd()
                                document.execCommand('insertParagraph',false)
                                document.execCommand('formatBlock', false, '<p>')
                            }, 50)
                        }).catch((e)=>{
                            console.log(e)
                        })
                    } else if (e.clipboardData.getData('text').match(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/)) {
                        const html = `<iframe width="75%" src="https://www.youtube.com/embed/${youtube_parser(e.clipboardData.getData('text'))}" style="aspect-ratio: 3 / 2"></iframe>`
                        setTimeout(()=>{
                            document.execCommand('insertHTML', false, html)
                        }, 50)
                    } else {
                        if (e.clipboardData.getData('text/html')) {
                            document.execCommand('insertHTML', false, sanitizeHtml(e.clipboardData.getData('text/html')?.replace(/&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' '), {
                                allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
                            }))
                        } else {
                            document.execCommand('insertHTML', false, e.clipboardData.getData('text'))
                        }
                    }
                }}>
                    
                </div>
            </div>
            <MediaPicker state={[active, setActive]} focus={()=>localRef.current.focus()} callback={(url:any, caption:any)=>{
                localRef.current.focus()
                document.execCommand("delete", false)
                document.execCommand("insertHTML", false, `<img src="${url}" /><p>${caption}</p>`)
            }} />
        </Fragment>
    )




    function Btn(props:any) {
        return (
            <Button type='button' className={twMerge(['mb-0 text-base h-7 w-8 flex items-center justify-center', props.className && props.className])} onClick={()=>{
                props?.onClick()
                localRef.current.focus()
            }}>
                {props.children}
            </Button>
        )
    }
})

WYSIWYG.displayName = 'WYSIWYG'

export default WYSIWYG

const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

function youtube_parser(url:string){
    const match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function addLink() {
    var linkURL = prompt('Enter a URL:', 'http://');
    var sText = window.document.getSelection();

    window.document.execCommand('insertHTML', false, '<a href="' + linkURL + '" target="_blank">' + sText + '</a>');
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
}