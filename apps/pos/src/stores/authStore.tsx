import { createContext, useContext, useMemo, useState } from 'react';
import { RoleName, User } from '../types';
import { users } from '../data/mockData';

type AuthContextType = {
  user: User;
  setRole: (role: RoleName) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<RoleName>('admin');
  const user = useMemo(() => users.find((u) => u.role === role) ?? users[0], [role]);
  return <AuthContext.Provider value={{ user, setRole }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
