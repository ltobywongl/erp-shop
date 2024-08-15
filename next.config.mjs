/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "publicen.s3.ap-northeast-1.amazonaws.com",
          port: "",
          pathname: "*/**",
        },
      ],
      minimumCacheTTL: 5,
    },
  };

export default nextConfig;
