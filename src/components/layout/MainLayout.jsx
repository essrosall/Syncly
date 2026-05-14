import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useLayout } from '../../contexts/LayoutContext';

const MainLayout = ({ children, user, onLogout, activeTab, onNotifications = () => {}, onMore = () => {}, onLayout = () => {} }) => {
  const { layoutMode, sidebarWidth } = useLayout();

  const sidebarOffsetClass = {
    compact: 'lg:ml-56',
    wide: 'lg:ml-72',
    full: 'lg:ml-96',
  }[sidebarWidth] || 'lg:ml-72';

  return (
    <div className="min-h-screen bg-transparent text-neutral-950 dark:text-neutral-100">
      <Navbar 
        user={user} 
        onLogout={onLogout}
        onNotifications={onNotifications}
        onMore={onMore}
        onLayout={onLayout}
      />
      <div className={`flex ${sidebarOffsetClass}`}>
        <Sidebar activeTab={activeTab} user={user} />
        <main role="main" className="flex-1 overflow-auto">
          <div className={`min-h-[calc(100vh-5rem)] p-6 transition-all duration-300 ${layoutMode === 'list' ? 'mx-auto w-full max-w-4xl' : 'mx-auto w-full max-w-none'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
