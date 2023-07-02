import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('/api/') ||
        req.nextUrl.pathname == '/404' ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return
    }

    if (!req.nextUrl.pathname.startsWith('/auth')) {
        try {
            const token = req.cookies.get('token')?.value
            const secret = process.env.ACCESS_TOKEN_SECRET
            if (token && secret) {
                const {payload} = await jwtVerify(String(token), new TextEncoder().encode(secret));
                if (!payload) {
                    return NextResponse.redirect(
                        new URL(`/auth/sign-in`, req.url)
                    )
                }
            } else {
                return NextResponse.redirect(
                    new URL(`/auth/sign-in`, req.url)
                )
            }
        } catch (error) {
            return NextResponse.redirect(
                new URL(`/404`, req.url)
            )
        }
    } else {
        try {
            const token = req.cookies.get('token')?.value
            const secret = process.env.ACCESS_TOKEN_SECRET
            if (token && secret) {
                const {payload} = await jwtVerify(String(token), new TextEncoder().encode(secret));
                if (payload) {
                    return NextResponse.redirect(
                        new URL(`/`, req.url)
                    )
                }
            }
        } catch (error) {
            new URL(`/404`, req.url)
        }
    }
}