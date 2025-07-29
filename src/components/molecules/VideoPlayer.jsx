import { motion } from "framer-motion";
import { Card } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const VideoPlayer = ({ 
  videoId, 
  title,
  className = "" 
}) => {
  const embedCode = `<iframe src='https://video.adilo.com/${videoId}' allowfullscreen></iframe>`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="overflow-hidden border-0 shadow-elevated">
        {title && (
          <div className="p-4 bg-gradient-to-r from-primary to-secondary">
            <div className="flex items-center text-white">
              <ApperIcon name="Play" className="w-5 h-5 mr-2" />
              <h3 className="font-semibold">{title}</h3>
            </div>
          </div>
        )}
        
        <div className="video-wrapper bg-black">
          {videoId ? (
            <iframe
              src={`https://video.adilo.com/${videoId}`}
              allowFullScreen
              title={title || "Video Player"}
              className="w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <ApperIcon name="Play" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">비디오를 준비중입니다</p>
                <p className="text-sm opacity-75">잠시만 기다려주세요</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default VideoPlayer;