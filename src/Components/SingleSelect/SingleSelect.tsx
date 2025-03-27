import { useState, useMemo, useCallback } from 'react';
import Select, { components, MenuPosition, MenuPlacement } from 'react-select';

interface Option {
  value: string;
  label: string;
  from?: string;
  to?: string;
}

interface SingleSelectProps {
  options: Option[];
  onChange: (value: string | null) => void;
  value: string;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  label?: string;
  loading?: boolean;
  onSearch?: (value: string) => void;
  isLegSelect?: boolean;
  menuPosition?: MenuPosition;
  menuPlacement?: MenuPlacement;
  className?: string;
}

export const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  clearable = false,
  placeholder,
  label,
  loading,
  onSearch,
  isLegSelect,
  menuPosition,
  menuPlacement,
  className,
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const selectedValue = useMemo(() => options?.find((o) => o.value === value) || null, [value, options]);

  const handleChange = (newValue: any) => {
    onChange(newValue?.value || null);
    setMenuIsOpen(false);
  };

  const handleInputChange = useCallback(
    (newValue: string) => {
      const trimmedValue = newValue.slice(0, 3);
      if (trimmedValue.length >= 3 && onSearch) {
        onSearch(trimmedValue);
      }
    },
    [onSearch]
  );

  const Menu = (props: any) => {
    return (
      <components.Menu {...props}>
        <table className="table table-bordered table-sm m-0 cursor-default">
          <thead>
            <tr>
              <th className="bg-light fw-semibold pe-4 ps-2">Leg</th>
              <th className="bg-light fw-semibold pe-4 ps-2">From</th>
              <th className="bg-light fw-semibold pe-4 ps-2">To</th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt) => {
              const isSelected = selectedValue?.value === opt.value;
              const isHovered = hovered === opt.value;
              const cellClass =
                'pe-4 ps-2 ' +
                (isSelected ? 'bg-primary text-white' : '') +
                (isHovered && !isSelected ? ' bg-primary-subtle' : '');

              return (
                <tr
                  key={opt.value}
                  onClick={() => handleChange(opt)}
                  onMouseEnter={() => setHovered(opt.value)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <td className={cellClass}>{opt.label}</td>
                  <td className={cellClass}>{opt.from}</td>
                  <td className={cellClass}>{opt.to}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </components.Menu>
    );
  };

  const customStyles = useMemo(
    () => ({
      control: (provided: any) => ({
        ...provided,
        height: '31px',
        minHeight: '31px',
      }),
      valueContainer: (provided: any) => ({
        ...provided,
        padding: '0 6px',
      }),
      indicatorsContainer: (provided: any) => ({
        ...provided,
        height: '30px',
        alignSelf: 'center',
      }),
      menu: (provided: any) => ({
        ...provided,
        margin: '0px',
        minWidth: '100%',
        width: 'auto',
        whiteSpace: 'nowrap',
        zIndex: 2,
      }),
      option: (provided: any) => ({
        ...provided,
        padding: '4px 6px',
      }),
    }),
    []
  );

  return (
    <div className={className ? className : 'fs-7'}>
      {label && (
        <label className="form-label fw-semibold mb-1" style={{ marginTop: '2px' }}>
          {label}
        </label>
      )}
      <Select
        components={{
          DropdownIndicator: null,
          ...(isLegSelect && options?.length > 0 ? { Menu } : {}),
        }}
        styles={customStyles}
        isDisabled={disabled}
        isClearable={clearable}
        options={options}
        value={selectedValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        isLoading={loading}
        isSearchable={!!onSearch}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        menuPosition={menuPosition}
        menuPlacement={menuPlacement}
      />
    </div>
  );
};

export default SingleSelect;
