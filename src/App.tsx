import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import ScrollTop from './components/ScrollTop'
import { Facebook, Instagram, Twitter , MessageCircle} from "lucide-react";
import Footer from './components/Footer'
import Header from './components/Header'

const Home = lazy(() => import('./pages/Home/Home'))
const DichVu = lazy(() => import('./pages/DichVu/DichVu'))
const DichVuDetail = lazy(() => import('./pages/DichVu/DichVuDetail'))
const DuAn = lazy(() => import('./pages/DuAn/DuAn'))
const DuAnDetail = lazy(() => import('./pages/DuAn/DuAnDetail'))
const SanPham = lazy(() => import('./pages/SanPham/SanPham'))
const SanPhamDetail = lazy(() => import('./pages/SanPham/SanPhamDetail'))
const KienThuc = lazy(() => import('./pages/KienThuc/KienThuc'))
const TinTuc = lazy(() => import('./pages/TinTuc/TinTuc'))
const TinTucDetail = lazy(() => import('./pages/TinTuc/TinTucDetail'))
const LienHe = lazy(() => import('./pages/LienHe/LienHe'))

const queryClient = new QueryClient()

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}

function App() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <PageTransition>
          <Suspense fallback={
            <div className="container-pad py-20 flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-brand border-neutral-200" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dich-vu" element={<DichVu />} />
              <Route path="/dich-vu/:id" element={<DichVuDetail />} />
              <Route path="/du-an" element={<DuAn />} />
              <Route path="/du-an/:id" element={<DuAnDetail />} />
              <Route path="/san-pham" element={<SanPham />} />
              <Route path="/san-pham/:id" element={<SanPhamDetail />} />
              <Route path="/kien-thuc" element={<KienThuc />} />
              <Route path="/tin-tuc" element={<TinTuc />} />
              <Route path="/tin-tuc/:id" element={<TinTucDetail />} />
              <Route path="/lien-he" element={<LienHe />} />
            </Routes>
          </Suspense>
        </PageTransition>
        <ScrollTop />

        {/* Floating quick chat button + small icons */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="mb-2 flex flex-col items-center gap-2"
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setChatOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow-md hover:scale-105 transition-transform"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setChatOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow-md hover:scale-105 transition-transform"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                aria-label="Twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setChatOpen((s) => !s)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-red shadow-lg transition-transform hover:scale-105"
            aria-label="Chat"
            aria-expanded={chatOpen}
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>

        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
