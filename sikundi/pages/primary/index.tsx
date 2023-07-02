import BoxList from '@sikundi/components/lists/BoxList'
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

interface Props {
    boxes: any
    totalPages: any
    current: any
    postCounts: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    const [loading, setLoading] = useState(false)
    const Notes =  dynamic(import('@sikundi/components/Notes'), {
        ssr: false
    })
    const router = useRouter()

    return (
        <Fragment>
            <Container className='grid xl:grid-cols-5 grid-cols-1 xl:gap-4 gap-y-4 py-5 items-start'>
                <div className='xl:col-span-2 grid grid-cols-2 gap-4 order-2 xl:order-1'>
                    <InfoBox 
                        className='col-span-2 sm:col-span-1'
                        title='News'
                        value={0}
                        increase={0}
                        caption="Since last month"
                    />
                    <InfoBox 
                        className='col-span-2 sm:col-span-1'
                        title='Reports'
                        value={0}
                        increase={0}
                        caption="Since last month"
                    />
                    <InfoBox 
                        className='col-span-2 sm:col-span-1'
                        title='Feature Articles'
                        value={0}
                        increase={0}
                        caption="Since last month"
                    />
                    <InfoBox 
                        className='col-span-2 sm:col-span-1'
                        title='Columns'
                        value={0}
                        increase={0}
                        caption="Since last month"
                    />
                    <Notes
                        className="col-span-2"
                        rows={15}
                    />
                </div>
                <div className='col-span-3 flex flex-col items-end order-1 xl:order-2'>
                    <Button className='bg-secondary px-5 mb-5' loading={loading} onClick={()=>router.push('/primary/create')}>New Box</Button>
                    <BoxList boxes={props.boxes} /> 
                    {
                        props.totalPages > 1 &&
                        <Paginate url={'/primary?page='} current={props.current} total={props.totalPages} />
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
                <title>Primary | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const current = ctx.query.page || 0
    const per_page = 12

    const voteBoxes = await prisma.voteBoxes.findMany({
        select: {
            id: true,
            name:true,
            box_number: true,
            island: {
                select: {
                    name: true
                }
            },
            ibu: true,
            anni: true
        },
        orderBy: {
            created_at: 'desc'
        },
        take: per_page,
        skip: Number(current)-1 < 0 ? 0 : (Number(current)-1)*per_page
    })
    const totalVoteBoxes = await prisma.voteBoxes.aggregate({
        _count: true,
    })

    if (voteBoxes.length === 0 && ctx.query.page !== undefined) {
        return {
            props: {

            },
            redirect: {
                destination: '/primary',
                permanent: false
            }
        }
    }
    
    return {
        props: {
            boxes: JSON.parse(JSON.stringify(voteBoxes)),
            totalPages: Math.ceil((Number(totalVoteBoxes._count)/per_page)),
            current: current === 0 ? 1 : current,
        }
    }
}

export default Page