
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/pages/Login';
import HomePage from '@/pages/Home';
import RegisterPage from '@/pages/Register';
import AppLayout from './layouts/ApplicationLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import MenuPage from '@/pages/Menu/Menu';
import QRCodesPage from '@/pages/QRCodes';
import OrdersPage from '@/pages/Orders';
import StaffPage from '@/pages/Staff';
import SettingsPage from '@/pages/Settings';
import VerifyPage from './pages/Verify';
import SelectBusinessPage from './pages/Businesses/Businesses';
import CreateOrganizationPage from './pages/Businesses/Create';



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
            <AppLayout>
              <VerifyPage />
            </AppLayout>
          } />


          <Route
            path="/businesses"
            element={
              
                <AppLayout>
                  <SelectBusinessPage/>
                </AppLayout>
              
            }
          />

          <Route
            path="/business/create"
            element={
              
                <AppLayout>
                  <CreateOrganizationPage />
                </AppLayout>
              
            }
          />
          
          <Route
            path="/dashboard"
            element={
              
                <DashboardLayout>
                  <HomePage/>
                </DashboardLayout>
              
            }
          /> 



          <Route path="/" element={
            
              <DashboardLayout>
                <HomePage />
              </DashboardLayout>
            
          } />

          <Route path="/menu" element={
            
              <DashboardLayout>
                <MenuPage />
              </DashboardLayout>
            
          } />

          <Route path="/qr-codes" element={
            
              <DashboardLayout>
                <QRCodesPage />
              </DashboardLayout>
            
          } />

          <Route path="/orders" element={
            
              <DashboardLayout>
                <OrdersPage />
              </DashboardLayout>
            
          } />
          <Route path="/staff" element={
            
              <DashboardLayout>
                <StaffPage />
              </DashboardLayout>
            
          } />
          <Route path="/settings" element={
            
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            
          } />
          
    
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;