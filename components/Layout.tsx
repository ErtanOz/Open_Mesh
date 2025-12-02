import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');

  if (isEmbed) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-slate-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="text-3xl">⬡</span> OpenMesh
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link to="/" className="hover:text-primary transition-colors">Explore</Link>
              <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
             <Link 
              to="/upload" 
              className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Upload Model
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="scroll-container h-full w-full">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;