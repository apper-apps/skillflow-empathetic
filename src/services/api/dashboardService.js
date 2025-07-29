import dashboardData from "@/services/mockData/dashboardData.json";

export const getDashboardData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [...dashboardData];
};

export const getDashboardById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const item = dashboardData.find(item => item.Id === parseInt(id));
  if (!item) {
    throw new Error("Dashboard item not found");
  }
  
  return { ...item };
};

export const updateProgress = async (id, progress) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const itemIndex = dashboardData.findIndex(item => item.Id === parseInt(id));
  if (itemIndex === -1) {
    throw new Error("Dashboard item not found");
  }
  
  dashboardData[itemIndex] = {
    ...dashboardData[itemIndex],
    progress: progress
  };
  
  return { ...dashboardData[itemIndex] };
};