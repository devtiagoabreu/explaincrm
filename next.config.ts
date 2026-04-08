/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Desabilitar turbopack no build da Vercel
  turbopack: false,
  // Configuração para compatibilidade com Vercel
  output: 'standalone',
  // Ignorar erros de ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignorar erros de TypeScript durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig