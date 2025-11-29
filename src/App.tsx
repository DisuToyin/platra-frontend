
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/Login';
import HomePage from '@/pages/Home';
import RegisterPage from '@/pages/Register';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import MenuPage from '@/pages/Menu';
import QRCodesPage from '@/pages/QRCodes';
import OrdersPage from '@/pages/Orders';
import StaffPage from '@/pages/Staff';
import SettingsPage from '@/pages/Settings';
import VerifyPage from './pages/Verify';
import SelectBusinessPage from './pages/Businesses/Businesses';
import CreateOrganizationPage from './pages/Businesses/Create';
import OrganizationProtectedRoute from './components/OrganizationProtectedRoute';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          } />

          <Route path="/register" element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          } />

          <Route path="/verify" element={
            <PublicLayout>
              <VerifyPage />
            </PublicLayout>
          } />


          <Route
            path="/businesses"
            element={
              <ProtectedRoute>
                <PublicLayout>
                  <SelectBusinessPage/>
                </PublicLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/create"
            element={
              <ProtectedRoute>
                <PublicLayout>
                  <CreateOrganizationPage />
                </PublicLayout>
              </ProtectedRoute>
            }
          />
          
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <HomePage/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          /> */}

          <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <OrganizationProtectedRoute>
          <DashboardLayout>
            <HomePage />
          </DashboardLayout>
        </OrganizationProtectedRoute>
      </ProtectedRoute>
    }
  />

          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout>
                <HomePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/menu" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MenuPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/qr-codes" element={
            <ProtectedRoute>
              <DashboardLayout>
                <QRCodesPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <DashboardLayout>
                <OrdersPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/staff" element={
            <ProtectedRoute>
              <DashboardLayout>
                <StaffPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
    
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;