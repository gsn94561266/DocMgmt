import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDataContext, useSearchContext } from '../../Context';
import { useDropzone } from 'react-dropzone';
import { Table, SingleSelect, TypeModal, ViewModal, BButton } from '../../Components';
import DetailColumns from './DetailColumns';
import { refList, detailList } from '../../Data';

const Detail = () => {
  const [typeModalInfo, setTypeModalInfo] = useState<any>(null);
  const [viewModalInfo, setViewModalInfo] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);

  const { detailData, setDetailData, detailCurrentPage, setDetailCurrentPage, labelData, setLabelData, setMessage } =
    useDataContext();
  const { detailCondition, setDetailCondition } = useSearchContext();

  useEffect(() => {
    if (detailCondition.refNo) {
      setIsDetailLoading(true);
      setDetailCurrentPage(1);
      setDetailData(
        detailList
          .map((data: any) => ({
            id: data.UID,
            uid: data.UID,
            status: data.Status,
            statusName: data.StatusName,
            statusColor: data.StatusColor,
            uploadDate: data.UploadDate,
            vendorUid: data.VendorUID,
            vendorId: data.VendorID,
            vendorName: data.VendorName,
            orderUid: data.OrderUID,
            orderId: data.OrderID,
            legUid: data.LegUID,
            legId: data.LegID,
            filename: data.Filename,
            attachmentTypeUid: data.AttachmentTypeUID,
            attachmentTypeName: data.AttachmentTypeName,
            createdBy: data.CreatedBy,
            containers: data.Containers?.map((v: any) => v.UID),
            tags: data.Tags?.map((v: any) => v.UID),
            properties: data.Properties,
          }))
          .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      );

      setTimeout(() => {
        setIsDetailLoading(false);
      }, 600);
    }
  }, [detailCondition.refNo]);

  // 選 refNo
  const handleChangeRefNo = (key: keyof typeof detailCondition, value: any) => {
    setDetailCondition((prev: any) => ({ ...prev, [key]: value }));
    setIsDetailLoading(true);
    setDetailCurrentPage(1);
    setDetailData(
      detailList
        .map((data: any) => ({
          id: data.UID,
          uid: data.UID,
          status: data.Status,
          statusName: data.StatusName,
          statusColor: data.StatusColor,
          uploadDate: data.UploadDate,
          vendorUid: data.VendorUID,
          vendorId: data.VendorID,
          vendorName: data.VendorName,
          orderUid: data.OrderUID,
          orderId: data.OrderID,
          legUid: data.LegUID,
          legId: data.LegID,
          filename: data.Filename,
          attachmentTypeUid: data.AttachmentTypeUID,
          attachmentTypeName: data.AttachmentTypeName,
          createdBy: data.CreatedBy,
          containers: data.Containers?.map((v: any) => v.UID),
          tags: data.Tags?.map((v: any) => v.UID),
          properties: data.Properties,
        }))
        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    );

    setTimeout(() => {
      setIsDetailLoading(false);
    }, 600);
  };

  // 上傳檔案
  const handleFilesChange = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    // 允許的檔案類型
    const acceptedFileTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
      'image/webp',
      'image/bmp',
      'image/tiff',
      'image/ico',
      'image/avif', // 圖片格式
      'application/pdf', // PDF 格式
      'application/vnd.ms-excel', // 舊版 Excel
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // 新版 Excel
    ];

    // 過濾不符合格式的檔案
    const invalidFiles = acceptedFiles.filter((v) => !acceptedFileTypes.includes(v.type));
    if (invalidFiles.length > 0) {
      setMessage({ message: 'Invalid file type.', severity: 'warning' });
      return;
    }
    // 格式化日期
    const formatDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };
    // 格式化新上傳的檔案格式 action必須是add
    const uploadData = acceptedFiles.map((v) => {
      const uid = uuidv4();

      return {
        id: uid,
        uid,
        file: v,
        filename: v.name,
        filetype: v.type,
        orderUid: detailCondition.refNo,
        uploadDate: formatDate(),
        statusName: 'Initial',
        statusColor: '#748194',
        action: 'add',
      };
    });

    setDetailData((prev) => [...uploadData, ...prev]);
  };
  //存檔
  const handleSave = () => {
    setMessage({ message: 'This is a DEMO version, no data will be saved.', severity: 'info' });
  };
  // 設定拖曳上傳功能
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFilesChange,
    accept: {
      'image/*': [], // 允許所有圖片類型
      'application/pdf': ['.pdf'], // 允許 PDF
      'application/vnd.ms-excel': ['.xls'], // 允許舊版 Excel (.xls)
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], // 允許新版 Excel (.xlsx)
    },
    multiple: true,
  });

  const columns = DetailColumns({ setDetailData, labelData, setTypeModalInfo, setViewModalInfo });

  return (
    <div className="h-100 overflow-auto">
      <div className="d-flex flex-column h-100 px-4 px-md-5">
        <div className="py-4">
          <form className="row gy-2" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-sm-4 col-lg-2">
              <SingleSelect
                options={refList.map((v: any) => ({
                  value: v.UID,
                  label: v.ID,
                }))}
                onChange={(value) => handleChangeRefNo('refNo', value)}
                value={detailCondition.refNo}
                clearable={true}
                label="Ref#"
              />
            </div>
            <div className="col-auto ms-auto align-self-end">
              <BButton
                type="button"
                text="Save"
                disabled={!detailCondition.refNo || detailData.length === 0}
                onClick={handleSave}
              />
            </div>
          </form>
        </div>

        <div className="rounded">
          <div className="bg-white custom-box-shadow rounded mb-4">
            {detailCondition.refNo && !isDetailLoading && (
              <div className="p-3">
                <div
                  {...getRootProps()}
                  className="rounded text-center"
                  style={{
                    border: '3px dashed #d8e2ef',
                  }}
                >
                  <input
                    {...getInputProps()}
                    onChange={(e) => handleFilesChange(e.target.files ? Array.from(e.target.files) : [])}
                  />
                  <p className="mb-1 px-2 pt-5 text-secondary fs-7 fw-semibold">
                    Drag and drop files here, or click to select files
                  </p>
                  <p className="m-0 px-2 pb-5 text-secondary fs-7 fw-semibold fst-italic">
                    (Only image, PDF, and Excel will be accepted)
                  </p>
                </div>
              </div>
            )}

            <Table
              columns={columns}
              rows={detailData.filter((v) => v.action !== 'remove')}
              loading={isDetailLoading}
              currentPage={detailCurrentPage}
              setCurrentPage={setDetailCurrentPage}
            />
          </div>
        </div>

        <TypeModal
          info={typeModalInfo}
          onConfirm={(uid, data) => {
            const newDetailData = detailData.map((v) => (v.uid === uid ? { ...v, properties: data } : v));
            setDetailData(newDetailData);
            setTypeModalInfo(null);
          }}
          onClose={() => setTypeModalInfo(null)}
        />

        <ViewModal info={viewModalInfo} onClose={() => setViewModalInfo(null)} />
      </div>
    </div>
  );
};

export default Detail;
