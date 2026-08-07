/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 uses Turbopack by default.
  // tesseract.js is loaded via dynamic import (client-only), no special config needed.
  turbopack: {},
};

export default nextConfig;
