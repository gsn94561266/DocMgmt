import { useUserContext, useSearchContext, useDataContext } from '../Context';

export const useLogout = () => {
  const { setUser } = useUserContext();
  const { resetData } = useDataContext();
  const { resetSearch } = useSearchContext();

  const handleLogout = () => {
    localStorage.removeItem('user');

    setUser(null);
    resetData();
    resetSearch();
  };

  return handleLogout;
};
