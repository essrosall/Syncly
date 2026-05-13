import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children, user, onLogout, activeTab, onNotifications = () => {}, onMore = () => {}, onLayout = () => {} }) => {
  return (
    <div className="min-h-screen bg-transparent text-neutral-950 dark:text-neutral-100">
      <Navbar 
        user={user} 
        onLogout={onLogout}
        onNotifications={onNotifications}
        onMore={onMore}
        onLayout={onLayout}
      />
      <div className="flex lg:ml-72">
        <Sidebar activeTab={activeTab} user={user} />
        <main role="main" className="flex-1 overflow-auto">
          <div className="min-h-[calc(100vh-5rem)] p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
