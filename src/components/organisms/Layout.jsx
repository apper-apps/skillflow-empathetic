import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Header onMenuToggle={toggleSidebar} showMenuButton={true} />
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user.firstName} {user.lastName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  로그아웃
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;