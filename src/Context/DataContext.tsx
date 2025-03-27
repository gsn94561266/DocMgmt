import { createContext, useContext, useState, ReactNode } from 'react';
import { tagList } from '../Data';

interface Message {
  message: string;
  severity: 'success' | 'danger' | 'warning' | 'info' | '';
}

interface DataContextType {
  summaryData: any[];
  setSummaryData: React.Dispatch<React.SetStateAction<any[]>>;
  detailData: any[];
  setDetailData: React.Dispatch<React.SetStateAction<any[]>>;
  summaryCurrentPage: number;
  setSummaryCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  detailCurrentPage: number;
  setDetailCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  labelData: any[];
  setLabelData: React.Dispatch<React.SetStateAction<any[]>>;
  message: Message;
  setMessage: (msg: Message) => void;
  resetMessage: () => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [detailData, setDetailData] = useState<any[]>([]);
  const [summaryCurrentPage, setSummaryCurrentPage] = useState<number>(1);
  const [detailCurrentPage, setDetailCurrentPage] = useState<number>(1);
  const [labelData, setLabelData] = useState<any[]>(tagList);
  const [message, setMessage] = useState<Message>({
    message: '',
    severity: '',
  });

  const resetMessage = () => {
    setMessage({ message: '', severity: '' });
  };

  const resetData = () => {
    setSummaryData([]);
    setDetailData([]);
    setSummaryCurrentPage(1);
    setDetailCurrentPage(1);
    resetMessage();
  };

  return (
    <DataContext.Provider
      value={{
        summaryData,
        setSummaryData,
        detailData,
        setDetailData,
        summaryCurrentPage,
        setSummaryCurrentPage,
        detailCurrentPage,
        setDetailCurrentPage,
        labelData,
        setLabelData,
        message,
        setMessage,
        resetMessage,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
