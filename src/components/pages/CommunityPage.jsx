import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { createComment, getCommentsByPost, likeComment } from "@/services/api/commentService";
import { createPost, getCommunityPosts, likePost, updatePost } from "@/services/api/communityService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  
  // New post creation states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "질문"
  });
  const [createLoading, setCreateLoading] = useState(false);

  const categories = ["All", "질문", "성공사례", "팁공유", "자유게시판"];
  const createCategories = ["질문", "성공사례", "팁공유", "자유게시판"];

  const handleCreatePost = async () => {
    if (!newPost.title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!newPost.content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setCreateLoading(true);
    try {
      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        author: "현재 사용자", // TODO: Replace with actual authenticated user name
        category: newPost.category
      };

      const createdPost = await createPost(postData);
      
      if (createdPost) {
        toast.success("게시글이 작성되었습니다!");
        setShowCreateModal(false);
        setNewPost({ title: "", content: "", category: "질문" });
        await loadCommunityPosts(); // Refresh the posts list
      }
    } catch (error) {
      console.error("Error creating post:", error.message);
      toast.error("게시글 작성에 실패했습니다.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewPost({ title: "", content: "", category: "질문" });
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showCreateModal) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showCreateModal]);

  const loadCommunityPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCommunityPosts();
      setPosts(data);
    } catch (err) {
      setError("커뮤니티 게시물을 불러오는데 실패했습니다.");
      toast.error("커뮤니티 데이터 로딩 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunityPosts();
  }, []);

  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case "질문": return "default";
      case "성공사례": return "success";
      case "팁공유": return "primary";
      case "자유게시판": return "accent";
      default: return "outline";
    }
  };

const handleLike = async (postId) => {
    try {
      const updatedPost = await likePost(postId);
      if (updatedPost) {
        setPosts(posts.map(post => 
          post.Id === postId ? updatedPost : post
        ));
        toast.success(updatedPost.isLiked ? "좋아요를 눌렀습니다!" : "좋아요를 취소했습니다!");
      }
    } catch (error) {
      console.error("Error liking post:", error.message);
      toast.error("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleReply = async (postId) => {
    if (expandedComments[postId]) {
      setExpandedComments(prev => ({ ...prev, [postId]: false }));
      return;
    }

    setExpandedComments(prev => ({ ...prev, [postId]: true }));
    await loadComments(postId);
  };

  const loadComments = async (postId) => {
    if (comments[postId]) return; // Already loaded
    
    setCommentLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const postComments = await getCommentsByPost(postId);
      setComments(prev => ({ ...prev, [postId]: postComments }));
    } catch (error) {
      toast.error("댓글을 불러오는데 실패했습니다.");
      console.error("Error loading comments:", error);
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

const handleCommentSubmit = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }

    setCommentLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const newComment = await createComment({
        content: text,
        author: 1, // TODO: Replace with actual authenticated user ID
        postId: postId
      });

      if (newComment) {
        setComments(prev => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])]
        }));
        setCommentText(prev => ({ ...prev, [postId]: "" }));
        
        // Update post replies count
        setPosts(prev => prev.map(post => 
          post.Id === postId 
            ? { ...post, replies: post.replies + 1 }
            : post
        ));
        
        // Update post replies count in database
        try {
          const currentPost = posts.find(p => p.Id === postId);
          if (currentPost) {
            await updatePost(postId, { replies: currentPost.replies + 1 });
          }
        } catch (error) {
          console.error("Error updating post replies count:", error);
        }
        
        toast.success("댓글이 작성되었습니다!");
      }
    } catch (error) {
      toast.error("댓글 작성에 실패했습니다.");
      console.error("Error creating comment:", error);
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleCommentLike = async (commentId, postId) => {
    try {
      const updatedComment = await likeComment(commentId);
      if (updatedComment) {
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId].map(comment => 
            comment.Id === commentId ? updatedComment : comment
          )
        }));
        toast.success("댓글 좋아요!");
      }
    } catch (error) {
      toast.error("좋아요 처리에 실패했습니다.");
      console.error("Error liking comment:", error);
    }
};

  // Create Post Modal
  const CreatePostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">새 글 작성</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              카테고리
            </label>
            <div className="flex flex-wrap gap-2">
              {createCategories.map((category) => (
                <Button
                  key={category}
                  variant={newPost.category === category ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setNewPost(prev => ({ ...prev, category }))}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              제목
            </label>
            <Input
              placeholder="게시글 제목을 입력하세요..."
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              className="w-full"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              내용
            </label>
            <textarea
              placeholder="내용을 작성하세요..."
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={handleCloseModal}
            disabled={createLoading}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleCreatePost}
            disabled={createLoading || !newPost.title.trim() || !newPost.content.trim()}
            className="hover-glow"
          >
            {createLoading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                게시 중...
              </>
            ) : (
              <>
                <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                게시하기
              </>
            )}
          </Button>
        </div>
      </motion.div>
</div>
  );

  if (loading) return <Loading type="list" count={5} />;
  if (error) return <Error message={error} onRetry={loadCommunityPosts} />;

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
          <h1 className="text-3xl font-bold mb-2">커뮤니티</h1>
          <p className="text-lg opacity-90">동료 학습자들과 함께 성장하고 경험을 나누세요</p>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1,234</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">활성 멤버</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="MessageSquare" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">567</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">이번 달 게시물</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">89%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">성공 사례</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Heart" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">2,456</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">총 좋아요</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories & New Post */}
      <Card className="border-0 shadow-card bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? getCategoryBadgeVariant(category) : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-200"
                >
                  {category}
                </Button>
              ))}
            </div>
<Button 
              variant="primary" 
              className="hover-glow"
              onClick={() => setShowCreateModal(true)}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              새 글 작성
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <Empty 
          title="게시물이 없습니다"
description="첫 번째 게시물을 작성해보세요!"
          iconName="MessageSquare"
          actionText="새 글 작성"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-card hover:shadow-elevated transition-all duration-200 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="User" className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getCategoryBadgeVariant(post.category)}>
                              {post.category}
                            </Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {post.author}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {post.createdAt}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.Id)}
                            className={`flex items-center gap-2 ${post.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                          >
                            <ApperIcon name="Heart" className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReply(post.Id)}
                            className={`flex items-center gap-2 ${expandedComments[post.Id] ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}
                          >
                            <ApperIcon name="MessageSquare" className="w-4 h-4" />
                            {post.replies}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                          >
                            <ApperIcon name="Eye" className="w-4 h-4" />
                            {post.views}
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Share2" className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Comments Section */}
                      {expandedComments[post.Id] && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                          {/* Comment Form */}
                          <div className="mb-4">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-accent to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                                <ApperIcon name="User" className="w-4 h-4 text-gray-900" />
                              </div>
                              <div className="flex-1">
                                <Input
                                  placeholder="댓글을 작성하세요..."
                                  value={commentText[post.Id] || ""}
                                  onChange={(e) => setCommentText(prev => ({ ...prev, [post.Id]: e.target.value }))}
                                  className="mb-2"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleCommentSubmit(post.Id);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleCommentSubmit(post.Id)}
                                  disabled={commentLoading[post.Id] || !commentText[post.Id]?.trim()}
                                  className="w-full sm:w-auto"
                                >
                                  {commentLoading[post.Id] ? (
                                    <>
                                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                                      작성 중...
                                    </>
                                  ) : (
                                    "댓글 작성"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-3">
                            {commentLoading[post.Id] && !comments[post.Id] ? (
                              <div className="flex justify-center py-4">
                                <ApperIcon name="Loader2" className="w-5 h-5 animate-spin text-gray-400" />
                              </div>
                            ) : comments[post.Id] && comments[post.Id].length > 0 ? (
                              comments[post.Id].map((comment) => (
                                <div key={comment.Id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                                    <ApperIcon name="User" className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {comment.author?.Name || comment.author}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                      {comment.content}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCommentLike(comment.Id, post.Id)}
                                      className={`text-xs flex items-center gap-1 ${comment.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                                    >
                                      <ApperIcon name="Heart" className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                                      {comment.likes}
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
                                첫 번째 댓글을 작성해보세요!
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Popular Topics */}
      <Card className="border-0 shadow-card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
            인기 토픽
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">#월수익100만원</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">234개 게시물</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-success/10 to-green-600/10 border border-success/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">#글쓰기팁</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">189개 게시물</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-accent/10 to-yellow-400/10 border border-accent/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">#수익화전략</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">156개 게시물</p>
            </div>
          </div>
</CardContent>
      </Card>

      {/* Create Post Modal */}
      {showCreateModal && <CreatePostModal />}
    </motion.div>
  );
};

export default CommunityPage;