import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children, user, onLogout, activeTab }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar activeTab={activeTab} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
