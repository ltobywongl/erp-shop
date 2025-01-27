/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./utils/loaders/imageLoader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.IMAGE_HOSTNAME,
        port: "",
        pathname: "*/**",
      },
    ],
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
