import { useState } from "react";
import type { Task } from "../services/taskService";
import CreateTaskModal from "../components/CreateTaskModal";
import Sidebar from "../components/Sidebar";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import DashboardHeader from "../components/DashboardHeader";
import TasksSection from "../components/TasksSection";
import DashboardStats from "../components/DashboardStats";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import useTasks from "../hooks/useTasks";

function DashboardLayout() {
  const {
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,

    isLoading,
    actionTaskId,
    error,
    loadTasks,

    paginatedTasks,
    currentPage,
    totalPages,
    handlePageChange,

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
            <ErrorState
              message={error}
              onRetry={() => loadTasks(currentPage)}
            />
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
                onAddTask={() => {
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
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
          onCreateTask={async (task) => {
            await handleCreateTask(task);
            setIsModalOpen(false);
          }}
          onUpdateTask={async (task) => {
            await handleUpdateTask(task);
            setIsModalOpen(false);
          }}
        />
      )}

      {taskToDelete && (
        <DeleteConfirmModal
          task={taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={async () => {
            await handleDeleteTask(taskToDelete._id);
            setTaskToDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
