import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useDataContext } from '../../Context';
import { FaTimesCircle, FaExclamationCircle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

export const MessageToast = () => {
  const [show, setShow] = useState(false);
  const { message, resetMessage } = useDataContext();

  const iconMapping = {
    danger: <FaTimesCircle className="fs-5 me-2" />,
    warning: <FaExclamationCircle className="fs-5 me-2" />,
    info: <FaInfoCircle className="fs-5 me-2" />,
    success: <FaCheckCircle className="fs-5 me-2" />,
  };

  const handleClose = () => {
    setShow(false);
    resetMessage();
  };

  useEffect(() => {
    if (message.message && message.severity) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        resetMessage();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, resetMessage]);

  if (!message.message || !message.severity) {
    return null;
  }

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x mt-5 custom-box-shadow">
      <Alert
        variant={message.severity || 'info'}
        show={show}
        onClose={handleClose}
        className="fs-7 fw-bold m-0 border-0 d-flex align-items-center"
      >
        {iconMapping[message.severity] || iconMapping.info}
        <div>
          {message.message.includes('<') ? (
            <span dangerouslySetInnerHTML={{ __html: message.message }} />
          ) : (
            message.message
          )}
        </div>
      </Alert>
    </div>
  );
};

export default MessageToast;
