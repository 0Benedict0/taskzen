import { useState } from "react";
import CreateTaskModal from "../components/CreateTaskModal";
import Sidebar from "../components/Sidebar";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import useTasks from "../hooks/useTasks";
import DashboardHeader from "../components/DashboardHeader";
import TasksSection from "../components/TasksSection";
import DashboardStats from "../components/DashboardStats";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import KanbanBoard from "../components/KanbanBoard";
function DashboardLayout() {
  const {
    tasks,
    filteredTasks,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,

    isLoading,
    actionTaskId,
    error,
    loadTasks,
    setError,

    paginatedTasks,
    currentPage,
    setCurrentPage,
    handlePageChange,
    totalPages,

    searchQuery,
    setSearchQuery,

    statusFilter,
    setStatusFilter,

    editingTask,
    setEditingTask,

    taskToDelete,
    setTaskToDelete,

    handleCreateTask,
    handleDeleteTask,
    handleStatusChange,
    handleEditTask,
    handleUpdateTask,
    handleDragStatusChange,
  } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <DashboardHeader />

        <section className="dashboard-content">
          <h2>Огляд</h2>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={loadTasks} />
          ) : (
            <>
              <DashboardStats
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                inProgressTasks={inProgressTasks}
                todoTasks={todoTasks}
              />

              <TasksSection
                paginatedTasks={paginatedTasks}
                onAddTask={() => setIsModalOpen(true)}
                onStatusChange={handleStatusChange}
                onDragStatusChange={handleDragStatusChange}
                onDelete={(task) => setTaskToDelete(task)}
                onEdit={(task) => {
                  handleEditTask(task);
                  setIsModalOpen(true);
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                actionTaskId={actionTaskId}
              />
            </>
          )}
        </section>
      </main>

      {isModalOpen && (
        <CreateTaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {taskToDelete && (
        <DeleteConfirmModal
          task={taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={() => {
            handleDeleteTask(taskToDelete._id);
            setTaskToDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
