import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AddField from "./components/AddField";
import Tasks from "./components/Tasks";
import SearchFilter from "./components/SearchFilter";
import TaskDashboardBox from "./components/TaskDashboardBox";
import { supabase } from "./supabaseClient/supabaseClient";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, isGuest } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from DB if logged in
  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id) // ✅ Only logged-in user's tasks
      .order("duedate", { ascending: true })
      .order("duetime", { ascending: true });

    if (!error) setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else if (isGuest) {
      // Load guest tasks from localStorage immediately
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      setTasks(guestTasks);
      setLoading(false);
    } else {
      // Clear tasks for non-authenticated users
      setTasks([]);
      setLoading(false);
    }
  }, [user, isGuest]);

  // Common functions (use Supabase for users, local state for guests)
  const handleAddData = async (taskData) => {
    if (isGuest) {
      const newTasks = [...tasks, { ...taskData, id: Date.now() }];
      setTasks(newTasks);
      localStorage.setItem("guestTasks", JSON.stringify(newTasks));
      toast.success("Task added (Guest mode)");
    } else {
      const { error } = await supabase.from("ToDo_List").insert([
        {
          ...taskData,
          user_id: user.id, // ✅ Store current user's ID
        },
      ]);
      if (!error) {
        toast.success("Task added");
        fetchTasks();
      }
    }
  };

  const handleDelete = async (id) => {
    if (isGuest) {
      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);
      localStorage.setItem("guestTasks", JSON.stringify(newTasks));
      toast.success("Task deleted (Guest mode)");
    } else {
      const { error } = await supabase.from("ToDo_List").delete().eq("id", id);
      if (!error) {
        toast.success("Task deleted");
        fetchTasks();
      }
    }
  };

  const handleEditData = async (id, updatedTask) => {
    if (isGuest) {
      const newTasks = tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      );
      setTasks(newTasks);
      localStorage.setItem("guestTasks", JSON.stringify(newTasks));
      toast.success("Task updated (Guest mode)");
    } else {
      const { error } = await supabase
        .from("ToDo_List")
        .update(updatedTask)
        .eq("id", id);
      if (!error) {
        toast.success("Task updated");
        fetchTasks();
      }
    }
  };

  const isCompleted = async (id, current) => {
    if (isGuest) {
      const newTasks = tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !current } : task
      );
      setTasks(newTasks);
      localStorage.setItem("guestTasks", JSON.stringify(newTasks));
    } else {
      const { error } = await supabase
        .from("ToDo_List")
        .update({ isCompleted: !current })
        .eq("id", id);
      if (!error) fetchTasks();
    }
  };

  const ClearAll = async () => {
    if (isGuest) {
      setTasks([]);
      localStorage.setItem("guestTasks", JSON.stringify([]));
      toast.success("All tasks cleared (Guest mode)");
    } else {
      const { error } = await supabase.from("ToDo_List").delete().neq("id", 0);
      if (!error) {
        toast.success("All tasks cleared");
        setTasks([]);
      }
    }
  };

  // Filters (only for DB users)
  const fetchCompletedTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id)
      .eq("isCompleted", true);
    if (!error) setTasks(data);
  };

  const fetchUnCompletedTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id)
      .eq("isCompleted", false);
    if (!error) setTasks(data);
  };

  const fetchByPriority = async (priority) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id)
      .eq("priority", priority);
    if (!error) setTasks(data);
  };

  const fetchTasksBySearch = async (query) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ToDo_List")
      .select("*")
      .eq("user_id", user.id)
      .ilike("task", `%${query}%`);
    if (!error) setTasks(data);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AddField handleAddData={handleAddData} />
        <SearchFilter
          ClearAll={ClearAll}
          fetchCompletedTasks={fetchCompletedTasks}
          fetchUnCompletedTasks={fetchUnCompletedTasks}
          fetchTasks={fetchTasks}
          fetchByPriority={fetchByPriority}
          fetchTasksBySearch={fetchTasksBySearch}
        />

        {/* Main content area with tasks and dashboard */}
        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          {/* Tasks section */}
          <div className="flex-1">
            <Tasks
              tasks={tasks}
              handleDelete={handleDelete}
              handleEditData={handleEditData}
              isCompleted={isCompleted}
            />
          </div>

          {/* Dashboard sidebar - Only show for logged in users or guests */}
          {(user || isGuest) && (
            <div className="flex-shrink-0 lg:sticky lg:top-6 lg:self-start">
              <TaskDashboardBox tasks={tasks} loading={loading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
