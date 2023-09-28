/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose"]
  },
  images: {
    domains: [
      "img.clerk.com",
      "uploadthing.com",
      "placehold.co",
      "images.clerk.dev",
      "utfs.io"
    ]
  }
}

module.exports = nextConfig
