import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ 
  course, 
  onStart,
  className = ""
}) => {
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Free_User": return "default";
      case "Premium": return "primary";
      case "Master": return "accent";
      default: return "default";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "Free_User": return "무료";
      case "Premium": return "프리미엄";
      case "Master": return "마스터";
      default: return role;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="h-full hover-lift border-0 shadow-card hover:shadow-elevated bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getRoleBadgeVariant(course.requiredRole)}>
                  {getRoleText(course.requiredRole)}
                </Badge>
                {course.duration && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                    {course.duration}분
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {course.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <ApperIcon name="Users" className="w-3 h-3 mr-1" />
              <span>128명 수강중</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <ApperIcon name="Star" className="w-3 h-3 mr-1 fill-current text-yellow-400" />
              <span className="text-gray-900 dark:text-white font-medium">4.8</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button
            onClick={() => onStart?.(course)}
            variant="primary"
            className="w-full hover-glow"
          >
            <ApperIcon name="Play" className="w-4 h-4 mr-2" />
            수업 시작
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;