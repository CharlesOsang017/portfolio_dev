import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';

// Admin pages
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import Dashboard from './pages/admin/Dashboard';
import Projects from './pages/admin/Projects';
import Experience from './pages/admin/Experience';
import Skills from './pages/admin/Skills';
import ContactInfo from './pages/admin/ContactInfo';
import Assets from './pages/admin/Assets';
import Settings from './pages/admin/Settings';

// Public site
import PublicPortfolio from './pages/PublicPortfolio';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/"  element={<PublicPortfolio />} />

      {/* Auth */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<Register />} />

      {/* Admin (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="experience" element={<Experience />} />
        <Route path="skills" element={<Skills />} />
        <Route path="contact" element={<ContactInfo />} />
        <Route path="assets" element={<Assets />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
