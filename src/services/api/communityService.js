const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getCommunityPosts = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "content" } },
        { field: { Name: "author" } },
        { field: { Name: "category" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "likes" } },
        { field: { Name: "isLiked" } },
        { field: { Name: "replies" } },
        { field: { Name: "views" } }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('community_post', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching community posts:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error fetching community posts:", error.message);
      throw error;
    }
  }
};

export const getPostById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "content" } },
        { field: { Name: "author" } },
        { field: { Name: "category" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "likes" } },
        { field: { Name: "isLiked" } },
        { field: { Name: "replies" } },
        { field: { Name: "views" } }
      ]
    };
    
    const response = await apperClient.getRecordById('community_post', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error("Post not found");
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching post with ID ${id}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching post with ID ${id}:`, error.message);
      throw error;
    }
  }
};

export const getPostsByCategory = async (category) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "content" } },
        { field: { Name: "author" } },
        { field: { Name: "category" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "likes" } },
        { field: { Name: "isLiked" } },
        { field: { Name: "replies" } },
        { field: { Name: "views" } }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "DESC" }
      ]
    };
    
    if (category !== "All") {
      params.where = [
        {
          FieldName: "category",
          Operator: "EqualTo",
          Values: [category]
        }
      ];
    }
    
    const response = await apperClient.fetchRecords('community_post', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching posts by category ${category}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching posts by category ${category}:`, error.message);
      throw error;
    }
  }
};

export const createPost = async (postData) => {
  try {
    const params = {
      records: [{
        Name: postData.title,
        title: postData.title,
        content: postData.content,
        author: postData.author,
        category: postData.category,
        createdAt: "방금 전",
        likes: 0,
        isLiked: false,
        replies: 0,
        views: 1
      }]
    };
    
    const response = await apperClient.createRecord('community_post', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedCreations = response.results.filter(result => !result.success);
      
      if (failedCreations.length > 0) {
        console.error(`Failed to create community posts ${failedCreations.length} records:${JSON.stringify(failedCreations)}`);
        
        failedCreations.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      const successfulCreation = response.results.find(result => result.success);
      return successfulCreation ? successfulCreation.data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating post:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error creating post:", error.message);
      throw error;
    }
  }
};

export const updatePost = async (id, updates) => {
  try {
    const params = {
      records: [{
        Id: parseInt(id),
        ...(updates.title && { title: updates.title, Name: updates.title }),
        ...(updates.content && { content: updates.content }),
        ...(updates.author && { author: updates.author }),
        ...(updates.category && { category: updates.category }),
        ...(updates.likes !== undefined && { likes: updates.likes }),
        ...(updates.isLiked !== undefined && { isLiked: updates.isLiked }),
        ...(updates.replies !== undefined && { replies: updates.replies }),
        ...(updates.views !== undefined && { views: updates.views })
      }]
    };
    
    const response = await apperClient.updateRecord('community_post', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update community posts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Update failed');
      }
      
      const successfulUpdate = response.results.find(result => result.success);
      return successfulUpdate ? successfulUpdate.data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating post:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error updating post:", error.message);
      throw error;
    }
  }
};

export const deletePost = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('community_post', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete community posts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error(failedDeletions[0].message || 'Delete failed');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting post:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error deleting post:", error.message);
      throw error;
    }
  }
};

export const likePost = async (id) => {
  try {
    // First get the current post data
    const currentPost = await getPostById(id);
    
    const newLikes = currentPost.likes + (currentPost.isLiked ? -1 : 1);
    const newIsLiked = !currentPost.isLiked;
    
    const params = {
      records: [{
        Id: parseInt(id),
        likes: newLikes,
        isLiked: newIsLiked
      }]
    };
    
    const response = await apperClient.updateRecord('community_post', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to like community posts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Like failed');
      }
      
      const successfulUpdate = response.results.find(result => result.success);
      return successfulUpdate ? successfulUpdate.data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error liking post:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error liking post:", error.message);
      throw error;
    }
  }
};