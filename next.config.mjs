import { withNextVideo } from 'next-video/process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
};

export default withNextVideo(nextConfig);
