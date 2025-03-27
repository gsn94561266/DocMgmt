import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, SearchProvider, DataProvider } from './Context';
import ProtectedRoute from './Routes/ProtectedRoute';
import PublicRoute from './Routes/PublicRoute';
import { Header, MessageToast } from './Components';
import Login from './Pages/Login/Login';
import Settings from './Pages/Settings/Settings';
import Summary from './Pages/Summary/Summary';
import Detail from './Pages/Detail/Detail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SearchProvider>
          <DataProvider>
            <Router>
              <div className="d-flex flex-column vh-100 overflow-hidden">
                <Header />

                <Routes>
                  {/* 只有未登入者可訪問 */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                  </Route>

                  {/* 需要登入才能訪問 */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/document-list" element={<Summary />} />
                    <Route path="/upload-document" element={<Detail />} />
                    <Route path="/" element={<Navigate replace to="/document-list" />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Routes>

                <MessageToast />
              </div>
            </Router>
          </DataProvider>
        </SearchProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
