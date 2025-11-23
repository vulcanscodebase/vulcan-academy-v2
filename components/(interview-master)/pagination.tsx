"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-700 dark:text-gray-300">
        {`Page {currentPage} of {totalPages}`}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
