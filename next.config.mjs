/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // All photography is bundled locally in /public (downloaded from the
    // restaurant's own site). The optimizer is skipped so the project also
    // runs in offline / static-export environments without native deps.
    unoptimized: true,
  },
};

export default nextConfig;
