import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProgressCard from "@/components/molecules/ProgressCard";
import CourseCard from "@/components/molecules/CourseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getDashboardData } from "@/services/api/dashboardService";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError("대시보드 데이터를 불러오는데 실패했습니다.");
      toast.error("데이터 로딩 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCourseStart = (course) => {
    toast.success(`"${course.title}" 강의를 시작합니다!`);
  };

  if (loading) return <Loading type="cards" count={6} />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  if (!dashboardData.length) return <Empty title="대시보드 데이터 없음" description="표시할 학습 데이터가 없습니다." />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-2">안녕하세요, 학습자님! 👋</h1>
            <p className="text-lg opacity-90 mb-6">오늘도 글쓰기 실력 향상을 위한 학습을 시작해보세요.</p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="accent" className="hover-glow">
                <ApperIcon name="BookOpen" className="w-4 h-4 mr-2" />
                오늘의 강의
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <ApperIcon name="Target" className="w-4 h-4 mr-2" />
                학습 목표 설정
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard
          title="전체 진행률"
          progress={67}
          total={100}
          iconName="TrendingUp"
          color="primary"
        />
        <ProgressCard
          title="완료한 강의"
          progress={12}
          total={18}
          iconName="BookOpen"
          color="success"
        />
        <ProgressCard
          title="학습 시간"
          progress={24}
          total={40}
          iconName="Clock"
          color="accent"
        />
        <ProgressCard
          title="획득한 배지"
          progress={5}
          total={12}
          iconName="Award"
          color="primary"
        />
      </div>

      {/* Recent Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Learning */}
        <Card className="border-0 shadow-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Play" className="w-5 h-5 text-primary" />
              계속 학습하기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.slice(0, 3).map((course) => (
              <div key={course.Id} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">진행률: {course.progress}%</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleCourseStart(course)}>
                  <ApperIcon name="ArrowRight" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="border-0 shadow-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Trophy" className="w-5 h-5 text-accent" />
              최근 성과
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-success/10 to-green-600/10 rounded-lg border border-success/20">
              <div className="w-10 h-10 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Award" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">글쓰기 마스터 배지 획득</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">3일 전</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="Target" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">월 학습 목표 달성</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1주일 전</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-accent/10 to-yellow-400/10 rounded-lg border border-accent/20">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-full flex items-center justify-center">
                <ApperIcon name="Star" className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">5점 만점 강의 완료</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">2주일 전</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">추천 강의</h2>
          <Button variant="ghost" className="text-primary hover:text-secondary">
            전체 보기
            <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.slice(0, 3).map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              onStart={handleCourseStart}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;