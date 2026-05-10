import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children, user, onLogout, activeTab }) => {
  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar activeTab={activeTab} />
        <main role="main" className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
