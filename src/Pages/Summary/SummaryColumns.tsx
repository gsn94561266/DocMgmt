import { Badge } from '../../Components';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { format } from 'date-fns';
import { refList } from '../../Data';

const SummaryColumns = ({ setDetailCondition }: any) => {
  const navigate = useNavigate();

  return [
    {
      accessorKey: 'vendorId',
      header: 'Vendor#',
      size: 150,
    },
    {
      accessorKey: 'orderId',
      header: 'Ref#',
      size: 120,
    },
    {
      accessorKey: 'containers',
      header: 'Container#',
      size: 120,
      cell: (info: any) => {
        const value = info.getValue();
        return (
          <div className="row g-2">
            {value.map((v: any, i: number) => (
              <span key={i} className="col-auto">
                <Badge label={v.ID} color="secondary" />
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'filename',
      header: 'Filename',
      size: 180,
    },
    {
      accessorKey: 'attachmentTypeName',
      header: 'Type',
      size: 120,
    },
    {
      accessorKey: 'tags',
      header: 'Label',
      size: 250,
      enableSorting: false,
      cell: (info: any) => {
        const value = info.getValue();
        return (
          <div className="row g-2">
            {value.map((v: any, i: number) => (
              <span key={i} className="col-auto">
                <Badge label={v.Name} color="primary" />
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'uploadDate',
      header: 'Upload Date',
      size: 150,
      cell: (info: any) => format(new Date(info.getValue()), 'MM/dd/yyyy HH:mm'),
    },
    {
      accessorKey: 'statusName',
      header: 'Status',
      size: 130,
      cell: (info: any) => {
        const fileData = info.row.original;
        const value = info.getValue();
        return <Badge label={value} color={fileData.statusColor} />;
      },
    },
    {
      accessorKey: 'actions',
      header: () => <div className="text-end pe-0">Actions</div>,
      size: 70,
      enableSorting: false,
      cell: (info: any) => {
        const fileData = info.row.original;
        return (
          <div className="text-end p-1">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-view`} style={{ fontSize: '12px' }}>
                  Edit
                </Tooltip>
              }
            >
              <FaEdit
                size={20}
                className="text-secondary cursor-pointer"
                onClick={() => {
                  const refUid = refList.find((v) => v.ID === fileData.orderId)?.UID;
                  setDetailCondition((prev: any) => ({
                    ...prev,
                    refNo: refUid,
                    uid: fileData.uid,
                  }));
                  navigate('/upload-document');
                }}
              />
            </OverlayTrigger>
          </div>
        );
      },
    },
  ];
};

export default SummaryColumns;
