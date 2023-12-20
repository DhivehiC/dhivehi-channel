import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
    runtime: "edge"
}

export default async function handler(req:NextRequest) {
    const { searchParams } = req.nextUrl;
    const image = searchParams.get('image');
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img 
                    src={`https://cdn.dhivehichannel.mv/media/${image}.jpg`}
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: "cover",
                        position: "absolute",
                        left: 0,
                        top: 0
                    }}
                    width={1200}
                    height={630}
                />
                <img 
                    src={`${process.env.NEXT_PUBLIC_URL}/images/ogs/og.png`}
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: "cover",
                        position: "absolute",
                        left: 0,
                        top: 0
                    }}
                    width={1200}
                    height={630}
                />
            </div>
        ), {
            width: 1200,
            height: 630
        }
    )
}