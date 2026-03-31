import type { NextConfig } from 'next';
import securityProxy from './proxy';

const nextConfig: NextConfig = {
  devIndicators: false,
  reactCompiler: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'www.gstatic.com' },
    ],
  },
};

export default securityProxy(nextConfig);
