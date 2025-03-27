import { useState, CSSProperties } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Column,
  ColumnDef,
} from '@tanstack/react-table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import Pagination from './Pagination';
import { MdNavigateNext } from 'react-icons/md';
import { Loader } from '..';
import './Table.scss';

interface TableProps {
  rows: any[];
  columns: ColumnDef<any, any>[];
  columnPinningLeft?: string[];
  pageSize?: number;
  loading?: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const Table: React.FC<TableProps> = ({
  rows,
  columns,
  columnPinningLeft = [],
  pageSize = 10,
  loading,
  currentPage,
  setCurrentPage,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isViewingAll, setIsViewingAll] = useState<boolean>(false);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnPinning: {
        left: columnPinningLeft,
        right: [],
      },
    },
  });

  const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

    return {
      // boxShadow: isLastLeftPinnedColumn
      //   ? "-4px 0 4px -4px gray inset"
      //   : isFirstRightPinnedColumn
      //   ? "4px 0 4px -4px gray inset"
      //   : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      zIndex: isPinned ? 1 : '',
      minWidth: column.getSize(),
      verticalAlign: 'middle',
    };
  };

  const totalItems = rows.length;
  const offset = (currentPage - 1) * pageSize;
  const paginatedRows = table.getRowModel().rows.slice(offset, isViewingAll ? totalItems : currentPage * pageSize);

  const toggleView = () => {
    if (totalItems === 0) return;
    setIsViewingAll(!isViewingAll);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded h-100">
      <div className={`table-container rounded ${rows.length > 0 ? 'overflow-auto' : 'overflow-hidden'}`}>
        <table className="table table-hover fs-7 m-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ ...getCommonPinningStyles(header.column) }}
                      className="bg-light fw-semibold"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className="cursor-default p-1"
                          onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() &&
                            (header.column.getIsSorted() ? (
                              header.column.getIsSorted() === 'asc' ? (
                                <FaSortUp className="ms-1 text-secondary" />
                              ) : (
                                <FaSortDown className="ms-1 text-secondary" />
                              )
                            ) : (
                              <FaSort className="ms-1 text-secondary opacity-50" />
                            ))}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {!loading &&
              paginatedRows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} style={{ ...getCommonPinningStyles(cell.column) }}>
                        <div className="px-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="border-bottom" style={{ height: '200px' }}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <Loader />
          </div>
        </div>
      )}

      <div className="row justify-content-between align-items-center p-2">
        <div className="col-auto d-flex align-items-center">
          <div className="d-flex align-items-center text-nowrap">
            <span className="fs-8 fw-semibold text-nowrap d-none d-sm-inline me-3">
              {totalItems && offset + 1} to {isViewingAll ? totalItems : Math.min(offset + pageSize, totalItems)} Items
              of {totalItems}
            </span>
            <button
              className="btn btn-link p-0 fs-8 fs-8 fw-semibold text-decoration-none d-flex align-items-center text-nowrap"
              onClick={toggleView}
            >
              {isViewingAll ? 'View Less' : 'View All'}
              <MdNavigateNext className="fs-5" />
            </button>
          </div>
        </div>
        <div className="col-auto">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={isViewingAll ? totalItems : pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
