import { useMemo } from 'react';
import { Badge, SingleSelect, MultiSelect, TagsSelect, BButton } from '../../Components';
import { OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';
import { FaTrashAlt, FaFileAlt } from 'react-icons/fa';
import { MdManageSearch } from 'react-icons/md';
import { format } from 'date-fns';
import { containerList, legList, typeList } from '../../Data';

const DetailColumns = ({ setDetailData, labelData, setTypeModalInfo, setViewModalInfo }: any) => {
  return useMemo(() => {
    return [
      {
        accessorKey: 'actions',
        header: () => 'Actions',
        size: 100,
        enableSorting: false,
        cell: (info: any) => {
          const { file, uid } = info.row.original;

          return (
            <>
              <OverlayTrigger placement="top" overlay={<Tooltip style={{ fontSize: '12px' }}>View</Tooltip>}>
                <button
                  type="button"
                  className="btn p-0 border-0 text-secondary fs-5"
                  onClick={() => setViewModalInfo({ file, uid })}
                >
                  <FaFileAlt size={20} />
                </button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip style={{ fontSize: '12px' }}>Delete</Tooltip>}>
                <button
                  type="button"
                  className="btn p-0 border-0 text-secondary fs-5 ms-2"
                  onClick={() => {
                    setDetailData((prev: any[]) =>
                      prev.reduce((acc, item) => {
                        if (item.uid !== uid) {
                          acc.push(item);
                          return acc;
                        }

                        const newAction = item.action === 'add' ? 'removeNow' : 'remove';
                        if (newAction !== 'removeNow') {
                          acc.push({ ...item, action: newAction });
                        }

                        return acc;
                      }, [])
                    );
                  }}
                >
                  <FaTrashAlt />
                </button>
              </OverlayTrigger>
            </>
          );
        },
      },
      {
        accessorKey: 'filename',
        header: 'Filename',
        size: 250,
        cell: (info: any) => <div>{info.getValue()}</div>,
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
        size: 100,
        cell: (info: any) => {
          const { statusColor } = info.row.original;
          return <Badge label={info.getValue()} color={statusColor} />;
        },
      },
      {
        accessorKey: 'containers',
        header: 'Container#',
        size: 200,
        cell: (info: any) => {
          const { containers = [], uid } = info.row.original;

          return (
            <MultiSelect
              options={containerList.map((v: any) => ({
                value: v.UID,
                label: v.ID,
              }))}
              value={containers}
              onChange={(selectedValues) => {
                setDetailData((prev: any) =>
                  prev.map((v: any) => (v.uid === uid ? { ...v, containers: selectedValues, legUid: null } : v))
                );
              }}
              clearable={true}
            />
          );
        },
      },
      {
        accessorKey: 'legId',
        header: 'Leg',
        size: 120,
        cell: (info: any) => {
          const { uid, containers = [], legUid } = info.row.original;

          const options =
            containers.length === 1
              ? legList
                  .filter((o: any) => o.ContainerUID === containers[0])
                  .map((v: any) => ({
                    value: v.UID,
                    label: v.ID,
                    from: v.From,
                    to: v.To,
                  }))
              : [];

          return (
            <SingleSelect
              options={options}
              onChange={(selectedValue) => {
                setDetailData((prev: any) =>
                  prev.map((v: any) => (v.uid === uid ? { ...v, legUid: selectedValue } : v))
                );
              }}
              value={legUid}
              clearable={true}
              disabled={containers.length !== 1}
              isLegSelect={true}
              menuPosition="fixed"
            />
          );
        },
      },
      {
        accessorKey: 'tags',
        header: 'Label',
        size: 250,
        cell: (info: any) => {
          const { uid, tags = [] } = info.row.original;

          return (
            <TagsSelect
              options={labelData?.map((v: any) =>
                // label一律取Name
                ({
                  value: v.UID,
                  label: v.Name,
                  type: v.Type,
                })
              )}
              onChange={(selectedValues) => {
                setDetailData((prev: any) => {
                  return prev.map((v: any) => (v.uid === uid ? { ...v, tags: selectedValues } : v));
                });
              }}
              value={tags}
            />
          );
        },
      },
      {
        accessorKey: 'attachmentTypeName',
        header: 'Type',
        size: 130,
        cell: (info: any) => {
          const fileData = info.row.original;
          return (
            <SingleSelect
              options={typeList.map((v: any) => ({
                value: v.UID,
                label: v.ID,
              }))}
              onChange={(selectedValue) => {
                const selectedType = selectedValue ? typeList.find((v: any) => v.UID === selectedValue) : null;

                const initialProperty =
                  selectedType &&
                  selectedType.Fields.map((v: any) => ({
                    FieldUID: v.UID,
                    Name: v.Name,
                    Value: '',
                  }));

                setDetailData((prevDetailData: any) => {
                  return prevDetailData.map((v: any) =>
                    v.uid === fileData.uid
                      ? {
                          ...v,
                          attachmentTypeUid: selectedValue,
                          attachmentTypeName: selectedType?.ID,
                          properties: initialProperty,
                        }
                      : v
                  );
                });

                const newShowModal = selectedType
                  ? {
                      uid: fileData.uid,
                      file: fileData.file,
                      type: selectedType,
                      properties: initialProperty,
                    }
                  : null;

                setTypeModalInfo(newShowModal);
              }}
              value={fileData.attachmentTypeUid}
              clearable={true}
              menuPosition="fixed"
            />
          );
        },
      },
      {
        accessorKey: 'properties',
        header: 'Property',
        size: 190,
        enableSorting: false,
        cell: (info: any) => {
          const fileData = info.row.original;
          return (
            fileData.properties && (
              <div className="d-flex align-items-center">
                <BButton
                  onClick={() => {
                    setTypeModalInfo({
                      uid: fileData.uid,
                      file: fileData.file,
                      type: typeList.find((v: any) => v.UID === fileData.attachmentTypeUid),
                      properties: fileData.properties,
                    });
                  }}
                  className="bg-info text-white me-1"
                  text="Edit Property"
                />
                <OverlayTrigger
                  trigger={['click', 'hover']}
                  placement="left"
                  flip={true}
                  overlay={
                    <Popover>
                      <Popover.Body className="fs-7 py-2">
                        {fileData.properties.map((v: any, i: number) => (
                          <div className="m-1" key={i}>
                            <span className="text-secondary text-nowrap fw-semibold">
                              {v.Name}
                              <span className="mx-1">:</span>
                            </span>
                            <span className="text-secondary text-nowrap ms-1">{v.Value}</span>
                          </div>
                        ))}
                      </Popover.Body>
                    </Popover>
                  }
                  rootClose
                >
                  <MdManageSearch className="text-secondary ms-2 cursor-pointer fs-3" />
                </OverlayTrigger>
              </div>
            )
          );
        },
      },
    ];
  }, [labelData]);
};

export default DetailColumns;
