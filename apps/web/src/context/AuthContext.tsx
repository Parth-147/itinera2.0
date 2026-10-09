import React, { createContext, useContext, useState } from 'react';
import {
  UserProfile,
  UserRole,
  getActiveSessionUser,
  loginAsDemo,
  logout as authLogout,
} from '../services/auth';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isOperator: boolean;
  switchRole: (role: UserRole) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getActiveSessionUser());

  const switchRole = (newRole: UserRole) => {
    const updated = loginAsDemo(newRole);
    setUser(updated);
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  const role = user?.role || 'traveler';
  const isOperator = role === 'operator';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isOperator,
        switchRole,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
