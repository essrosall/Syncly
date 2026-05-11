import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children, user, onLogout, activeTab }) => {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar activeTab={activeTab} />

      <main role="main" className="w-full ml-0 lg:ml-72 overflow-auto">
        <div className="min-h-[calc(100vh-5rem)] p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
