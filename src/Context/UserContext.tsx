import { useContext, createContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  skype: string;
  firstName: string;
  lastName: string;
  phone: string;
  altPhone: string;
  country: string;
  state: string;
  companyUid: string;
  companyName: string;
  account: string;
  memberName: string;
  identification: string;
  loginedTime: string;
  expirationTime: string;
  uid: string;
  photo?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
