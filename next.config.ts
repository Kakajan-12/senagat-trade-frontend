import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
      unoptimized: true,
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'api.senagat.com',
              port: '',
              pathname: '/uploads/**',
          },
      ],
  },
  // images: {
  //   unoptimized: true,
  //   remotePatterns: [
  //     {
  //       protocol: 'http',
  //       hostname: 'localhost',
  //       pathname: '/uploads/**'
  //     },
  //   ],
  // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
