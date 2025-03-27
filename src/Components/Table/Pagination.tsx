import { useEffect } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.max(0, Math.ceil(totalItems / (pageSize || 1)));

  useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange(Math.max(1, currentPage - 1));
    }
  }, [totalItems, currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages.map((page, index) =>
      typeof page === 'number' ? (
        <button
          key={page}
          className={`btn fs-8 fw-semibold mx-1 p-0 border-0 ${currentPage === page ? 'btn-primary text-white' : ''}`}
          style={{ width: 26, height: 26 }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ) : (
        <button
          key={`ellipsis-${index}`}
          className="btn fs-8 fw-semibold mx-1 p-0 border-0"
          style={{ width: 26, height: 26 }}
          onClick={() => {
            if (index === 1) {
              const jumpTo = pages.length === 6 ? totalPages - 4 : currentPage - 2;
              onPageChange(jumpTo);
            } else {
              const jumpTo = pages.length === 6 ? 5 : currentPage + 2;
              onPageChange(jumpTo);
            }
          }}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="my-1">
      <button
        className={`btn p-0 border-0 mx-1 fs-5 d-inline-flex align-items-center justify-content-center ${
          currentPage === 1 || totalItems === 0 ? 'text-secondary' : ''
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1 || totalItems === 0}
        style={{ width: 26, height: 26 }}
      >
        <MdNavigateBefore />
      </button>

      {renderPageNumbers()}

      <button
        className={`btn p-0 border-0 mx-1 fs-5 d-inline-flex align-items-center justify-content-center ${
          currentPage === totalPages || totalItems === 0 ? 'text-secondary' : ''
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages || totalItems === 0}
        style={{ width: 26, height: 26 }}
      >
        <MdNavigateNext />
      </button>
    </div>
  );
};

export default Pagination;
