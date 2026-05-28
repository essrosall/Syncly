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
import { ThemeToggle } from './components/layout';

function App() {
  return (
    <LayoutProvider>
      <MobileNavProvider>
        <Router>
          <div className="fixed bottom-3 right-3 z-[10001] sm:bottom-4 sm:right-4">
            <ThemeToggle className="h-10 w-10 border border-neutral-200 bg-white text-neutral-900 shadow-[0_12px_30px_rgba(17,25,43,0.12)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 sm:h-12 sm:w-12" />
          </div>
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
