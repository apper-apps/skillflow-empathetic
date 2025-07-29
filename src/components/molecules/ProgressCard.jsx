import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const ProgressCard = ({ 
  title,
  progress = 0,
  total = 100,
  iconName = "TrendingUp",
  color = "primary"
}) => {
  const percentage = Math.round((progress / total) * 100);
  
  const colorClasses = {
    primary: "from-primary to-secondary",
    accent: "from-accent to-yellow-400",
    success: "from-success to-green-600"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover-lift border-0 shadow-card hover:shadow-elevated bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
              <ApperIcon name={iconName} className="w-4 h-4 text-white" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {percentage}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {progress}/{total}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color]}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressCard;