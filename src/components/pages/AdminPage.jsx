import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import { 
  getAllCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getCourseById 
} from "@/services/api/courseService";

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [previewVideoId, setPreviewVideoId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    videoId: "",
    requiredRole: "Free_User",
    duration: 0,
    category: "",
    level: "초급"
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllCourses();
      setCourses(data);
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

  // Extract videoId from Adilo URL
  const extractVideoId = (url) => {
    if (!url) return "";
    
    // If it's already just a videoId (no URL structure)
    if (!url.includes("http") && !url.includes("/")) {
      return url.trim();
    }
    
    // Extract from Adilo URL patterns
    const patterns = [
      /https?:\/\/video\.adilo\.com\/([^\/\?]+)/,
      /https?:\/\/.*adilo.*\/([^\/\?]+)/,
      /\/([^\/\?]+)$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return url.trim();
  };

  const handleVideoUrlChange = (value) => {
    setFormData(prev => ({
      ...prev,
      videoUrl: value,
      videoId: extractVideoId(value)
    }));
    
    // Update preview
    const videoId = extractVideoId(value);
    if (videoId && videoId.length > 3) {
      setPreviewVideoId(videoId);
    } else {
      setPreviewVideoId("");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      videoId: "",
      requiredRole: "Free_User",
      duration: 0,
      category: "",
      level: "초급"
    });
    setEditingCourse(null);
    setPreviewVideoId("");
    setIsCreating(false);
  };

  const handleEdit = async (course) => {
    try {
      const courseData = await getCourseById(course.Id);
      setEditingCourse(courseData);
      setFormData({
        title: courseData.title || "",
        description: courseData.description || "",
        videoUrl: courseData.videoId ? `https://video.adilo.com/${courseData.videoId}` : "",
        videoId: courseData.videoId || "",
        requiredRole: courseData.requiredRole || "Free_User",
        duration: courseData.duration || 0,
        category: courseData.category || "",
        level: courseData.level || "초급"
      });
      setPreviewVideoId(courseData.videoId || "");
      setIsCreating(false);
    } catch (error) {
      toast.error("강의 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("강의 제목을 입력해주세요.");
      return;
    }
    
    if (!formData.videoId.trim()) {
      toast.error("영상 URL 또는 Video ID를 입력해주세요.");
      return;
    }

    try {
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoId: formData.videoId.trim(),
        requiredRole: formData.requiredRole,
        duration: parseInt(formData.duration) || 0,
        category: formData.category.trim(),
        level: formData.level
      };

      if (editingCourse) {
        await updateCourse(editingCourse.Id, courseData);
        toast.success("강의가 성공적으로 수정되었습니다!");
      } else {
        await createCourse(courseData);
        toast.success("새 강의가 성공적으로 생성되었습니다!");
      }
      
      resetForm();
      loadCourses();
    } catch (error) {
      toast.error(editingCourse ? "강의 수정에 실패했습니다." : "강의 생성에 실패했습니다.");
    }
  };

  const handleDelete = async (course) => {
    if (!confirm(`"${course.title}" 강의를 정말 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteCourse(course.Id);
      toast.success("강의가 성공적으로 삭제되었습니다!");
      loadCourses();
    } catch (error) {
      toast.error("강의 삭제에 실패했습니다.");
    }
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
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">강의 관리</h1>
              <p className="text-lg opacity-90">Adilo 영상을 활용한 강의 콘텐츠 관리</p>
            </div>
            <Button
              onClick={handleCreate}
              variant="accent"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              새 강의 추가
            </Button>
          </div>
        </div>
      </div>

      {/* Course Form */}
      {(isCreating || editingCourse) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-elevated">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingCourse ? "강의 수정" : "새 강의 생성"}
                </h2>
                <Button
                  onClick={resetForm}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">강의 제목 *</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="강의 제목을 입력하세요"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Adilo 영상 URL 또는 Video ID *</label>
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) => handleVideoUrlChange(e.target.value)}
                        placeholder="https://video.adilo.com/your-video-id 또는 video-id"
                        required
                      />
                      {formData.videoId && (
                        <p className="text-xs text-green-600 mt-1">
                          추출된 Video ID: {formData.videoId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">강의 설명</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="강의에 대한 상세 설명을 입력하세요"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">접근 권한</label>
                        <select
                          value={formData.requiredRole}
                          onChange={(e) => handleInputChange("requiredRole", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="Free_User">무료</option>
                          <option value="Premium">프리미엄</option>
                          <option value="Master">마스터</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">강의 시간 (분)</label>
                        <Input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange("duration", e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">카테고리</label>
                        <Input
                          value={formData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          placeholder="예: 강점 찾기, 콘셉트 설계"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">난이도</label>
                        <select
                          value={formData.level}
                          onChange={(e) => handleInputChange("level", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="초급">초급</option>
                          <option value="중급">중급</option>
                          <option value="고급">고급</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Video Preview */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">영상 미리보기</label>
                      {previewVideoId ? (
                        <VideoPlayer
                          videoId={previewVideoId}
                          title="미리보기"
                          autoPlayNext={false}
                          showSeriesProgress={false}
                          className="max-w-full"
                        />
                      ) : (
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <ApperIcon name="Play" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>영상 URL을 입력하면 미리보기가 표시됩니다</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="ghost"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    {editingCourse ? "수정 완료" : "강의 생성"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Course List */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">전체 강의 목록</h2>
            <Badge variant="default">
              총 {courses.length}개 강의
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {courses.length === 0 ? (
            <Empty 
              title="등록된 강의가 없습니다"
              description="새 강의를 추가하여 시작해보세요."
              iconName="BookOpen"
              actionText="강의 추가"
              onAction={handleCreate}
            />
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {courses.map((course, index) => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold truncate">{course.title}</h3>
                        <Badge variant={getRoleBadgeVariant(course.requiredRole)}>
                          {getRoleText(course.requiredRole)}
                        </Badge>
                        {course.category && (
                          <Badge variant="outline">
                            {course.category}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                        {course.description || "설명이 없습니다."}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Clock" className="w-3 h-3" />
                          <span>{course.duration || 0}분</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Play" className="w-3 h-3" />
                          <span>ID: {course.videoId || "없음"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Users" className="w-3 h-3" />
                          <span>{course.students || 0}명</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Star" className="w-3 h-3" />
                          <span>{course.rating || 0}/5</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(course)}
                        variant="ghost"
                        size="sm"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(course)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-0 shadow-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Info" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Adilo 영상 사용 가이드</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Adilo 영상 URL 전체를 붙여넣거나 Video ID만 입력하세요</p>
                <p>• 지원 형식: https://video.adilo.com/your-video-id</p>
                <p>• Video ID는 영상 URL의 마지막 부분입니다</p>
                <p>• 영상이 public으로 설정되어 있는지 확인하세요</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminPage;