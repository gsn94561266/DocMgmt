import { useState, useEffect, useRef } from 'react';
import { MdEdit, MdSave, MdDelete } from 'react-icons/md';
import { IoMdAddCircle } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { useDataContext, useUserContext } from '../../Context';
import { v4 as uuidv4 } from 'uuid';

interface Option {
  value: string;
  label: string;
  type: number;
}

interface TagsSelectProps {
  options: Option[];
  onChange: (values: string[]) => void;
  value: string[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const TagsSelect: React.FC<TagsSelectProps> = ({
  options,
  onChange,
  value: selectedTags,
  placeholder = 'Select...',
  disabled = false,
  loading = false,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState<string>('');
  const [addTagName, setAddTagName] = useState<string>('');
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [dropdownStyle, setDropdownStyle] = useState<any>({ left: 0, top: 0, position: 'bottom', width: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setLabelData, setMessage } = useDataContext();
  const { user } = useUserContext();

  const sortedOptions = options.sort((a, b) => (a.type !== b.type ? a.type - b.type : a.label.localeCompare(b.label)));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setMenuIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const currentDropdownRef = dropdownRef.current;
    // 設定menu位置 自動轉換在top還是bottom
    const updateDropdownStyle = () => {
      if (currentDropdownRef) {
        const rect = currentDropdownRef.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        setDropdownStyle({
          left: rect.left + window.scrollX,
          top: spaceBelow < 300 && spaceAbove > spaceBelow ? rect.top + window.scrollY : rect.bottom + window.scrollY,
          position: spaceBelow < 300 && spaceAbove > spaceBelow ? 'top' : 'bottom',
          width: rect.width,
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateDropdownStyle);
    if (currentDropdownRef) {
      resizeObserver.observe(currentDropdownRef);
    }

    const handleScroll = () => {
      if (menuIsOpen) {
        setMenuIsOpen(false);
      }
    };
    // 調整視窗大小就先把menu關掉
    window.addEventListener('resize', handleScroll);

    if (!menuIsOpen) {
      setIsEditing(null);
      setNewTagName('');
      setAddTagName('');
    }

    return () => {
      if (currentDropdownRef) {
        resizeObserver.unobserve(currentDropdownRef);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, [menuIsOpen]);

  const handleCreate = () => {
    if (!addTagName.trim()) return;
    setLabelData((prev: any) => [
      ...prev,
      {
        UID: uuidv4(),
        ID: addTagName,
        Name: addTagName,
        Type: 2,
        CreatedBy: user?.account,
      },
    ]);
    setMessage({
      message: 'Label created successfully.',
      severity: 'success',
    });
    setAddTagName('');
  };

  const handleUpdate = (labelUid: string, oldName: string) => {
    if (!newTagName.trim() || oldName === newTagName.trim()) {
      setIsEditing(null);
      return;
    }
    setLabelData((prev: any) =>
      prev.map((v: any) => (v.UID === labelUid ? { ...v, ID: newTagName, Name: newTagName } : v))
    );
    setMessage({
      message: 'Label updated successfully.',
      severity: 'success',
    });
    setIsEditing(null);
    setNewTagName('');
  };

  const handleDelete = (labelUid: string) => {
    setLabelData((prev: any) => prev.filter((v: any) => v.UID !== labelUid));
    setMessage({
      message: 'Label deleted successfully.',
      severity: 'success',
    });
    onChange(selectedTags.filter((tag) => tag !== labelUid));
  };

  return (
    <div className="dropdown cursor-default user-select-none" ref={dropdownRef} style={{ maxWidth: 300 }}>
      <div
        className="dropdown-toggle border rounded d-flex flex-wrap align-items-center bg-white"
        onClick={() => setMenuIsOpen(!menuIsOpen)}
        style={{ minHeight: '31px', padding: '1px 2px' }}
      >
        {selectedTags.length === 0 ? (
          <span className="text-secondary fs-7 ms-1">{placeholder}</span>
        ) : (
          selectedTags.map((tag) => {
            const tagData = options.find((opt) => opt.value === tag);
            if (!tagData) return null;
            return (
              <span
                key={tagData.value}
                className="bg-primary text-white rounded"
                style={{ padding: '0px 2px 2px 5px', margin: '2px 3px 3px' }}
              >
                <span className="fs-9">{tagData.label}</span>
                <IoClose
                  size={14}
                  className="ms-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedTags.filter((tag) => tag !== tagData.value));
                  }}
                />
              </span>
            );
          })
        )}
      </div>

      <ul
        className={`position-fixed dropdown-menu p-0 ${menuIsOpen ? 'show' : ''}`}
        style={{
          left: `${dropdownStyle.left}px`,
          top: dropdownStyle.position === 'bottom' ? `${dropdownStyle.top}px` : 'auto',
          bottom: dropdownStyle.position === 'top' ? `${window.innerHeight - dropdownStyle.top}px` : 'auto',
          minWidth: dropdownStyle.width,
        }}
      >
        <div className="overflow-auto" style={{ maxHeight: 260 }}>
          {sortedOptions.map((opt) => (
            <div
              key={opt.value}
              className={`dropdown-item d-flex justify-content-between align-items-center p-2 m-0 ${selectedTags.includes(opt.value) ? 'bg-primary text-white' : ''} ${hovered === opt.value && !selectedTags.includes(opt.value) ? 'bg-primary-subtle' : ''}`}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              onClick={() =>
                onChange(
                  selectedTags.includes(opt.value)
                    ? selectedTags.filter((tag) => tag !== opt.value)
                    : [...selectedTags, opt.value]
                )
              }
            >
              {isEditing === opt.value ? (
                <input
                  className="form-control form-control-sm fs-7 w-auto p-1"
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  maxLength={30}
                  autoFocus
                />
              ) : (
                <span className="fs-7">{opt.label}</span>
              )}

              {opt.type === 2 ? (
                <div className="d-flex">
                  {isEditing === opt.value ? (
                    <MdSave
                      size={18}
                      className={`ms-3 cursor-pointer ${selectedTags.includes(opt.value) ? 'text-white' : 'text-secondary'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(opt.value, opt.label);
                      }}
                      title="Save"
                    />
                  ) : (
                    <MdEdit
                      size={18}
                      className={`ms-3 cursor-pointer ${selectedTags.includes(opt.value) ? 'text-white' : 'text-secondary'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(opt.value);
                        setNewTagName(opt.label);
                      }}
                      title="Edit"
                    />
                  )}
                  <MdDelete
                    size={18}
                    className={`ms-2 cursor-pointer ${selectedTags.includes(opt.value) ? 'text-white' : 'text-secondary'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(opt.value);
                    }}
                    title="Delete"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <li>
          <div className="m-2 d-flex align-items-center">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Create..."
              value={addTagName}
              onChange={(e) => setAddTagName(e.target.value)}
              maxLength={30}
            />
            <IoMdAddCircle
              size={20}
              className="text-secondary ms-2 cursor-pointer"
              title="Add"
              onClick={handleCreate}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TagsSelect;
