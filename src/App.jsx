import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { MobileNavProvider } from './contexts/MobileNavContext';
import { LayoutProvider } from './contexts/LayoutContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Workspaces from './pages/Workspaces';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Signup from './pages/Signup';

function App() {
  return (
    <LayoutProvider>
      <MobileNavProvider>
        <Router>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/workspaces" element={<Workspaces />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </MobileNavProvider>
    </LayoutProvider>
  );
}

export default App;
