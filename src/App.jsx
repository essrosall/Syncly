import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Workspaces from './pages/Workspaces';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
