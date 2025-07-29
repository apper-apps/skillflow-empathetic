const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getCommentsByPost = async (postId) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "content" } },
        { field: { Name: "author" } },
        { field: { Name: "postId" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "likes" } },
        { field: { Name: "isLiked" } }
      ],
      where: [
        {
          FieldName: "postId",
          Operator: "EqualTo",
          Values: [parseInt(postId)]
        }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('app_Comment', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching comments:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error fetching comments:", error.message);
      throw error;
    }
  }
};

export const createComment = async (commentData) => {
  try {
    const params = {
      records: [{
        Name: `Comment by ${commentData.author}`,
        content: commentData.content,
        author: commentData.author,
        postId: parseInt(commentData.postId),
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false
      }]
    };
    
    const response = await apperClient.createRecord('app_Comment', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedCreations = response.results.filter(result => !result.success);
      
      if (failedCreations.length > 0) {
        console.error(`Failed to create comments ${failedCreations.length} records:${JSON.stringify(failedCreations)}`);
        
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
      console.error("Error creating comment:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error creating comment:", error.message);
      throw error;
    }
  }
};

export const likeComment = async (id) => {
  try {
    // First get the current comment data
    const currentComment = await getCommentById(id);
    
    const newLikes = currentComment.likes + (currentComment.isLiked ? -1 : 1);
    const newIsLiked = !currentComment.isLiked;
    
    const params = {
      records: [{
        Id: parseInt(id),
        likes: newLikes,
        isLiked: newIsLiked
      }]
    };
    
    const response = await apperClient.updateRecord('app_Comment', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to like comments ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Like failed');
      }
      
      const successfulUpdate = response.results.find(result => result.success);
      return successfulUpdate ? successfulUpdate.data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error liking comment:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error liking comment:", error.message);
      throw error;
    }
  }
};

export const getCommentById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "content" } },
        { field: { Name: "author" } },
        { field: { Name: "postId" } },
        { field: { Name: "createdAt" } },
        { field: { Name: "likes" } },
        { field: { Name: "isLiked" } }
      ]
    };
    
    const response = await apperClient.getRecordById('app_Comment', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error("Comment not found");
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching comment with ID ${id}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching comment with ID ${id}:`, error.message);
      throw error;
    }
  }
};