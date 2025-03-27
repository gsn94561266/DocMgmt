import { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getMonth, getYear, parse, format } from 'date-fns';
import { MdOutlineArrowLeft, MdOutlineArrowRight } from 'react-icons/md';
import './DateInput.scss';

interface DateInputProps {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({ onChange, value, placeholder, label, required, disabled }) => {
  const [startDate, setStartDate] = useState<Date | null>(value ? parse(value, 'MM/dd/yyyy', new Date()) : null);

  const years = useMemo(() => Array.from({ length: getYear(new Date()) - 2000 + 1 }, (_, i) => 2000 + i), []);
  const months = useMemo(
    () => [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    []
  );

  useEffect(() => {
    onChange(startDate ? format(startDate, 'MM/dd/yyyy') : '');
  }, [startDate]);

  const handleChange = (date: Date | null) => {
    setStartDate(date);
  };

  return (
    <div style={{ marginBottom: '2px' }}>
      {label && <label className="form-label fw-semibold mb-1">{label}</label>}
      <DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="d-flex align-items-center justify-content-center">
            <button
              type="button"
              className="btn p-0 border-0 text-secondary"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              aria-label="Previous month"
            >
              <MdOutlineArrowLeft className="fs-3" />
            </button>
            <select
              className="form-select form-select-sm w-auto"
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(Number(value))}
              aria-label="Select year"
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm w-auto"
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
              aria-label="Select month"
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn p-0 border-0 text-secondary"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              aria-label="Next month"
            >
              <MdOutlineArrowRight className="fs-3" />
            </button>
          </div>
        )}
        selected={startDate}
        onChange={handleChange}
        dateFormat="MM/dd/yyyy"
        className="form-control fs-7 custom-wrapper"
        placeholderText={placeholder || 'Select...'}
        isClearable
        popperPlacement="bottom-start"
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default DateInput;
