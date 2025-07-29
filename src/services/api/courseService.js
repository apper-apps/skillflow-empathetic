const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getAllCourses = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "requiredRole" } },
        { field: { Name: "duration" } },
        { field: { Name: "videoId" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "students" } },
        { field: { Name: "rating" } }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('course', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching courses:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error fetching courses:", error.message);
      throw error;
    }
  }
};

export const getCourseById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "requiredRole" } },
        { field: { Name: "duration" } },
        { field: { Name: "videoId" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "students" } },
        { field: { Name: "rating" } }
      ]
    };
    
    const response = await apperClient.getRecordById('course', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error("Course not found");
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching course with ID ${id}:`, error.message);
      throw error;
    }
  }
};

export const getCoursesByRole = async (role) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "requiredRole" } },
        { field: { Name: "duration" } },
        { field: { Name: "videoId" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "students" } },
        { field: { Name: "rating" } }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "ASC" }
      ]
    };
    
    if (role !== "All") {
      params.where = [
        {
          FieldName: "requiredRole",
          Operator: "EqualTo",
          Values: [role]
        }
      ];
    }
    
    const response = await apperClient.fetchRecords('course', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching courses by role ${role}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching courses by role ${role}:`, error.message);
      throw error;
    }
  }
};

export const createCourse = async (courseData) => {
  try {
    const params = {
      records: [{
        Name: courseData.title,
        title: courseData.title,
        description: courseData.description,
        requiredRole: courseData.requiredRole,
        duration: courseData.duration,
        videoId: courseData.videoId,
        category: courseData.category,
        level: courseData.level || "초급",
        students: 0,
        rating: 5
      }]
    };
    
    const response = await apperClient.createRecord('course', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedCreations = response.results.filter(result => !result.success);
      
      if (failedCreations.length > 0) {
        console.error(`Failed to create courses ${failedCreations.length} records:${JSON.stringify(failedCreations)}`);
        
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
      console.error("Error creating course:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error creating course:", error.message);
      throw error;
    }
  }
};

export const updateCourse = async (id, updates) => {
  try {
    const params = {
      records: [{
        Id: parseInt(id),
        ...(updates.title && { title: updates.title, Name: updates.title }),
        ...(updates.description && { description: updates.description }),
        ...(updates.requiredRole && { requiredRole: updates.requiredRole }),
        ...(updates.duration !== undefined && { duration: updates.duration }),
        ...(updates.videoId && { videoId: updates.videoId }),
        ...(updates.category && { category: updates.category }),
        ...(updates.level && { level: updates.level }),
        ...(updates.students !== undefined && { students: updates.students }),
        ...(updates.rating !== undefined && { rating: updates.rating })
      }]
    };
    
    const response = await apperClient.updateRecord('course', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update courses ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Update failed');
      }
      
      const successfulUpdate = response.results.find(result => result.success);
      return successfulUpdate ? successfulUpdate.data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating course:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error updating course:", error.message);
      throw error;
    }
  }
};

export const deleteCourse = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('course', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete courses ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error(failedDeletions[0].message || 'Delete failed');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting course:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error deleting course:", error.message);
      throw error;
    }
  }
};

// Series navigation functions
export const getNextLesson = async (currentCourseId, category) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "requiredRole" } },
        { field: { Name: "duration" } },
        { field: { Name: "videoId" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "students" } },
        { field: { Name: "rating" } }
      ],
      where: [
        {
          FieldName: "category",
          Operator: "EqualTo",
          Values: [category]
        },
        {
          FieldName: "Id",
          Operator: "GreaterThan",
          Values: [parseInt(currentCourseId)]
        }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "ASC" }
      ],
      pagingInfo: {
        limit: 1,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords('course', params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    return response.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching next lesson:", error.message);
    return null;
  }
};

export const getPreviousLesson = async (currentCourseId, category) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "requiredRole" } },
        { field: { Name: "duration" } },
        { field: { Name: "videoId" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "students" } },
        { field: { Name: "rating" } }
      ],
      where: [
        {
          FieldName: "category",
          Operator: "EqualTo",
          Values: [category]
        },
        {
          FieldName: "Id",
          Operator: "LessThan",
          Values: [parseInt(currentCourseId)]
        }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "DESC" }
      ],
      pagingInfo: {
        limit: 1,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords('course', params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    return response.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching previous lesson:", error.message);
    return null;
  }
};

export const getSeriesProgress = async (category, completedLessonIds = []) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } }
      ],
      where: [
        {
          FieldName: "category",
          Operator: "EqualTo",
          Values: [category]
        }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('course', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    const seriesCourses = response.data || [];
    const totalLessons = seriesCourses.length;
    const completedLessons = completedLessonIds.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    return {
      category,
      totalLessons,
      completedLessons,
      progressPercentage,
      nextLesson: seriesCourses.find(course => !completedLessonIds.includes(course.Id)),
      courses: seriesCourses
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching series progress for ${category}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching series progress for ${category}:`, error.message);
      throw error;
    }
  }
};

export const getCoursesBySeries = async (category) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "requiredRole" } },
        { field: { Name: "duration" } },
        { field: { Name: "videoId" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "students" } },
        { field: { Name: "rating" } }
      ],
      where: [
        {
          FieldName: "category",
          Operator: "EqualTo",
          Values: [category]
        }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('course', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching courses by series ${category}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching courses by series ${category}:`, error.message);
      throw error;
    }
  }
};