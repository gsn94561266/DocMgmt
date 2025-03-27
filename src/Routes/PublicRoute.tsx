import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../Context';

const PublicRoute = () => {
  const { user } = useUserContext();

  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
