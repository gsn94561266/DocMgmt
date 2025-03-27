import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BButton } from '..';
import { Loader } from '..';

interface ViewModalProps {
  info: any;
  onClose: () => void;
}

export const ViewModal: React.FC<ViewModalProps> = ({ info, onClose }) => {
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!info) {
      setFileURL(null);
      setFileType(null);
      return;
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

  if (!info) return null;

  return (
    <Modal
      show={!!info}
      onHide={onClose}
      centered
      size={fileType?.startsWith('image/') || fileType === 'application/pdf' ? 'lg' : 'sm'}
    >
      <Modal.Body className="px-4 pt-4">
        {loading ? (
          <div className="d-flex justify-content-center">
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
      </Modal.Body>
      <Modal.Footer>
        <BButton onClick={onClose} text="Close" className="bg-secondary text-white" />
      </Modal.Footer>
    </Modal>
  );
};

export default ViewModal;
