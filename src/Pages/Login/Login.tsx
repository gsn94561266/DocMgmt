import { useState } from 'react';
import { format } from 'date-fns';
import { useUserContext, useDataContext } from '../../Context';
import { InputField } from '../../Components';
import { user } from '../../Data';

const Login = () => {
  const [account, setAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { setUser } = useUserContext();
  const { setMessage, resetMessage } = useDataContext();

  const handleLogin = () => {
    if (!account || !password) {
      setMessage({
        message: 'Account or password cannot be empty.',
        severity: 'warning',
      });
      return;
    }

    if (account === user.Account && password === user.Password) {
      const formatLocalTime = (date: Date) => {
        return format(date, "yyyy-MM-dd'T'HH:mm:ss.SS");
      };

      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      const userInfo = {
        email: user.Email,
        skype: user.Skype,
        firstName: user.FirstName,
        lastName: user.LastName,
        phone: user.Phone,
        altPhone: user.Alt_Phone,
        country: user.Country,
        state: user.State,
        companyUid: user.CompanyUID,
        companyName: user.CompanyName,
        account: user.Account,
        memberName: user.MemberName,
        identification: user.Identification,
        loginedTime: formatLocalTime(now),
        expirationTime: formatLocalTime(oneHourLater),
        uid: user.UID,
        photo: user.Photo,
      };

      localStorage.setItem('user', JSON.stringify(userInfo));

      setUser(userInfo);
      resetMessage();

      return;
    }

    setMessage({
      message: 'Login failed, please try again.',
      severity: 'danger',
    });
  };

  return (
    <div className="container h-100 overflow-hidden">
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="card" style={{ width: '450px' }}>
          <div className="card-body px-4 py-5 p-sm-5">
            <h2 className="mb-5">Login</h2>
            <form
              className="my-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="mb-4">
                <InputField
                  type="account"
                  onChange={(e) => setAccount(e)}
                  value={account}
                  label="Account"
                  required={true}
                />
                <span className="fs-8 text-secondary">e.g. demoUser</span>
              </div>
              <div className="mb-4">
                <InputField
                  type="password"
                  onChange={(e) => setPassword(e)}
                  value={password}
                  label="Password"
                  required={true}
                />
                <span className="fs-8 text-secondary">e.g. 1234</span>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-semibold text-white mt-4">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
