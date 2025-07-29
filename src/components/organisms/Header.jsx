import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle, showMenuButton = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-200 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="lg:hidden"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">
                SkillFlow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <ApperIcon name="Users" className="w-4 h-4" />
              <span>1,234명의 학습자</span>
            </div>
            
            <Button variant="accent" size="sm" className="hover-glow">
              <ApperIcon name="Crown" className="w-4 h-4 mr-2" />
              프리미엄 가입
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;