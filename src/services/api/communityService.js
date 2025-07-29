import communityData from "@/services/mockData/communityData.json";

export const getCommunityPosts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 350));
  
  return [...communityData];
};

export const getPostById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const post = communityData.find(post => post.Id === parseInt(id));
  if (!post) {
    throw new Error("Post not found");
  }
  
  return { ...post };
};

export const getPostsByCategory = async (category) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (category === "All") {
    return [...communityData];
  }
  
  return communityData.filter(post => post.category === category);
};

export const createPost = async (postData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const maxId = Math.max(...communityData.map(post => post.Id));
  const newPost = {
    Id: maxId + 1,
    ...postData,
    createdAt: "방금 전",
    likes: 0,
    isLiked: false,
    replies: 0,
    views: 1
  };
  
  communityData.unshift(newPost);
  return { ...newPost };
};

export const updatePost = async (id, updates) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const postIndex = communityData.findIndex(post => post.Id === parseInt(id));
  if (postIndex === -1) {
    throw new Error("Post not found");
  }
  
  communityData[postIndex] = {
    ...communityData[postIndex],
    ...updates
  };
  
  return { ...communityData[postIndex] };
};

export const deletePost = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const postIndex = communityData.findIndex(post => post.Id === parseInt(id));
  if (postIndex === -1) {
    throw new Error("Post not found");
  }
  
  const deletedPost = { ...communityData[postIndex] };
  communityData.splice(postIndex, 1);
  
  return deletedPost;
};

export const likePost = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const postIndex = communityData.findIndex(post => post.Id === parseInt(id));
  if (postIndex === -1) {
    throw new Error("Post not found");
  }
  
  communityData[postIndex] = {
    ...communityData[postIndex],
    likes: communityData[postIndex].likes + (communityData[postIndex].isLiked ? -1 : 1),
    isLiked: !communityData[postIndex].isLiked
  };
  
  return { ...communityData[postIndex] };
};