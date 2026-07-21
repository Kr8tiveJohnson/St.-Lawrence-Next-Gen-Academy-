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
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import HallOfFamePage from "./pages/HallOfFamePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import GroupsPage from "./pages/GroupsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import PrivacyNotice from "./components/common/PrivacyNotice.jsx";

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
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/hall-of-fame" element={<HallOfFamePage />} />
          <Route path="/classrooms" element={<ClassroomsPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <PrivacyNotice />
      </BrowserRouter>
    </AuthProvider>
  );
}
