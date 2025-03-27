import { useState } from 'react';
import { useUserContext, useDataContext } from '../../Context';
import { InputField, BButton } from '../../Components';

import { FaCamera } from 'react-icons/fa';

const Settings = () => {
  const { user } = useUserContext();
  const { setMessage } = useDataContext();

  const [email, setEmail] = useState<string>(user?.email || '');
  const [skype, setSkype] = useState<string>(user?.skype || '');
  const [firstName, setFirstName] = useState<string>(user?.firstName || '');
  const [lastName, setLastName] = useState<string>(user?.lastName || '');
  const [image, setImage] = useState<string>(user?.photo || '');
  const [uploadImg, setUploadImg] = useState<boolean>(false);

  // 換大頭照的功能先關閉
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    setMessage({ message: 'This is a DEMO version, no data will be updated.', severity: 'info' });
  };

  return (
    <div className="h-100 overflow-auto">
      <div className="container">
        <div className="card my-5 mx-auto" style={{ maxWidth: '800px' }}>
          <div className="card-header px-4 bg-white">
            <h5 className="my-3 text-dark">Profile Settings</h5>
          </div>
          <div className="card-body p-4">
            <form
              className="row gy-3 gx-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <div className="col-12">
                <div
                  className="mb-4 position-relative rounded-circle"
                  onMouseEnter={() => setUploadImg(true)}
                  onMouseLeave={() => setUploadImg(false)}
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: 'cover',
                  }}
                >
                  <img
                    src={image}
                    className="rounded-circle"
                    alt="..."
                    style={{
                      width: 200,
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    className={`position-absolute bottom-0 rounded-circle ${uploadImg ? 'd-block' : 'd-none'}`}
                    style={{
                      width: 200,
                      height: 200,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <input
                      type="file"
                      className="opacity-0 w-100 h-100 position-absolute top-50 start-50 translate-middle cursor-pointer z-3"
                      onChange={handleImageChange}
                      accept=".jpg, .jpeg, .png"
                    />
                    <FaCamera
                      size={24}
                      className={`${
                        uploadImg
                          ? 'position-absolute top-50 start-50 translate-middle text-white cursor-pointer'
                          : 'd-none'
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <InputField type="text" name="not-password" value={user?.account || ''} label="Account" disabled />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  type="text"
                  name="not-password"
                  value={user?.companyName || ''}
                  label="Company Name"
                  disabled
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField type="text" name="not-email" value={user?.phone || ''} label="Phone" disabled />
              </div>
              <div className="col-12 col-md-6">
                <InputField type="text" name="not-password" value={user?.altPhone || ''} label="Alt Phone" disabled />
              </div>
              <div className="col-12 col-md-6">
                <InputField type="text" name="not-password" value={user?.country || ''} label="Country" disabled />
              </div>
              <div className="col-12 col-md-6">
                <InputField type="text" name="not-password" value={user?.state || ''} label="State" disabled />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  type="text"
                  name="not-password"
                  value={firstName}
                  onChange={(v) => setFirstName(v)}
                  label="First Name"
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  type="text"
                  name="not-password"
                  value={lastName}
                  onChange={(v) => setLastName(v)}
                  label="Last Name"
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  type="email"
                  name="not-password"
                  value={email}
                  onChange={(v) => setEmail(v)}
                  label="Email"
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField type="text" name="not-password" value={skype} onChange={(v) => setSkype(v)} label="Skype" />
              </div>

              <div className="col-12 text-end mt-4">
                <BButton type="submit" text="Update" className="ms-auto bg-primary text-white" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
