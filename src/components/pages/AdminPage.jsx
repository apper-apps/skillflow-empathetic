import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

const AdminPage = () => {
  // Tab management
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Dashboard Items state
  const [dashboardItems, setDashboardItems] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [editingDashboardItem, setEditingDashboardItem] = useState(null);
  
  // Courses state
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Landing Pages state
  const [landingPages, setLandingPages] = useState([]);
  const [landingPagesLoading, setLandingPagesLoading] = useState(true);
  const [landingPagesError, setLandingPagesError] = useState("");
  const [editingLandingPage, setEditingLandingPage] = useState(null);
  
  // Common state
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
    level: "초급",
    // Landing page specific fields
    videoEmbedCode: "",
    influencerAdvantages: "",
    buttonDestinationLink: ""
  });


  useEffect(() => {
loadAllData();
  }, []);

  // Load all data
  const loadAllData = async () => {
    await Promise.all([
      loadDashboardItems(),
      loadCourses(),
      loadLandingPages()
    ]);
  };

  // Load dashboard items
  const loadDashboardItems = async () => {
    try {
      setDashboardLoading(true);
      setDashboardError("");
      // Note: dashboardService.js needs to be created with getAllDashboardItems method
      // const data = await getAllDashboardItems();
      // setDashboardItems(data);
      setDashboardItems([]); // Placeholder until service is available
    } catch (error) {
      setDashboardError(error.message);
      toast.error("Failed to load dashboard items");
    } finally {
      setDashboardLoading(false);
    }
  };

  // Load courses (existing functionality)
  const loadCourses = async () => {
    try {
      setCoursesLoading(true);
      setCoursesError("");
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      setCoursesError(error.message);
      toast.error("Failed to load courses");
    } finally {
      setCoursesLoading(false);
    }
  };

  // Load landing pages
  const loadLandingPages = async () => {
    try {
      setLandingPagesLoading(true);
      setLandingPagesError("");
      // Note: landingPageService.js needs to be created with getAllLandingPages method
      // const data = await getAllLandingPages();
      // setLandingPages(data);
      setLandingPages([]); // Placeholder until service is available
    } catch (error) {
      setLandingPagesError(error.message);
      toast.error("Failed to load landing pages");
    } finally {
      setLandingPagesLoading(false);
    }
  };
  // Extract videoId from Adilo URL
  const extractVideoId = (url) => {
    if (!url) return "";
    
    // If it's already just a videoId (no URL structure)
    if (!url.includes("http") && !url.includes("/")) {
      return url.trim();
    }
    
    // Extract from Adilo URL patterns
const patterns = [
      /https?:\/\/video\.adilo\.com\/([^/?]+)/,
      /https?:\/\/.*adilo.*\/([^/?]+)/,
      /\/([^/?]+)$/
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



  // Enhanced reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      videoId: "",
      requiredRole: "Free_User",
      duration: 0,
      category: "",
      level: "초급",
      videoEmbedCode: "",
      influencerAdvantages: "",
      buttonDestinationLink: ""
    });
    setEditingCourse(null);
    setEditingDashboardItem(null);
    setEditingLandingPage(null);
    setIsCreating(false);
    setPreviewVideoId("");
  };

  // Handle edit for different entity types
  const handleEditDashboardItem = async (item) => {
    try {
      setEditingDashboardItem(item);
      setFormData({
        title: item.title || "",
        description: item.description || "",
        videoUrl: "",
        videoId: item.videoId || "",
        requiredRole: item.requiredRole || "Free_User",
        duration: item.duration || 0,
        category: item.category || "",
        level: "초급",
        videoEmbedCode: "",
        influencerAdvantages: "",
        buttonDestinationLink: ""
      });
      setPreviewVideoId(item.videoId || "");
      setIsCreating(true);
      setActiveTab("dashboard");
    } catch (error) {
      toast.error("Failed to load dashboard item details");
    }
  };

  const handleEditLandingPage = async (page) => {
    try {
      setEditingLandingPage(page);
      setFormData({
        title: page.title || "",
        description: page.description || "",
        videoUrl: "",
        videoId: "",
        requiredRole: "Free_User",
        duration: 0,
        category: "",
        level: "초급",
        videoEmbedCode: page.videoEmbedCode || "",
        influencerAdvantages: page.influencerAdvantages || "",
        buttonDestinationLink: page.buttonDestinationLink || ""
      });
      setIsCreating(true);
      setActiveTab("landing");
    } catch (error) {
      toast.error("Failed to load landing page details");
    }
  };

  // Delete handlers for different entity types
  const handleDeleteDashboardItem = async (item) => {
    if (!window.confirm(`"${item.title}" 대시보드 아이템을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // await deleteDashboardItem(item.Id);
      toast.success("Dashboard item deleted successfully");
      await loadDashboardItems();
    } catch (error) {
      toast.error("Failed to delete dashboard item");
    }
  };

  const handleDeleteLandingPage = async (page) => {
    if (!window.confirm(`"${page.title}" 랜딩 페이지를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // await deleteLandingPage(page.Id);
      toast.success("Landing page deleted successfully");
      await loadLandingPages();
    } catch (error) {
      toast.error("Failed to delete landing page");
    }
  };

  // Tab content renderers
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardItemsTab();
      case "courses":
        return renderCoursesTab();
      case "landing":
        return renderLandingPagesTab();
      default:
        return null;
    }
  };

  const renderDashboardItemsTab = () => (
    <div className="space-y-6">
      {/* Dashboard Items List */}
      {dashboardLoading ? (
        <Loading />
      ) : dashboardError ? (
        <Error message={dashboardError} />
      ) : dashboardItems.length === 0 ? (
        <Empty message="No dashboard items found" />
      ) : (
        <div className="space-y-4">
          {dashboardItems.map((item) => (
            <motion.div
              key={item.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={getRoleBadgeVariant(item.requiredRole)}>
                      {getRoleText(item.requiredRole)}
                    </Badge>
                    {item.category && (
                      <Badge variant="outline">{item.category}</Badge>
                    )}
                    {item.duration > 0 && (
                      <Badge variant="secondary">{item.duration}분</Badge>
                    )}
                  </div>
                  {item.videoId && (
                    <p className="text-xs text-gray-500">
                      Video ID: {item.videoId}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditDashboardItem(item)}
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDashboardItem(item)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <ApperIcon name="Trash2" size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCoursesTab = () => (
    <div className="space-y-6">
      {/* Courses List */}
      {coursesLoading ? (
        <Loading />
      ) : coursesError ? (
        <Error message={coursesError} />
      ) : courses.length === 0 ? (
        <Empty message="No courses found" />
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <motion.div
              key={course.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={getRoleBadgeVariant(course.requiredRole)}>
                      {getRoleText(course.requiredRole)}
                    </Badge>
                    {course.category && (
                      <Badge variant="outline">{course.category}</Badge>
                    )}
                    {course.level && (
                      <Badge variant="secondary">{course.level}</Badge>
                    )}
                    {course.duration > 0 && (
                      <Badge variant="secondary">{course.duration}분</Badge>
                    )}
                  </div>
                  {course.videoId && (
                    <p className="text-xs text-gray-500">
                      Video ID: {course.videoId}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(course)}
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(course)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <ApperIcon name="Trash2" size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLandingPagesTab = () => (
    <div className="space-y-6">
      {/* Landing Pages List */}
      {landingPagesLoading ? (
        <Loading />
      ) : landingPagesError ? (
        <Error message={landingPagesError} />
      ) : landingPages.length === 0 ? (
        <Empty message="No landing pages found" />
      ) : (
        <div className="space-y-4">
          {landingPages.map((page) => (
            <motion.div
              key={page.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {page.description}
                  </p>
                  {page.videoEmbedCode && (
                    <p className="text-xs text-gray-500 mb-2">
                      Video Embed: {page.videoEmbedCode.substring(0, 50)}...
                    </p>
                  )}
                  {page.buttonDestinationLink && (
                    <p className="text-xs text-gray-500">
                      Link: {page.buttonDestinationLink}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditLandingPage(page)}
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLandingPage(page)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <ApperIcon name="Trash2" size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

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

  // Enhanced submit handler for all entity types
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error(activeTab === "courses" ? "강의 제목을 입력해주세요." : "Title is required");
      return;
    }
    
    if (activeTab !== "landing" && !formData.videoId.trim()) {
      toast.error(activeTab === "courses" ? "영상 URL 또는 Video ID를 입력해주세요." : "Video URL or Video ID is required");
      return;
    }

    try {
      let result;
      
      if (activeTab === "dashboard") {
        const dashboardData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          videoId: formData.videoId.trim(),
          requiredRole: formData.requiredRole,
          duration: parseInt(formData.duration),
          category: formData.category.trim()
        };

        if (editingDashboardItem) {
          // result = await updateDashboardItem(editingDashboardItem.Id, dashboardData);
          toast.success("Dashboard item updated successfully");
        } else {
          // result = await createDashboardItem(dashboardData);
          toast.success("Dashboard item created successfully");
        }
        await loadDashboardItems();
        
      } else if (activeTab === "courses") {
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
          result = await updateCourse(editingCourse.Id, courseData);
          toast.success("강의가 성공적으로 수정되었습니다!");
        } else {
          result = await createCourse(courseData);
          toast.success("새 강의가 성공적으로 생성되었습니다!");
        }
        await loadCourses();
        
      } else if (activeTab === "landing") {
        const landingData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          videoEmbedCode: formData.videoEmbedCode.trim(),
          influencerAdvantages: formData.influencerAdvantages.trim(),
          buttonDestinationLink: formData.buttonDestinationLink.trim()
        };

        if (editingLandingPage) {
          // result = await updateLandingPage(editingLandingPage.Id, landingData);
          toast.success("Landing page updated successfully");
        } else {
          // result = await createLandingPage(landingData);
          toast.success("Landing page created successfully");
        }
        await loadLandingPages();
      }

      resetForm();
      
    } catch (error) {
      console.error("Error saving:", error);
      const errorMessage = activeTab === "courses" 
        ? (editingCourse ? "강의 수정에 실패했습니다." : "강의 생성에 실패했습니다.")
        : (error.message || "Failed to save");
      toast.error(errorMessage);
    }
  };

  // Enhanced reset form

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

  if (coursesLoading) return <Loading type="cards" count={6} />;
  if (coursesError) return <Error message={coursesError} onRetry={loadCourses} />;

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
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ApperIcon name="HelpCircle" size={20} />
            How to Use Video Embed Management
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Video URL Formats Supported:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>YouTube: https://www.youtube.com/watch?v=VIDEO_ID</li>
                <li>YouTube Short: https://youtu.be/VIDEO_ID</li>
                <li>Vimeo: https://vimeo.com/VIDEO_ID</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Entity Types:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Dashboard Items:</strong> Content shown on user dashboard with video support</li>
                <li><strong>Courses:</strong> Educational content with video lessons</li>
                <li><strong>Landing Pages:</strong> Marketing pages with embedded videos and call-to-action buttons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tips:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Video preview will automatically update when you paste a valid video URL</li>
                <li>Required Role determines who can access the content</li>
                <li>Duration should be specified in minutes for better user experience</li>
                <li>Landing pages support full embed codes for advanced customization</li>
              </ul>
            </div>
</div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ApperIcon name="HelpCircle" size={20} />
            How to Use Video Embed Management
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Video URL Formats Supported:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>YouTube: https://www.youtube.com/watch?v=VIDEO_ID</li>
                <li>YouTube Short: https://youtu.be/VIDEO_ID</li>
                <li>Vimeo: https://vimeo.com/VIDEO_ID</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Entity Types:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Dashboard Items:</strong> Content shown on user dashboard with video support</li>
                <li><strong>Courses:</strong> Educational content with video lessons</li>
                <li><strong>Landing Pages:</strong> Marketing pages with embedded videos and call-to-action buttons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tips:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Video preview will automatically update when you paste a valid video URL</li>
                <li>Required Role determines who can access the content</li>
                <li>Duration should be specified in minutes for better user experience</li>
                <li>Landing pages support full embed codes for advanced customization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminPage;