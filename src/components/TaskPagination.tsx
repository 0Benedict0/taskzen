interface TaskPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function TaskPagination({
  currentPage,
  totalPages,
  onPageChange,
}: TaskPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="task-pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Назад
      </button>

      <span>
        Сторінка {currentPage} з {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Далі →
      </button>
    </div>
  );
}

export default TaskPagination;
