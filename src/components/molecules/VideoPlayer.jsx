import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { getNextLesson, getPreviousLesson } from "@/services/api/courseService";

const VideoPlayer = ({ 
  videoId, 
  title,
  course,
  onLessonComplete,
  onNavigateToLesson,
  autoPlayNext = true,
  showSeriesProgress = true,
  className = "" 
}) => {
  const [nextLesson, setNextLesson] = useState(null);
  const [previousLesson, setPreviousLesson] = useState(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [autoPlayCountdown, setAutoPlayCountdown] = useState(0);
  const iframeRef = useRef(null);
  const countdownRef = useRef(null);
// Load next and previous lessons
  useEffect(() => {
    const loadSeriesNavigation = async () => {
      if (!course?.category) return;
      
      try {
        const [next, previous] = await Promise.all([
          getNextLesson(course.Id, course.category),
          getPreviousLesson(course.Id, course.category)
        ]);
        setNextLesson(next);
        setPreviousLesson(previous);
      } catch (error) {
        console.error("Failed to load series navigation:", error);
      }
    };
    
    loadSeriesNavigation();
  }, [course]);

  // Handle video end and auto-play countdown
  useEffect(() => {
    if (isVideoEnded && autoPlayNext && nextLesson) {
      setAutoPlayCountdown(5);
      countdownRef.current = setInterval(() => {
        setAutoPlayCountdown(prev => {
          if (prev <= 1) {
            handleAutoPlayNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isVideoEnded, autoPlayNext, nextLesson]);

  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    if (onLessonComplete) {
      onLessonComplete(course);
    }
    toast.success("수업을 완료했습니다!");
  };

  const handleAutoPlayNext = () => {
    if (nextLesson && onNavigateToLesson) {
      setAutoPlayCountdown(0);
      setIsVideoEnded(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      onNavigateToLesson(nextLesson);
      toast.info(`다음 수업: ${nextLesson.title}`);
    }
  };

  const handleManualNavigation = (lesson) => {
    setAutoPlayCountdown(0);
    setIsVideoEnded(false);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    if (onNavigateToLesson) {
      onNavigateToLesson(lesson);
    }
  };

  const cancelAutoPlay = () => {
    setAutoPlayCountdown(0);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="overflow-hidden border-0 shadow-elevated">
        {title && (
          <div className="p-4 bg-gradient-to-r from-primary to-secondary">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">{title}</h3>
              </div>
              {showSeriesProgress && course?.category && (
                <div className="flex items-center text-sm opacity-90">
                  <ApperIcon name="BookOpen" className="w-4 h-4 mr-1" />
                  <span>{course.category} 시리즈</span>
                </div>
              )}
            </div>
          </div>
        )}
<div className="video-wrapper bg-black relative">
          {videoId ? (
            <iframe
              ref={iframeRef}
              src={`https://video.adilo.com/${videoId}`}
              allowFullScreen
              title={title || "Video Player"}
              className="w-full h-full"
              onLoad={() => {
                // Simulate video end detection (in real implementation, use video API)
                setTimeout(() => {
                  handleVideoEnded();
                }, 30000); // Simulate 30 second video for demo
              }}
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
          
          {/* Auto-play countdown overlay */}
          {autoPlayCountdown > 0 && nextLesson && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 text-center max-w-sm mx-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{autoPlayCountdown}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">다음 수업이 곧 시작됩니다</h3>
                <p className="text-gray-600 mb-4 text-sm">{nextLesson.title}</p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAutoPlayNext}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                    지금 시작
                  </Button>
                  <Button
                    onClick={cancelAutoPlay}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        {(previousLesson || nextLesson) && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {previousLesson && (
                  <Button
                    onClick={() => handleManualNavigation(previousLesson)}
                    variant="ghost"
                    size="sm"
                    className="text-left"
                  >
                    <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-1" />
                    <div>
                      <div className="text-xs text-gray-500">이전 수업</div>
                      <div className="text-sm font-medium truncate max-w-32">
                        {previousLesson.title}
                      </div>
                    </div>
                  </Button>
                )}
              </div>
              
              <div className="flex-1 text-center">
                {course && (
                  <div className="text-xs text-gray-500">
                    {course.category} 시리즈
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex justify-end">
                {nextLesson && (
                  <Button
                    onClick={() => handleManualNavigation(nextLesson)}
                    variant="primary"
                    size="sm"
                    className="text-right"
                  >
                    <div>
                      <div className="text-xs opacity-90">다음 수업</div>
                      <div className="text-sm font-medium truncate max-w-32">
                        {nextLesson.title}
                      </div>
                    </div>
                    <ApperIcon name="ChevronRight" className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default VideoPlayer;