import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage.jsx";
import ClassroomsPage from "./pages/ClassroomsPage.jsx";
import PastQuestionsPage from "./pages/PastQuestionsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import HallOfFamePage from "./pages/HallOfFamePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classrooms" element={<ClassroomsPage />} />
          <Route path="/past-questions" element={<PastQuestionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />} />
          <Route path="/hall-of-fame" element={<HallOfFamePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
