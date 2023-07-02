import Button from '@sikundi/components/Button'
import Container from '@sikundi/components/Container'
import Heading from '@sikundi/components/Heading'
import ImageUploader from '@sikundi/components/ImageUploader'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, ReactElement, useEffect, useState } from 'react'
import type { NextPageWithLayout } from '../_app'
import { prisma } from '@sikundi/libs/server/prisma'
import Img from '@sikundi/components/Img'
import ImageViewer from '@sikundi/components/ImageViewer'
import Paginate from '@sikundi/components/Paginate'

interface Props {
    media: any
    totalPages: any
    current: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    const router = useRouter()
    const [ modal, setModal ] = useState(false)
    const [ media, setMedia ] = useState<any>([])
    const [ ViewerModal, setViewerModal ] = useState(false)
    const [ activeImage, setActiveImage ] = useState<any>(undefined)

    useEffect(()=>{
        setMedia([ {url: null, caption: null}, {url: null, caption: null}, {url: null, caption: null}, {url: null, caption: null}, {url: null, caption: null} ])
        setTimeout(()=>{
            setMedia(props.media)
        }, 100)
        if (router.query?.reload) {
            router.push('/media-library')
        }
    }, [props.media, router.query?.reload])

    return (
        <Fragment>
        <Container className='py-5 flex flex-col items-end'>
            <div className='flex justify-between items-center mb-4 w-full'>
                <Heading level={24} className="text-accent mb-0">Media Library</Heading>
                <Button className='bg-secondary px-5 mb-0' onClick={()=>setModal(true)}>Upload</Button>
            </div>
            {
                props.totalPages > 1 &&
                <Paginate url={'/media-library?page='} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset] lg:hidden" />
            }
            <div className='bg-secondary p-6 lg:p-12 rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full mb-4'>
                {
                    media?.length > 0 ?
                    media?.map((item:any, index:number)=>(
                        <div className='bg-background overflow-hidden aspect-video rounded-md' key={index} onClick={()=>{
                            setViewerModal(true)
                            setActiveImage(item)
                        }}>
                            <Img src={item.url} alt={`caption-${item.caption}`} className="h-full w-full bg-transparent" />
                        </div>
                    )) :
                    <Heading level={20} className="text-accent col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-5 text-center my-5">No Media At the moment. Please Add!</Heading> 
                }
            </div>
            {
                props.totalPages > 1 &&
                <Paginate url={'/media-library?page='} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset]" />
            }
            <ImageUploader name={"media"} id={"media"} state={[modal, setModal]} callback={function() {
                router.push('/media-library?reload=true')
            }} />
            <ImageViewer state={[ViewerModal, setViewerModal]} data={activeImage} />
        </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Media Library | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const current = ctx.query.page || 0
    const per_page = 15

    const media = await prisma.mediaLibrary.findMany({
        select: {
            id: true,
            url: true,
            caption: true,
            tags: true,
            created_by: {
                select: {
                    user_name: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        },
        take: per_page,
        skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
    })
    const totalMedias = await prisma.mediaLibrary.aggregate({
        _count: true
    })

    if (media.length === 0 && ctx.query.page !== undefined) {
        return {
            props: {

            },
            redirect: {
                destination: '/media-library',
                permanent: false
            }
        }
    }

    return {
        props: {
            media: JSON.parse(JSON.stringify(media)),
            totalPages: (Number(totalMedias._count)/per_page).toFixed(),
            current: current === 0 ? 1 : current,
        }
    }
}

export default Page