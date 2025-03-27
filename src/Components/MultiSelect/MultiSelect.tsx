import { useMemo } from 'react';
import Select, { MultiValue } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  onChange: (values: string[]) => void;
  value: string[];
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  label?: string;
  loading?: boolean;
  onSearch?: (value: string) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options = [],
  value = [],
  onChange,
  disabled = false,
  clearable = false,
  placeholder,
  label,
  loading,
  onSearch,
}) => {
  const selectedValues = useMemo(() => options.filter((o) => value.includes(o.value)), [value, options]);

  const handleChange = (newValue: MultiValue<Option>) => {
    const newValues = newValue.map((o) => o.value);
    onChange(newValues);
  };

  const handleInputChange = (newValue: string) => {
    const trimmedValue = newValue.slice(0, 3);
    if (trimmedValue.length >= 3 && onSearch) {
      onSearch(trimmedValue);
    }
  };

  const customStyles = useMemo(
    () => ({
      control: (provided: any) => ({
        ...provided,
        minHeight: '29px',
      }),
      valueContainer: (provided: any) => ({
        ...provided,
        padding: '0 6px',
      }),
      indicatorsContainer: (provided: any) => ({
        ...provided,
        height: '29px',
        alignSelf: 'center',
      }),
      menu: (provided: any) => ({
        ...provided,
        margin: '0px',
        minWidth: '100%',
        width: 'auto',
        whiteSpace: 'nowrap',
      }),
      option: (provided: any) => ({
        ...provided,
        padding: '4px 6px',
      }),
      multiValue: (base: any) => ({
        ...base,
        borderRadius: '4px',
        backgroundColor: '#ddd',
      }),
      multiValueLabel: (base: any) => ({
        ...base,
      }),
      multiValueRemove: (base: any) => ({
        ...base,
        ':hover': {
          borderRadius: '4px',
          backgroundColor: '#ddd',
        },
      }),
    }),
    []
  );

  return (
    <div className="fs-7">
      {label && (
        <label className="form-label fw-semibold mb-1" style={{ marginTop: '2px' }}>
          {label}
        </label>
      )}
      <Select
        hideSelectedOptions={false}
        components={{ DropdownIndicator: null }}
        isMulti
        onBlur={() => onChange(selectedValues.map((o) => o.value))}
        isDisabled={disabled}
        isClearable={clearable}
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder={placeholder}
        closeMenuOnSelect={false}
        styles={customStyles}
        isLoading={loading}
        onInputChange={handleInputChange}
        isSearchable={!!onSearch}
        menuPosition="fixed"
      />
    </div>
  );
};

export default MultiSelect;
