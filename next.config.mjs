/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  ...withPWA({
    pwa: {
      dest: "public",
    },
  }),
};

export default nextConfig;
