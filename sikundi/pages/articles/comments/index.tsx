import Container from '@sikundi/components/Container'
import DashboardLayout from '@sikundi/layouts/DashboardLayout'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Fragment, ReactElement, useContext, useEffect, useState } from 'react'
import type { NextPageWithLayout } from '../../_app'
import { prisma } from '@sikundi/libs/server/prisma'
import Heading from '@sikundi/components/Heading'
import CommentsCard from '@sikundi/components/cards/CommentsCard'
import { NotificationContext } from '@sikundi/layouts/RootLayout'

interface Props {
    comments: any
}

const Page: NextPageWithLayout<Props> = (props) => {
    const [comments, setComments] = useState([])
    const [notification, setNotification] = useContext(NotificationContext)
    useEffect(()=>{
        setComments(props.comments)
    }, [props.comments])

    return (
        <Fragment>
            <Container>
                <div className='flex justify-between flex-wrap gap-3 my-5'>
                    <Heading level={30} className="text-accent">Comments</Heading>
                </div>
                <div>
                    {
                        comments?.map((comment:any, index:number)=>(
                            <CommentsCard 
                                created_by={comment.created_by}
                                content={comment.content}
                                post_id={comment.post_id}
                                id={comment.id}
                                key={index}
                                approve={async ()=>{
                                    const res = await fetch(`/api/articles/comments/approve`, {
                                        method: "POST",
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            id: comment.id
                                        })
                                    })                                    
                                    const resJson:any = await res.json()  
                                    if (resJson?.notification) {
                                        setNotification(resJson?.notification)
                                        setComments(comments.filter(function (item:any) {
                                            return item.id !== comment.id
                                        }))
                                    }
                                }}
                                disapprove={async ()=>{
                                    const res = await fetch(`/api/articles/comments/disapprove`, {
                                        method: "POST",
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            id: comment.id
                                        })
                                    })
                                    const resJson:any = await res.json()                                  
                                    if (resJson?.notification) {
                                        setNotification(resJson?.notification)
                                        setComments(comments.filter(function (item:any) {
                                            return item.id !== comment.id
                                        }))
                                    }
                                }}
                            />
                        ))
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
                <title>Comments | sikundi</title>
            </Head>
            <DashboardLayout>
                {page}
            </DashboardLayout>
        </Fragment>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const comments = await prisma.comments.findMany({
        select: {
            id: true,
            created_by: true,
            content: true,
            post_id: true
        },
        orderBy: {
            post: {
                published_at: "desc"
            }
        },
        where: {
            published_at: null
        }
    })
    return {
        props: {
            comments: comments
        }
    }
}

export default Page