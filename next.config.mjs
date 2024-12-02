/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: process.env.IMAGE_HOSTNAME,
          port: "",
          pathname: "*/**",
        },
      ],
      minimumCacheTTL: 5,
    },
  };

export default nextConfig;
