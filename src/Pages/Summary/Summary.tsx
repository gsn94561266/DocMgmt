import { useState } from 'react';
import { useDataContext, useSearchContext } from '../../Context';
import { Table, DateRangeInput, InputField, SingleSelect, MultiSelect, BButton } from '../../Components';
import { refList, containerList, statusList, summaryList } from '../../Data';
import SummaryColumns from './SummaryColumns';

const Summary = () => {
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const { summaryData, setSummaryData, summaryCurrentPage, setSummaryCurrentPage, labelData } = useDataContext();
  const { summaryCondition, setSummaryCondition, setDetailCondition } = useSearchContext();

  const handleChange = (key: keyof typeof summaryCondition, value: any) => {
    setSummaryCondition((prev: any) => ({
      ...prev,
      ...(key === 'uploadDate'
        ? { uploadDate: value?.[0], uploadEndDate: value?.[1] || value?.[0] }
        : { [key]: value }),
    }));
  };

  const handleSearch = () => {
    setIsSummaryLoading(true);

    setTimeout(() => {
      const filteredData = summaryList.filter((v: any) => {
        const uploadDate = new Date(v.UploadDate);
        const startDate = summaryCondition.uploadDate ? new Date(summaryCondition.uploadDate) : null;
        const endDate = summaryCondition.uploadEndDate ? new Date(summaryCondition.uploadEndDate) : null;

        return (
          (!summaryCondition.refNo || v.OrderUID === summaryCondition.refNo) &&
          (!summaryCondition.containerNo || v.Containers.some((c: any) => c.UID === summaryCondition.containerNo)) &&
          (!startDate || !endDate || (uploadDate >= startDate && uploadDate <= endDate)) &&
          (summaryCondition.label?.length === 0 || v.Tags.some((t: any) => summaryCondition.label.includes(t.UID))) &&
          (!summaryCondition.filename || v.Filename.toLowerCase().includes(summaryCondition.filename.toLowerCase())) &&
          (summaryCondition.status?.length === 0 || summaryCondition.status?.some((s: any) => s === v.Status))
        );
      });

      setSummaryData(
        filteredData.map((v: any) => ({
          id: v.UID,
          uid: v.UID,
          vendorId: v.VendorID,
          orderId: v.OrderID,
          containers: v.Containers,
          filename: v.Filename,
          attachmentTypeName: v.AttachmentTypeName,
          tags: v.Tags,
          uploadDate: v.UploadDate,
          statusName: v.StatusName,
          statusColor: v.StatusColor,
        }))
      );
      setSummaryCurrentPage(1);
      setIsSummaryLoading(false);
    }, 600);
  };

  const columns = SummaryColumns({ setDetailCondition });

  return (
    <div className="h-100 overflow-auto">
      <div className="d-flex flex-column h-100 px-4 px-md-5">
        <div className="py-4">
          <form
            className="row gy-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div className="col-12 col-sm-6 col-lg-2">
              <SingleSelect
                options={refList.map((v: any) => ({
                  value: v.UID,
                  label: v.ID,
                }))}
                onChange={(value) => handleChange('refNo', value)}
                value={summaryCondition.refNo}
                clearable={true}
                label="Ref#"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <SingleSelect
                options={containerList.map((v: any) => ({
                  value: v.UID,
                  label: v.ID,
                }))}
                onChange={(value) => handleChange('containerNo', value)}
                value={summaryCondition.containerNo}
                clearable={true}
                label="Container#"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <DateRangeInput onChange={(value) => handleChange('uploadDate', value)} label="Upload Date" />
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <MultiSelect
                options={labelData.map((v: any) =>
                  // label一律取Name
                  ({
                    value: v.UID,
                    label: v.Name,
                  })
                )}
                value={summaryCondition.label}
                onChange={(value) => handleChange('label', value)}
                clearable={true}
                label="Label"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <InputField
                onChange={(value) => handleChange('filename', value)}
                value={summaryCondition.filename}
                label="Filename"
                clearable={true}
                placeholder="Enter..."
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <MultiSelect
                options={statusList.map((v: any) => ({
                  value: v.Value,
                  label: v.Name,
                }))}
                onChange={(value) => handleChange('status', value)}
                value={summaryCondition.status}
                clearable={true}
                label="Status"
              />
            </div>
            <div className="col-auto ms-auto align-self-end">
              <BButton type="submit" text="Search" />
            </div>
          </form>
        </div>

        <div className="rounded">
          <div className="custom-box-shadow rounded mb-4">
            <Table
              columns={columns}
              rows={summaryData}
              loading={isSummaryLoading}
              currentPage={summaryCurrentPage}
              setCurrentPage={setSummaryCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
