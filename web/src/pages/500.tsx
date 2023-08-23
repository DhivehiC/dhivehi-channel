import { NextSeo } from 'next-seo'
import React, { Fragment } from 'react'
import { Player } from '@lottiefiles/react-lottie-player'

const ServerError = () => {
    return (
        <Fragment>
            <NextSeo title={"Dhivehi Channel"} description={"This is the streaming platform for dhivehi channel"} openGraph={{
                url: "",
                title: "",
                description: "",
                siteName: "",
                images: [
                    { url: "" }
                ]
            }} twitter={{ cardType: "summary_large_image" }} />
            <div className='flex h-screen items-center justify-center -mt-[100px] flex-col container mx-auto'>
                <Player
                    autoplay
                    loop
                    src="/servererror.json"
                    style={{ width: '300%', maxWidth: 300, marginBottom: 24 }}
                />
                <h1 className='text-gray-700 font-black text-3xl'>{"ވެބްސައިޓްއަށް މައްސަލައެއް ކުރިމަތިވެއްޖެއެވެ."}</h1>
            </div>  
        </Fragment>
    )
}

export default ServerError