import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { MultiStepForm } from './features/applications/components/MultiStepForm'
import { ReviewDashboard } from './features/reviews/components/ReviewDashboard'
import { ApprovalDashboard } from './features/approvals/components/ApprovalDashboard'
import { Dashboard } from './features/dashboard/components/Dashboard'
import { SignInPage } from './pages/auth/SignInPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { VerifyLicensePage } from './pages/public/VerifyLicensePage'
import { Toaster } from '@/components/ui/toaster'

const queryClient = new QueryClient()

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInUrl="/sign-in" signUpUrl="/sign-up">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* Public or common routes */}
            <Route path="/verify/:id" element={<VerifyLicensePage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Customer Routes */}
            <Route path="/apply" element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <div className="min-h-screen bg-slate-50/50 p-8">
                  <div className="max-w-4xl mx-auto">
                    <MultiStepForm />
                  </div>
                </div>
              </ProtectedRoute>
            } />

            {/* Reviewer Routes */}
            <Route path="/review" element={
              <ProtectedRoute allowedRoles={['REVIEWER']}>
                <ReviewDashboard />
              </ProtectedRoute>
            } />

            {/* Approver Routes */}
            <Route path="/approve" element={
              <ProtectedRoute allowedRoles={['APPROVER']}>
                <ApprovalDashboard />
              </ProtectedRoute>
            } />

            <Route path="/unauthorized" element={<div className="p-8 text-destructive text-xl font-semibold">You do not have permission to view this page.</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default App
