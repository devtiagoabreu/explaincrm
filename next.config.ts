/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Garantir que o Prisma seja tratado corretamente
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

export default nextConfig