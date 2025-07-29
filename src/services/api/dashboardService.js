import dashboardData from "@/services/mockData/dashboardData.json";
import { getUserBadges } from "@/services/api/badgeService";

export const getDashboardData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [...dashboardData];
};

export const getDashboardById = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  
  await new Promise(resolve => setTimeout(resolve, 200));
  const item = dashboardData.find(d => d.Id === id);
  if (!item) {
    throw new Error(`Dashboard item with ID ${id} not found`);
  }
  return { ...item };
};

export const updateProgress = async (id, progress) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    throw new Error('Progress must be a number between 0 and 100');
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = dashboardData.findIndex(d => d.Id === id);
  if (index === -1) {
    throw new Error(`Dashboard item with ID ${id} not found`);
  }
  
  dashboardData[index] = { ...dashboardData[index], progress };
  return { ...dashboardData[index] };
};

export const getDashboardWithBadges = async (userId = 1) => {
  const [dashboardItems, userBadges] = await Promise.all([
    getDashboardData(),
    getUserBadges(userId)
  ]);
  
  return {
    dashboardItems,
    userBadges
  };
};