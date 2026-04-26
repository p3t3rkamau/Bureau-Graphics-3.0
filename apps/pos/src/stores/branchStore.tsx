import { createContext, useContext, useState } from 'react';
import { branches } from '../data/mockData';

const BranchContext = createContext<{ branchId: string; setBranchId: (id: string) => void } | undefined>(undefined);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branchId, setBranchId] = useState(branches[0].id);
  return <BranchContext.Provider value={{ branchId, setBranchId }}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch must be used inside BranchProvider');
  return ctx;
}
