import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../Context';

const ProtectedRoute = () => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
