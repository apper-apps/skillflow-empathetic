const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Badge management functions
export const getAllBadges = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "icon" } },
        { field: { Name: "criteria" } },
        { field: { Name: "resetCycle" } }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('badge', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching badges:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error fetching badges:", error.message);
      throw error;
    }
  }
};

export const getBadgeById = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "icon" } },
        { field: { Name: "criteria" } },
        { field: { Name: "resetCycle" } }
      ]
    };
    
    const response = await apperClient.getRecordById('badge', id, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error(`Badge with ID ${id} not found`);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching badge with ID ${id}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching badge with ID ${id}:`, error.message);
      throw error;
    }
  }
};

export const createBadge = async (badgeData) => {
  try {
    const params = {
      records: [{
        Name: badgeData.name,
        icon: badgeData.icon,
        criteria: badgeData.criteria,
        resetCycle: badgeData.resetCycle || 'none'
      }]
    };
    
    const response = await apperClient.createRecord('badge', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedCreations = response.results.filter(result => !result.success);
      
      if (failedCreations.length > 0) {
        console.error(`Failed to create badges ${failedCreations.length} records:${JSON.stringify(failedCreations)}`);
        
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
      console.error("Error creating badge:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error creating badge:", error.message);
      throw error;
    }
  }
};

export const updateBadge = async (id, updateData) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  
  try {
    const params = {
      records: [{
        Id: id,
        ...(updateData.name && { Name: updateData.name }),
        ...(updateData.icon && { icon: updateData.icon }),
        ...(updateData.criteria && { criteria: updateData.criteria }),
        ...(updateData.resetCycle && { resetCycle: updateData.resetCycle })
      }]
    };
    
    const response = await apperClient.updateRecord('badge', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update badges ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Update failed');
      }
      
      const successfulUpdate = response.results.find(result => result.success);
      return successfulUpdate ? successfulUpdate.data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating badge:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error updating badge:", error.message);
      throw error;
    }
  }
};

export const deleteBadge = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  
  try {
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord('badge', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete badges ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error(failedDeletions[0].message || 'Delete failed');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting badge:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error deleting badge:", error.message);
      throw error;
    }
  }
};

// User badge management functions
export const getUserBadges = async (userId = 1) => {
  try {
    const params = {
      fields: [
        { field: { Name: "earnedAt" } },
        { 
          field: { name: "userId" },
          referenceField: { field: { Name: "Name" } }
        },
        { 
          field: { name: "badgeId" },
          referenceField: { field: { Name: "Name" } }
        }
      ],
      where: [
        {
          FieldName: "userId",
          Operator: "EqualTo",
          Values: [userId]
        }
      ],
      orderBy: [
        { fieldName: "earnedAt", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('user_badge', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    // Get badge details for each user badge
    const userBadges = response.data || [];
    const enrichedBadges = await Promise.all(
      userBadges.map(async (userBadge) => {
        try {
          const badgeId = userBadge.badgeId?.Id || userBadge.badgeId;
          if (badgeId) {
            const badge = await getBadgeById(parseInt(badgeId));
            return {
              ...userBadge,
              badge: badge
            };
          }
        } catch (error) {
          console.error("Error fetching badge details:", error);
        }
        return userBadge;
      })
    );
    
    return enrichedBadges.filter(ub => ub.badge);
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching user badges:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error fetching user badges:", error.message);
      throw error;
    }
  }
};

export const awardBadge = async (userId, badgeId) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('User ID must be a positive integer');
  }
  if (!Number.isInteger(badgeId) || badgeId <= 0) {
    throw new Error('Badge ID must be a positive integer');
  }
  
  try {
    // Check if badge exists
    const badge = await getBadgeById(badgeId);
    if (!badge) {
      throw new Error(`Badge with ID ${badgeId} not found`);
    }
    
    const params = {
      records: [{
        userId: userId,
        badgeId: badgeId,
        earnedAt: new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord('user_badge', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedCreations = response.results.filter(result => !result.success);
      
      if (failedCreations.length > 0) {
        console.error(`Failed to award badges ${failedCreations.length} records:${JSON.stringify(failedCreations)}`);
        throw new Error(failedCreations[0].message || 'Award failed');
      }
      
      const successfulCreation = response.results.find(result => result.success);
      if (successfulCreation) {
        return {
          ...successfulCreation.data,
          badge: badge
        };
      }
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error awarding badge:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error awarding badge:", error.message);
      throw error;
    }
  }
};

export const revokeBadge = async (userId, badgeId) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('User ID must be a positive integer');
  }
  if (!Number.isInteger(badgeId) || badgeId <= 0) {
    throw new Error('Badge ID must be a positive integer');
  }
  
  try {
    // Find the user badge record
    const userBadgesParams = {
      fields: [
        { field: { Name: "Id" } }
      ],
      where: [
        {
          FieldName: "userId",
          Operator: "EqualTo",
          Values: [userId]
        },
        {
          FieldName: "badgeId",
          Operator: "EqualTo",
          Values: [badgeId]
        }
      ]
    };
    
    const userBadgesResponse = await apperClient.fetchRecords('user_badge', userBadgesParams);
    
    if (!userBadgesResponse.success || !userBadgesResponse.data?.length) {
      throw new Error('User badge not found');
    }
    
    const userBadgeId = userBadgesResponse.data[0].Id;
    
    const params = {
      RecordIds: [userBadgeId]
    };
    
    const response = await apperClient.deleteRecord('user_badge', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error revoking badge:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error revoking badge:", error.message);
      throw error;
    }
  }
};

export const resetMonthlyBadges = async () => {
  try {
    // Get all monthly badges
    const badgesParams = {
      fields: [
        { field: { Name: "Id" } }
      ],
      where: [
        {
          FieldName: "resetCycle",
          Operator: "EqualTo",
          Values: ["monthly"]
        }
      ]
    };
    
    const badgesResponse = await apperClient.fetchRecords('badge', badgesParams);
    
    if (!badgesResponse.success) {
      throw new Error(badgesResponse.message);
    }
    
    const monthlyBadgeIds = (badgesResponse.data || []).map(badge => badge.Id);
    
    if (monthlyBadgeIds.length === 0) {
      return { resetCount: 0 };
    }
    
    // Get all user badges for monthly badges
    const userBadgesParams = {
      fields: [
        { field: { Name: "Id" } }
      ],
      where: [
        {
          FieldName: "badgeId",
          Operator: "ExactMatch",
          Values: monthlyBadgeIds
        }
      ]
    };
    
    const userBadgesResponse = await apperClient.fetchRecords('user_badge', userBadgesParams);
    
    if (!userBadgesResponse.success) {
      throw new Error(userBadgesResponse.message);
    }
    
    const userBadgeIds = (userBadgesResponse.data || []).map(ub => ub.Id);
    
    if (userBadgeIds.length === 0) {
      return { resetCount: 0 };
    }
    
    // Delete all monthly user badges
    const params = {
      RecordIds: userBadgeIds
    };
    
    const response = await apperClient.deleteRecord('user_badge', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return { resetCount: userBadgeIds.length };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error resetting monthly badges:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error resetting monthly badges:", error.message);
      throw error;
    }
  }
};