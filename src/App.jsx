import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LandingPage from "@/components/pages/LandingPage";
import DashboardPage from "@/components/pages/DashboardPage";
import CoursesPage from "@/components/pages/CoursesPage";
import CommunityPage from "@/components/pages/CommunityPage";
import Layout from "@/components/organisms/Layout";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <Layout>
              <DashboardPage />
            </Layout>
          } />
          <Route path="/courses" element={
            <Layout>
              <CoursesPage />
            </Layout>
          } />
          <Route path="/community" element={
            <Layout>
              <CommunityPage />
            </Layout>
          } />
          <Route path="/" element={<Navigate to="/landing" replace />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;