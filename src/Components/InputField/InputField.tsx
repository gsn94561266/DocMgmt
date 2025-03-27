import './InputField.scss';
import { MdClear } from 'react-icons/md';

interface InputFieldProps {
  onChange?: (value: string) => void;
  value: string;
  type?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  clearable?: boolean;
  readOnly?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  onChange,
  value,
  type = 'text',
  name = '',
  placeholder,
  label,
  required,
  disabled,
  autoFocus,
  clearable,
  readOnly,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange?.(newValue);
  };

  const handleClear = () => {
    onChange?.('');
  };

  return (
    <div className="input-field">
      {label && <label className="form-label fw-semibold mb-1">{label}</label>}
      <div className="input-container">
        <input
          type={type}
          name={name}
          className="form-control fs-7 custom-wrapper"
          onChange={handleChange}
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          readOnly={readOnly}
        />
        {clearable && value ? (
          <button className="clear-btn" onClick={handleClear} type="button">
            <MdClear size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;
