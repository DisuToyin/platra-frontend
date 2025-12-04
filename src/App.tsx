
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/pages/Login';
import HomePage from '@/pages/Home';
import RegisterPage from '@/pages/Register';
import AppLayout from './layouts/ApplicationLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import MenuPage from '@/pages/Menu/Menu';

import OrdersPage from '@/pages/Orders';
import StaffPage from '@/pages/Staff';
import SettingsPage from '@/pages/Settings';
import VerifyPage from './pages/Verify';
import SelectBusinessPage from './pages/Businesses/Businesses';
import CreateOrganizationPage from './pages/Businesses/Create';
import QRPage from './pages/QR/QR';
import AcceptInvitePage from '@/pages/Invites/ViewInvite';
import DigitalMenu from '@/pages/Customers/CustomerMenuPage';
import StartCustomerSession from '@/pages/Customers/StartCustomerSession';
import PaymentVerification from './pages/Payments/PaymentVerification';
import PaymentSuccess from './pages/Payments/PaymentSuccess';
import PaymentFailure from './pages/Payments/PaymentFailed';



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

          <Route path="/invites/accept/:token" element={
            <PublicLayout>
              <AcceptInvitePage />
            </PublicLayout>
          }/>




          <Route path="/explore-menu/start/:token" element={
            <PublicLayout>
              <StartCustomerSession />
            </PublicLayout>
          }/>

          <Route path="/explore-menu/order" element={
            <PublicLayout>
              <DigitalMenu />
            </PublicLayout>
          }/>





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

          <Route path="/payment/verify" 
            element={
            <PublicLayout>            
              <PaymentVerification />
            </PublicLayout>

          } 
          />


          <Route path="/payment/success" 
            element={
            <PublicLayout>            
              <PaymentSuccess />
            </PublicLayout>

          } 
          />

          <Route path="/payment/failure" 
            element={
            <PublicLayout>            
              <PaymentFailure />
            </PublicLayout>

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

          <Route path="/qrcodes" element={
            
              <DashboardLayout>
                <QRPage />
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