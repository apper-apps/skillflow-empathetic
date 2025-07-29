import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StepCard = ({ 
  step, 
  title, 
  description,
  iconName,
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card className="relative h-full border-0 shadow-card hover:shadow-elevated bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <CardContent className="relative p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg mb-4">
              <ApperIcon name={iconName} className="w-8 h-8 text-white" />
            </div>
            
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-accent to-yellow-400 rounded-full text-sm font-bold text-gray-900 shadow-md">
              {step}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StepCard;