import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../../Context';
import { FiMenu } from 'react-icons/fi';
import { Countdown } from '..';
import { useLogout } from '../../utils/Logout';

export const Header = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { user } = useUserContext();

  const handleLogout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(
    () => [
      { title: 'Document List', isSummary: true, path: '/document-list' },
      { title: 'Upload Document', isSummary: false, path: '/upload-document' },
    ],
    []
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <nav className="navbar navbar-expand-md" style={{ background: '#094067' }}>
      <div className="container-fluid mb-1">
        <div className="navbar-brand d-flex">
          {user && (
            <button
              className="d-inline d-md-none btn border-0 p-1 me-2"
              type="button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FiMenu color="#eee" size={24} />
            </button>
          )}

          <div className="d-flex cursor-pointer" onClick={() => navigate('/')}>
            {/* <div style={{ height: 'auto', width: '80px', overflow: 'hidden' }}>
              <img className="img" style={{ height: '30px' }} src="/logo.png" alt="Logo" />
            </div> */}
            <span className="text-white m-0 roboto-condensed fw-medium" style={{ fontSize: 22 }}>
              Document Management System
            </span>
          </div>
        </div>

        {user ? (
          <>
            <ul className="navbar-nav justify-content-end flex-grow-1 d-none d-md-flex">
              {menuItems.map((v, i) => (
                <li key={i} className="nav-item my-1">
                  <button
                    type="button"
                    className={`btn btn-link text-decoration-none fw-bold fs-7 ${location.pathname === v.path ? 'text-info' : 'text-white'}`}
                    onClick={() => handleNavigation(v.path)}
                  >
                    {v.title}
                  </button>
                </li>
              ))}
            </ul>

            <div className="dropdown ps-3 ms-auto">
              {user.photo ? (
                <img
                  src={user.photo}
                  className="rounded-circle cursor-pointer"
                  alt="User"
                  style={{ height: 35, width: 35, objectFit: 'cover' }}
                  data-bs-toggle="dropdown"
                />
              ) : (
                <div
                  className="bg-light rounded-circle cursor-pointer fw-bold fs-5 d-flex align-items-center justify-content-center user-select-none"
                  style={{ height: 35, width: 35 }}
                  data-bs-toggle="dropdown"
                >
                  {user.account[0]}
                </div>
              )}

              <ul className="dropdown-menu dropdown-menu-end">
                <li className="border-bottom border-2 mx-2">
                  <h6 className="ms-2 fs-7 py-1">{user.account}</h6>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item fs-7 fw-semibold mt-2 py-2"
                    onClick={() => navigate('/settings')}
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item fs-7 fw-semibold py-2 d-flex align-items-center justify-content-between"
                    onClick={handleLogout}
                  >
                    <span className="me-3">Logout</span>
                    <Countdown expirationTime={user.expirationTime} />
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : null}
      </div>

      <ul
        className="navbar-nav d-md-none d-block w-100"
        style={{
          maxHeight: showMenu ? '100px' : '0',
          transition: 'max-height 0.2s ease-out',
          overflow: 'hidden',
        }}
      >
        {menuItems.map((v, i) => (
          <li key={i} className="nav-item">
            <button
              type="button"
              className={`btn btn-link text-decoration-none fw-bold fs-7 text-nowrap ${location.pathname === v.path ? 'text-info' : 'text-white'}`}
              onClick={() => handleNavigation(v.path)}
            >
              {v.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
