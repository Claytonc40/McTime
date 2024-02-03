/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  ...withPWA({
    pwa: {
      dest: "public",
      swSrc: "public/sw.js", // Caminho para o Service Worker personalizado
    },
  }),
};

export default nextConfig;
