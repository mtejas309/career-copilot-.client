import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LazyMotion, domAnimation, AnimatePresence, m as motion, useReducedMotion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { springs } from './hooks/useMotion'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import DashboardLayout from './components/DashboardLayout'

const Landing        = lazy(() => import('./pages/Landing'))
const Signup         = lazy(() => import('./pages/Signup'))
const Login          = lazy(() => import('./pages/Login'))
const DashboardHome  = lazy(() => import('./pages/DashboardHome'))
const ResumeAnalysis = lazy(() => import('./pages/ResumeAnalysis'))
const Roadmap        = lazy(() => import('./pages/Roadmap'))
const Chat           = lazy(() => import('./pages/Chat'))
const Profile        = lazy(() => import('./pages/Profile'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const JobReadiness   = lazy(() => import('./pages/JobReadiness'))
const DailyStudyPlan = lazy(() => import('./pages/DailyStudyPlan'))
const CareerPath     = lazy(() => import('./pages/CareerPath'))
const MockInterview  = lazy(() => import('./pages/MockInterview'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function PageWrapper({ children }) {
  const reduced = useReducedMotion()
  const pageVariants = {
    initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 },
    animate: { opacity: 1, y: 0, transition: reduced ? { duration: 0 } : springs.page },
    exit:    { opacity: reduced ? 1 : 0, y: reduced ? 0 : -6, transition: reduced ? { duration: 0 } : { duration: 0.14, ease: 'easeIn' } },
  }
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-full">
      <Suspense fallback={<PageFallback />}>
        {children}
      </Suspense>
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PageWrapper><DashboardHome /></PageWrapper>} />
          <Route path="resume" element={<PageWrapper><ResumeAnalysis /></PageWrapper>} />
          <Route path="roadmap" element={<PageWrapper><Roadmap /></PageWrapper>} />
          <Route path="chat" element={<PageWrapper><Chat /></PageWrapper>} />
          <Route path="profile" element={<PageWrapper><Profile /></PageWrapper>} />
          <Route path="job-readiness" element={<PageWrapper><JobReadiness /></PageWrapper>} />
          <Route path="daily-plan"    element={<PageWrapper><DailyStudyPlan /></PageWrapper>} />
          <Route path="career-path"   element={<PageWrapper><CareerPath /></PageWrapper>} />
          <Route path="interview"     element={<PageWrapper><MockInterview /></PageWrapper>} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <PageWrapper><AdminDashboard /></PageWrapper>
              </AdminRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </LazyMotion>
  )
}
