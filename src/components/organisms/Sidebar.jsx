import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      description: "학습 현황 및 개요"
    },
    {
      label: "Courses",
      path: "/courses",
      icon: "BookOpen",
      description: "전체 강의 목록"
    },
{
      label: "Community",
      path: "/community",
      icon: "Users",
      description: "커뮤니티 및 소통"
    },
    {
      label: "Admin",
      path: "/admin",
      icon: "Settings",
      description: "강의 및 영상 관리"
    }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex h-screen w-64 flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">SkillFlow</h2>
            <p className="text-xs text-gray-400">Learning Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white shadow-lg border border-primary/30"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary shadow-lg" 
                    : "bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-primary/50 group-hover:to-secondary/50"
                )}>
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div>{item.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-accent shadow-lg" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-xl p-4 text-center">
          <ApperIcon name="Crown" className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">프리미엄 업그레이드</h3>
          <p className="text-xs text-gray-400 mb-3">모든 강의를 무제한으로</p>
          <button className="w-full bg-gradient-to-r from-accent to-yellow-400 text-gray-900 text-xs font-semibold py-2 px-3 rounded-lg hover:brightness-110 transition-all duration-200">
            지금 업그레이드
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 lg:hidden"
          >
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">SkillFlow</h2>
                    <p className="text-xs text-gray-400">Learning Platform</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white shadow-lg border border-primary/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        isActive 
                          ? "bg-gradient-to-r from-primary to-secondary shadow-lg" 
                          : "bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-primary/50 group-hover:to-secondary/50"
                      )}>
                        <ApperIcon name={item.icon} className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div>{item.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-accent shadow-lg" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-700">
              <div className="bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-xl p-4 text-center">
                <ApperIcon name="Crown" className="w-8 h-8 text-accent mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-white mb-1">프리미엄 업그레이드</h3>
                <p className="text-xs text-gray-400 mb-3">모든 강의를 무제한으로</p>
                <button className="w-full bg-gradient-to-r from-accent to-yellow-400 text-gray-900 text-xs font-semibold py-2 px-3 rounded-lg hover:brightness-110 transition-all duration-200">
                  지금 업그레이드
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;