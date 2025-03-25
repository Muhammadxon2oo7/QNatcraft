import withNextIntl from 'next-intl/plugin';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        pathname: '/account123/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qqrnatcraft.uz',
        pathname: '/media/product_images/**',
      },
      {
        protocol: 'https',
        hostname: 'qqrnatcraft.uz',
        pathname: '/media/profile_images/**', // Profile images uchun qo‘shildi
      },
    ],
  },
};



export default withNextIntl()(nextConfig);
