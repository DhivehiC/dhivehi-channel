/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
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
