import React from "react";
import { getUserBadges } from "@/services/api/badgeService";
import Error from "@/components/ui/Error";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getDashboardData = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "requiredRole" } },
        { field: { Name: "duration" } },
        { field: { Name: "videoId" } },
        { field: { Name: "progress" } },
        { field: { Name: "category" } }
      ],
      orderBy: [
        { fieldName: "Id", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords('dashboard_item', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching dashboard data:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error fetching dashboard data:", error.message);
      throw error;
    }
  }
};

export const getDashboardById = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "requiredRole" } },
        { field: { Name: "duration" } },
        { field: { Name: "videoId" } },
        { field: { Name: "progress" } },
        { field: { Name: "category" } }
      ]
    };
    
    const response = await apperClient.getRecordById('dashboard_item', id, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error(`Dashboard item with ID ${id} not found`);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching dashboard item with ID ${id}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching dashboard item with ID ${id}:`, error.message);
      throw error;
    }
  }
};

export const updateProgress = async (id, progress) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    throw new Error('Progress must be a number between 0 and 100');
  }
  
  try {
    const params = {
      records: [{
        Id: id,
        progress: progress
      }]
    };
    
    const response = await apperClient.updateRecord('dashboard_item', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update dashboard progress ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error(failedUpdates[0].message || 'Update failed');
      }
      
      const successfulUpdate = response.results.find(result => result.success);
      return successfulUpdate ? successfulUpdate.data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating dashboard progress:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error updating dashboard progress:", error.message);
      throw error;
    }
  }
};

export const getDashboardWithBadges = async (userId = 1) => {
  try {
    const [dashboardItems, userBadges] = await Promise.all([
      getDashboardData(),
      getUserBadges(userId)
    ]);
    
    return {
      dashboardItems,
      userBadges
    };
  } catch (error) {
    console.error("Error fetching dashboard with badges:", error.message);
throw error;
  }
};