import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const TaskDashboardBox = ({ tasks, loading = false }) => {
  const { user, isGuest } = useAuth();
  const [dashboardTasks, setDashboardTasks] = useState([]);

  useEffect(() => {
    if (tasks && tasks.length >= 0) {
      // Use tasks from props (already loaded by parent component)
      setDashboardTasks(tasks);
    } else if (isGuest) {
      // For guest users, get from localStorage as fallback
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      setDashboardTasks(guestTasks);
    }
  }, [tasks, isGuest]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 w-full lg:w-80">
        <div className="text-center py-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            Loading...
          </h3>
          <p className="text-gray-600 text-xs">Fetching your tasks</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalTasks = dashboardTasks.length;
  const completedTasks = dashboardTasks.filter(
    (task) => task.isCompleted
  ).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate overdue tasks
  const today = new Date().toISOString().split("T")[0];
  const overdueTasks = dashboardTasks.filter(
    (task) => !task.isCompleted && task.duedate && task.duedate < today
  ).length;

  // Priority distribution
  const priorityStats = {
    high: dashboardTasks.filter(
      (task) => task.priority?.toLowerCase() === "high"
    ).length,
    medium: dashboardTasks.filter(
      (task) => task.priority?.toLowerCase() === "medium"
    ).length,
    low: dashboardTasks.filter((task) => task.priority?.toLowerCase() === "low")
      .length,
    none: dashboardTasks.filter(
      (task) => !task.priority || task.priority === ""
    ).length,
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (totalTasks === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 w-full lg:w-80">
        <div className="text-center py-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            Dashboard
          </h3>
          <p className="text-gray-600 text-xs">Add tasks to see progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 w-full lg:w-80">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Dashboard</h3>
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-blue-600">
            {completionRate}%
          </div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600">{totalTasks}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">
            {completedTasks}
          </div>
          <div className="text-xs text-gray-600">Done</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-yellow-600">
            {pendingTasks}
          </div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-600">{overdueTasks}</div>
          <div className="text-xs text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs text-gray-900">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div>
        <h4 className="text-xs font-semibold text-gray-800 mb-2">Priority</h4>
        <div className="space-y-1">
          {Object.entries(priorityStats).map(([priority, count]) => (
            <div key={priority} className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  priority
                )}`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
              <span className="text-xs font-semibold text-gray-900">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDashboardBox;
