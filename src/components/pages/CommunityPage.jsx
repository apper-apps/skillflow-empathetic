import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getCommunityPosts } from "@/services/api/communityService";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "질문", "성공사례", "팁공유", "자유게시판"];

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

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.Id === postId 
        ? { ...post, likes: post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
    toast.success("좋아요를 눌렀습니다!");
  };

  const handleReply = (postId) => {
    toast.info("댓글 기능은 준비 중입니다.");
  };

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
            
            <Button variant="primary" className="hover-glow">
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
          onAction={() => toast.info("글 작성 기능은 준비 중입니다.")}
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
                      
                      <div className="flex items-center justify-between">
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
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
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
    </motion.div>
  );
};

export default CommunityPage;