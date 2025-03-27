import { useState, useEffect } from 'react';
import { useLogout } from '../../utils/Logout';

interface CountdownProps {
  expirationTime: string;
}

export const Countdown: React.FC<CountdownProps> = ({ expirationTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const handleLogout = useLogout();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expirationDate = new Date(expirationTime);
      const currentDate = new Date();
      const timeDifference = expirationDate.getTime() - currentDate.getTime();

      if (timeDifference <= 0) {
        setTimeLeft(0);
        handleLogout();
      } else {
        setTimeLeft(timeDifference);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft / 1000 / 60) % 60)).padStart(2, '0');
  const hours = String(Math.floor((timeLeft / (1000 * 60 * 60)) % 24)).padStart(2, '0');

  const isCritical = timeLeft <= 5 * 60 * 1000;

  return timeLeft > 0 ? (
    <span className={`fs-8 ${isCritical ? 'text-danger' : 'text-secondary'}`}>
      {hours}:{minutes}:{seconds}
    </span>
  ) : null;
};

export default Countdown;
