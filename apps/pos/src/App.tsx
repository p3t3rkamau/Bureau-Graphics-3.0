import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './stores/authStore';
import { BranchProvider } from './stores/branchStore';

export default function App() {
  return (
    <AuthProvider>
      <BranchProvider>
        <RouterProvider router={router} />
      </BranchProvider>
    </AuthProvider>
  );
}
