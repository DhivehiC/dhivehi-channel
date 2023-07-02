import VideoList from '@sikundi/components/lists/VideoList'
import Button from '@sikundi/components/Button'
import Container from '@sikundi/components/Container'
import InfoBox from '@sikundi/components/InfoBox'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement, useState } from 'react'
import type { NextPageWithLayout } from '../_app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { prisma } from '@sikundi/libs/server/prisma'
import Paginate from '@sikundi/components/Paginate'
import { jwtVerify } from 'jose'
import stats from '@sikundi/libs/server/stats'

interface Props {
    videos: any
    totalPages: any
    current: any
    statistics: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    const [loading, setLoading] = useState(false)
    const Notes =  dynamic(import('@sikundi/components/Notes'), {
        ssr: false
    })
    const router = useRouter()

    return (
        <Fragment>
            <Container className='grid xl:grid-cols-5 grid-cols-1 xl:gap-4 gap-y-4 py-5'>
                <div className='xl:col-span-2 grid grid-cols-2 gap-4 order-2 xl:order-1'>
                    {props.statistics?.map((item: any, index: any) => (
                        <InfoBox
                            key={index}
                            className="col-span-2 sm:col-span-1"
                            title={item?.category?.title}
                            value={item?._count?.id}
                            increase={item?.increase}
                            decrease={item?.decrease}
                            caption="Since last month"
                        />
                    ))}
                    <Notes
                        className="col-span-2"
                        rows={15}
                    />
                </div>
                <div className='col-span-3 flex flex-col items-end order-1 xl:order-2'>
                    {
                        props.totalPages > 1 &&
                        <Paginate url={'/videos?page='} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset] lg:hidden" />
                    }
                    <Button className='bg-secondary px-5 mb-5' loading={loading} onClick={()=>router.push('/videos/create')}>New Vedio</Button>
                    <VideoList articles={props.videos} />
                    {
                        props.totalPages > 1 &&
                        <Paginate url={'/videos?page='} current={props.current} total={props.totalPages} className="mx-auto lg:mx-[unset]" />
                    }
                </div>
            </Container>
        </Fragment>
    )
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <Fragment>
            <Head>
                <title>Photos | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const current = ctx.query.page || 0
    const filter_by = ctx.query.filterby
    const per_page = 12

    let filters = {}
    if (filter_by === "published") {
        filters = {...filters, 
            published_at: {
                not: null
            }
        }
    }
    if (filter_by === "draft") {
        filters = {...filters, 
            published_at: {
                equals: null
            }
        }
    }
    if (filter_by === "deleted") {
        filters = {...filters, 
            deleted_at: {
                not: null
            }
        }
    }
    if (filter_by === "deleted") {
        filters = {...filters, 
            deleted_at: {
                not: null
            }
        }
    }
    if (filter_by === "mine") {
        const token = ctx.req.cookies['token']
        const secret = process.env.ACCESS_TOKEN_SECRET
        const {payload} = await jwtVerify(String(token), new TextEncoder().encode(secret))
        filters = {...filters, 
            created_by: {
                id: payload.id
            }
        }
    }

    const videos = await prisma.videos.findMany({
        select: {
            id: true,
            title:true,
            published_at: true,
            deleted_at: true,
            created_by: {
                select: {
                    user_name: true
                }
            },
        },
        where: filters,
        orderBy: {
            created_at: 'desc'
        },
        take: per_page,
        skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
    })
    const totalVideos = await prisma.videos.aggregate({
        _count: true,
        where: filters
    })

    if (videos.length === 0 && ctx.query.page !== undefined) {
        return {
            props: {

            },
            redirect: {
                destination: '/videos',
                permanent: false
            }
        }
    }

    const statistics = await stats()
    
    return {
        props: {
            videos: JSON.parse(JSON.stringify(videos)),
            totalPages: (Number(totalVideos._count)/per_page).toFixed(),
            current: current === 0 ? 1 : current,
            statistics: statistics
        }
    }
}

export default Page