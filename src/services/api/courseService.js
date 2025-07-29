import coursesData from "@/services/mockData/coursesData.json";

export const getAllCourses = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [...coursesData];
};

export const getCourseById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const course = coursesData.find(course => course.Id === parseInt(id));
  if (!course) {
    throw new Error("Course not found");
  }
  
  return { ...course };
};

export const getCoursesByRole = async (role) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (role === "All") {
    return [...coursesData];
  }
  
  return coursesData.filter(course => course.requiredRole === role);
};

export const createCourse = async (courseData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const maxId = Math.max(...coursesData.map(course => course.Id));
  const newCourse = {
    Id: maxId + 1,
    ...courseData,
    students: 0,
    rating: 5.0
  };
  
  coursesData.push(newCourse);
  return { ...newCourse };
};

export const updateCourse = async (id, updates) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const courseIndex = coursesData.findIndex(course => course.Id === parseInt(id));
  if (courseIndex === -1) {
    throw new Error("Course not found");
  }
  
  coursesData[courseIndex] = {
    ...coursesData[courseIndex],
    ...updates
  };
  
  return { ...coursesData[courseIndex] };
};

export const deleteCourse = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const courseIndex = coursesData.findIndex(course => course.Id === parseInt(id));
  if (courseIndex === -1) {
    throw new Error("Course not found");
  }
  
  const deletedCourse = { ...coursesData[courseIndex] };
  coursesData.splice(courseIndex, 1);
  
  return deletedCourse;
};