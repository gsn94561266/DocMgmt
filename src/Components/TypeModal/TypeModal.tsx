import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { InputField, DateInput, BButton } from '..';
import { Loader } from '..';

interface TypeModalProps {
  info: any;
  onConfirm: (uid: string, data: any) => void;
  onClose: () => void;
}

const typeConvert: any = {
  string: 'text',
  datetime: 'date',
  decimal: 'number',
  int: 'number',
};

export const TypeModal: React.FC<TypeModalProps> = ({ info, onConfirm, onClose }) => {
  const [formData, setFormData] = useState<any[]>([]);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!info) {
      setFileURL(null);
      setFileType(null);
      return;
    }

    if (info.properties) {
      setFormData(info.properties);
    }

    let objectURL: string | null = null;

    if (info.uid && !info.file) {
      objectURL = `${process.env.PUBLIC_URL}/DIR_Form_updated.pdf`;
      setFileURL(objectURL);
      setFileType('application/pdf');
      setLoading(false);
    } else if (info.file) {
      objectURL = URL.createObjectURL(info.file);
      setFileURL(objectURL);
      setFileType(info.file.type);
      setLoading(false);
    }

    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [info]);

  const handleChange = (fieldUid: string, value: any) => {
    setFormData((prev: any) => {
      const newFormData = prev.map((v: any) => (v.FieldUID === fieldUid ? { ...v, Value: value } : v));
      return newFormData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(info.uid, formData);
  };

  const renderFormFields = () => {
    return (
      info &&
      info.type.Fields?.map(({ Name, DefaultValue, Type, UID }: any) => {
        return (
          <div key={UID} className="mb-2">
            {typeConvert[Type] === 'date' ? (
              <DateInput
                label={Name}
                value={formData.find((v) => v.FieldUID === UID)?.Value || DefaultValue || ''}
                onChange={(value) => handleChange(UID, value || '')}
              />
            ) : (
              <InputField
                type={typeConvert[Type] || 'text'}
                label={Name}
                value={formData.find((v) => v.FieldUID === UID)?.Value || DefaultValue || ''}
                onChange={(value) => handleChange(UID, value)}
              />
            )}
          </div>
        );
      })
    );
  };

  if (!info) return null;

  return (
    <Modal show={!!info} centered size="xl">
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row g-4 p-2">
            <div className="col-12 col-lg-9">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Loader />
                </div>
              ) : fileURL ? (
                fileType?.startsWith('image/') ? (
                  // 顯示圖片
                  <img src={fileURL} alt="Preview" className="img-fluid rounded w-100" />
                ) : fileType === 'application/pdf' ? (
                  // 顯示 PDF 預覽
                  <object
                    data={fileURL}
                    type="application/pdf"
                    className="img-fluid rounded w-100"
                    style={{ height: '80vh' }}
                  >
                    <p className="fs-7">
                      Unable to preview the PDF. Please{' '}
                      <a href={fileURL} download={info.file?.name || 'download'}>
                        click here to download
                      </a>
                      .
                    </p>
                  </object>
                ) : (
                  // 其他檔案顯示下載連結
                  <p className="fs-7">
                    Unable to preview the File. Please{' '}
                    <a href={fileURL} download={info.file?.name || 'download'}>
                      click here to download
                    </a>
                    .
                  </p>
                )
              ) : (
                <span className="fs-7">No data found.</span>
              )}
            </div>
            <div className="col-12 col-lg-3">{renderFormFields()}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BButton onClick={onClose} text="Close" className="bg-secondary text-white" />
          <BButton type="submit" text="Confirm" />
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default TypeModal;
