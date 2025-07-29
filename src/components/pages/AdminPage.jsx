import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Card, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '@/services/api/courseService';

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoId: '',
    category: '',
    level: '초급',
    requiredRole: 'Free_User',
    duration: 0
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCourses();
      setCourses(data || []);
    } catch (err) {
      setError(err.message);
      toast.error('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Adilo video URL
    if (formData.videoId && !isValidAdiloUrl(formData.videoId)) {
      toast.error('올바른 Adilo 비디오 URL을 입력해주세요.');
      return;
    }

    try {
      setFormLoading(true);
      
      const courseData = {
        ...formData,
        duration: parseInt(formData.duration) || 0
      };

      if (editingCourse) {
        await updateCourse(editingCourse.Id, courseData);
        toast.success('강의가 성공적으로 수정되었습니다.');
      } else {
        await createCourse(courseData);
        toast.success('새 강의가 성공적으로 추가되었습니다.');
      }

      await loadCourses();
      resetForm();
      setShowModal(false);
      setEditingCourse(null);
    } catch (err) {
      toast.error(editingCourse ? '강의 수정에 실패했습니다.' : '강의 추가에 실패했습니다.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      videoId: course.videoId || '',
      category: course.category || '',
      level: course.level || '초급',
      requiredRole: course.requiredRole || 'Free_User',
      duration: course.duration || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm('이 강의를 삭제하시겠습니까?')) return;

    try {
      await deleteCourse([courseId]);
      toast.success('강의가 성공적으로 삭제되었습니다.');
      await loadCourses();
    } catch (err) {
      toast.error('강의 삭제에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoId: '',
      category: '',
      level: '초급',
      requiredRole: 'Free_User',
      duration: 0
    });
  };

  const isValidAdiloUrl = (url) => {
    return url.includes('adilo.com') || /^[a-zA-Z0-9-_]+$/.test(url);
  };

  const extractVideoId = (url) => {
    if (!url) return '';
    if (url.includes('adilo.com')) {
      const match = url.match(/adilo\.com\/([a-zA-Z0-9-_]+)/);
      return match ? match[1] : url;
    }
    return url;
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Free_User': return 'success';
      case 'Premium': return 'warning';
      case 'Master': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">강의 관리</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Adilo 비디오 URL을 포함한 강의 콘텐츠를 관리합니다.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingCourse(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          새 강의 추가
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {courses.length === 0 ? (
            <Empty
              title="등록된 강의가 없습니다"
              description="새 강의를 추가하여 시작하세요."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      강의 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      비디오 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      권한
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      시간/카테고리
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course) => (
                    <motion.tr
                      key={course.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.title || course.Name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {course.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white font-mono">
                          {course.videoId ? (
                            <div className="flex items-center gap-2">
                              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                                {course.videoId}
                              </span>
                              <ApperIcon name="ExternalLink" className="w-3 h-3 text-gray-400" />
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">미설정</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getRoleBadgeVariant(course.requiredRole)}>
                          {course.requiredRole === 'Free_User' ? '무료' : 
                           course.requiredRole === 'Premium' ? '프리미엄' : '마스터'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div>{course.duration}분</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {course.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(course)}
                            className="flex items-center gap-1"
                          >
                            <ApperIcon name="Edit2" className="w-3 h-3" />
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(course.Id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" className="w-3 h-3" />
                            삭제
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingCourse ? '강의 수정' : '새 강의 추가'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    강의 제목 *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="강의 제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    강의 설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="강의 설명을 입력하세요"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adilo 비디오 URL 또는 ID *
                  </label>
                  <Input
                    type="text"
                    value={formData.videoId}
                    onChange={(e) => setFormData({ ...formData, videoId: extractVideoId(e.target.value) })}
                    placeholder="예: https://video.adilo.com/video-id 또는 video-id"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    전체 URL 또는 비디오 ID만 입력할 수 있습니다.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      카테고리
                    </label>
                    <Input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="카테고리 입력"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      소요 시간 (분)
                    </label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      난이도
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="초급">초급</option>
                      <option value="중급">중급</option>
                      <option value="고급">고급</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      필요 권한
                    </label>
                    <select
                      value={formData.requiredRole}
                      onChange={(e) => setFormData({ ...formData, requiredRole: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Free_User">무료</option>
                      <option value="Premium">프리미엄</option>
                      <option value="Master">마스터</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                    disabled={formLoading}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="flex items-center gap-2"
                  >
                    {formLoading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                    {editingCourse ? '수정' : '추가'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;