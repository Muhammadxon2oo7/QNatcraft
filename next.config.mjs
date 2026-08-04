import withNextIntl from 'next-intl/plugin';
import withPWA from 'next-pwa';

const withIntl = withNextIntl();

const nextConfig = withPWA({
  dest: 'public', // service worker qayerga yaratilishini belgilaydi
  register: true,
  skipWaiting: true,
  // Dev rejimda service worker eski JS ni keshdan berib, o'zgarishlar ko'rinmay qolardi.
  disable: process.env.NODE_ENV === 'development',
})(withIntl({
  async redirects() {
    return [
      // O'z profilim /Xprofile kabinetida ochiladi.
      { source: '/profile/me', destination: '/Xprofile', permanent: false },
    ];
  },
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
        hostname: 'api.qqcraft.uz',
        pathname: '/media/product_images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qqcraft.uz',
        pathname: '/media/profile_images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qqcraft.uz',
        pathname: '/media/workshop_images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qqcraft.uz',
        pathname: '/media/360_images/**',
      }
    ],
  },
}));

export default nextConfig;
