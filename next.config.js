/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "telegra.ph",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "omzid.serv00.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
