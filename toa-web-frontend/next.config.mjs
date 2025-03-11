/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    domains: ['localhost', 'cms.talkingobjectsarchive.org', 'https://cms.talkingobjectsarchive.org'],
    formats: ['image/webp'], 
},
    env: {
        KB_API_FILE: process.env.KB_API_FILE,
        KB_API: process.env.KB_API,
        KB_USERNAME: process.env.KB_USERNAME,
        KB_PASSWORD: process.env.KB_PASSWORD,
      }
};

export default nextConfig;
