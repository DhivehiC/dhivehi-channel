/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'imagedelivery.net',
          // port: '',
          pathname: '/**', 
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3002',
          pathname: '/**', 
        },
        {
          protocol: 'https',
          hostname: 'cdn.dhivehichannel.mv',
          // port: '',
          pathname: '/**', 
        },
      ],
    },
}

module.exports = nextConfig
