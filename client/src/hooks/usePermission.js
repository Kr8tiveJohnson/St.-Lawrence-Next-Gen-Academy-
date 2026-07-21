import { useAuth } from '../context/AuthContext';

export function usePermission() {
  const { user, isAdmin, isTeacher } = useAuth();

  const can = (action) => {
    if (!user) return false;
    switch (action) {
      case 'access_premium': return user.tier === 'PAID';
      case 'manage_content': return isAdmin;
      case 'create_classroom': return isTeacher;
      case 'chat_worldwide': return user.tier === 'PAID';
      default: return false;
    }
  };

  return { can, isAdmin, isTeacher, tier: user?.tier };
}
