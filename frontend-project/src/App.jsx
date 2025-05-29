// React imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Cars from './components/cars/Cars';
import Services from './components/services/Services';
import ServiceRecords from './components/serviceRecords/ServiceRecords';
import Reports from './components/reports/Reports';
import NotFound from './components/layout/NotFound';
import Layout from './components/layout/Layout';

// Context
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes without layout */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes with layout */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/cars" element={
              <PrivateRoute>
                <Layout>
                  <Cars />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/services" element={
              <PrivateRoute>
                <Layout>
                  <Services />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/service-records" element={
              <PrivateRoute>
                <Layout>
                  <ServiceRecords />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/reports" element={
              <PrivateRoute>
                <Layout>
                  <Reports />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
