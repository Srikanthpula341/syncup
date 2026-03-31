import type { NextConfig } from 'next';

/**
 * SyncUp Security Proxy — Next.js 16 compatible
 * Injects hardened HTTP security headers into every response.
 */
export default function proxy(nextConfig: NextConfig = {}): NextConfig {
  return {
    ...nextConfig,
    async headers() {
      const existingHeaders = await nextConfig.headers?.() ?? [];
      const securityHeaders = [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https: http:",
            "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com",
            "frame-src 'none'",
            "object-src 'none'",
          ].join('; '),
        },
      ];

      return [
        ...existingHeaders,
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ];
    },
  };
}
