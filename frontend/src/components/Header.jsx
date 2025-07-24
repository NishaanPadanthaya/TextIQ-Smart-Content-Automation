import React from 'react';
import { Menu, X, Zap } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex items-center ml-4 lg:ml-0">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <Zap className="h-8 w-8 text-primary-600" />
                  <span className="ml-2 text-xl font-bold text-gradient">
                    TextIQ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <span className="text-sm text-gray-500">
                AI-Powered Text Enhancement
              </span>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 hidden sm:inline">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
