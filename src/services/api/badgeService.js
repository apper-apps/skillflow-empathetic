import badgesData from "@/services/mockData/badgesData.json";
import userBadgesData from "@/services/mockData/userBadgesData.json";

// Badge management functions
export const getAllBadges = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...badgesData];
};

export const getBadgeById = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  
  await new Promise(resolve => setTimeout(resolve, 200));
  const badge = badgesData.find(b => b.Id === id);
  if (!badge) {
    throw new Error(`Badge with ID ${id} not found`);
  }
  return { ...badge };
};

export const createBadge = async (badgeData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newId = Math.max(...badgesData.map(b => b.Id), 0) + 1;
  const newBadge = {
    Id: newId,
    name: badgeData.name,
    icon: badgeData.icon,
    criteria: badgeData.criteria,
    resetCycle: badgeData.resetCycle || 'none'
  };
  
  badgesData.push(newBadge);
  return { ...newBadge };
};

export const updateBadge = async (id, updateData) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = badgesData.findIndex(b => b.Id === id);
  if (index === -1) {
    throw new Error(`Badge with ID ${id} not found`);
  }
  
  badgesData[index] = { ...badgesData[index], ...updateData, Id: id };
  return { ...badgesData[index] };
};

export const deleteBadge = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID must be a positive integer');
  }
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = badgesData.findIndex(b => b.Id === id);
  if (index === -1) {
    throw new Error(`Badge with ID ${id} not found`);
  }
  
  badgesData.splice(index, 1);
  return true;
};

// User badge management functions
export const getUserBadges = async (userId = 1) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const userBadges = userBadgesData
    .filter(ub => ub.userId === userId)
    .map(ub => {
      const badge = badgesData.find(b => b.Id === ub.badgeId);
      return {
        ...ub,
        badge: badge ? { ...badge } : null
      };
    })
    .filter(ub => ub.badge !== null)
    .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));
  
  return userBadges;
};

export const awardBadge = async (userId, badgeId) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('User ID must be a positive integer');
  }
  if (!Number.isInteger(badgeId) || badgeId <= 0) {
    throw new Error('Badge ID must be a positive integer');
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check if badge exists
  const badge = badgesData.find(b => b.Id === badgeId);
  if (!badge) {
    throw new Error(`Badge with ID ${badgeId} not found`);
  }
  
  // Check if user already has this badge
  const existingUserBadge = userBadgesData.find(
    ub => ub.userId === userId && ub.badgeId === badgeId
  );
  
  if (existingUserBadge) {
    throw new Error('User already has this badge');
  }
  
  const newUserBadge = {
    userId,
    badgeId,
    earnedAt: new Date().toISOString()
  };
  
  userBadgesData.push(newUserBadge);
  return {
    ...newUserBadge,
    badge: { ...badge }
  };
};

export const revokeBadge = async (userId, badgeId) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('User ID must be a positive integer');
  }
  if (!Number.isInteger(badgeId) || badgeId <= 0) {
    throw new Error('Badge ID must be a positive integer');
  }
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = userBadgesData.findIndex(
    ub => ub.userId === userId && ub.badgeId === badgeId
  );
  
  if (index === -1) {
    throw new Error('User badge not found');
  }
  
  userBadgesData.splice(index, 1);
  return true;
};

export const resetMonthlyBadges = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const monthlyBadgeIds = badgesData
    .filter(b => b.resetCycle === 'monthly')
    .map(b => b.Id);
  
  const initialCount = userBadgesData.length;
  
  for (let i = userBadgesData.length - 1; i >= 0; i--) {
    if (monthlyBadgeIds.includes(userBadgesData[i].badgeId)) {
      userBadgesData.splice(i, 1);
    }
  }
  
  const resetCount = initialCount - userBadgesData.length;
  return { resetCount };
};