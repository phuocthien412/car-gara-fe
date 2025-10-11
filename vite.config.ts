import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ bên ngoài ở môi trường dev
    port: 3000
  },
  preview: {
    host: '0.0.0.0', // Cho phép truy cập từ bên ngoài ở môi trường khi đã build code
    port: 3000,
    allowedHosts: ['abc.com', 'localhost', '172.38.11.200'] // Thêm các host được phép
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  }
})
