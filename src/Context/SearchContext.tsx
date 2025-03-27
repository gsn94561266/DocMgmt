import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  summaryCondition: any;
  setSummaryCondition: React.Dispatch<React.SetStateAction<any>>;
  detailCondition: any;
  setDetailCondition: React.Dispatch<React.SetStateAction<any>>;
  resetSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [summaryCondition, setSummaryCondition] = useState<any>({
    vendorNo: '',
    refNo: '',
    containerNo: '',
    uploadDate: '',
    label: [],
    filename: '',
    status: [],
  });
  const [detailCondition, setDetailCondition] = useState<any>({ refNo: '' });

  const resetSearch = () => {
    setSummaryCondition({
      vendorNo: '',
      refNo: '',
      containerNo: '',
      uploadDate: '',
      label: [],
      filename: '',
      status: [],
    });
    setDetailCondition({ refNo: '' });
  };

  return (
    <SearchContext.Provider
      value={{
        summaryCondition,
        setSummaryCondition,
        detailCondition,
        setDetailCondition,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
