import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CourseCard from "@/components/molecules/CourseCard";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getAllCourses } from "@/services/api/courseService";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const roles = ["All", "Free_User", "Premium", "Master"];

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      setError("강의 목록을 불러오는데 실패했습니다.");
      toast.error("강의 데이터 로딩 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (selectedRole !== "All") {
      filtered = filtered.filter(course => course.requiredRole === selectedRole);
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [courses, selectedRole, searchTerm]);

  const handleCourseStart = (course) => {
    setSelectedCourse(course);
    toast.success(`"${course.title}" 강의를 시작합니다!`);
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
  };

  const getRoleText = (role) => {
    switch (role) {
      case "Free_User": return "무료";
      case "Premium": return "프리미엄";
      case "Master": return "마스터";
      default: return "전체";
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Free_User": return "default";
      case "Premium": return "primary";
      case "Master": return "accent";
      default: return "outline";
    }
  };

  if (loading) return <Loading type="cards" count={6} />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">전체 강의</h1>
          <p className="text-lg opacity-90">체계적인 4단계 학습으로 글쓰기 수익화를 마스터하세요</p>
        </div>
      </div>

      {/* Video Player */}
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <VideoPlayer
            videoId={selectedCourse.videoId}
            title={selectedCourse.title}
            className="mb-8"
          />
        </motion.div>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-card bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="강의 제목이나 내용으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? getRoleBadgeVariant(role) : "ghost"}
                  size="sm"
                  onClick={() => handleRoleFilter(role)}
                  className="transition-all duration-200"
                >
                  {getRoleText(role)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <ApperIcon name="BookOpen" className="w-4 h-4" />
              <span>총 {filteredCourses.length}개 강의</span>
            </div>
            
            {selectedRole !== "All" && (
              <Badge variant={getRoleBadgeVariant(selectedRole)}>
                {getRoleText(selectedRole)} 전용
              </Badge>
            )}
            
            {searchTerm && (
              <Badge variant="outline">
                "{searchTerm}" 검색 결과
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Empty 
          title="강의를 찾을 수 없습니다"
          description="검색 조건을 변경하거나 필터를 재설정해보세요."
          iconName="BookOpen"
          actionText="전체 강의 보기"
          onAction={() => {
            setSearchTerm("");
            setSelectedRole("All");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CourseCard
                course={course}
                onStart={handleCourseStart}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-card bg-gradient-to-br from-success/10 to-green-600/10 border border-success/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1,234+</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">활성 학습자</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Clock" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">120+</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">총 학습 시간</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-accent/10 to-yellow-400/10 border border-accent/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Star" className="w-6 h-6 text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">4.9/5</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">평균 만족도</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CoursesPage;