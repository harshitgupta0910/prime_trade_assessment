import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import Alert from "../components/Alert";

const BLANK_FORM = { title: "", description: "", status: "pending" };
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    setLoadingTasks(true);
    try {
      const { data } = await fetchTasks();
      setTasks(data.data);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoadingTasks(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

  const openCreateModal = () => {
    setEditTask(null);
    setForm(BLANK_FORM);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description || "", status: task.status });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTask(null);
    setForm(BLANK_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editTask) {
        await updateTask(editTask._id, form);
        showAlert("success", "Task updated.");
      } else {
        await createTask(form);
        showAlert("success", "Task created.");
      }
      closeModal();
      loadTasks();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      showAlert("success", "Task deleted.");
      loadTasks();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to delete task.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080812] relative overflow-x-hidden">
      <div className="orb w-[500px] h-[500px] bg-indigo-700 -top-40 -left-40 fixed" />
      <div className="orb w-[400px] h-[400px] bg-violet-700 top-1/2 -right-32 fixed" />

      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <motion.div {...fadeUp(0.05)} className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Tasks</h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              {loadingTasks ? "Loading..." : `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
              <span
                className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  user.role === "admin"
                    ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                }`}
              >
                {user.role === "admin" ? "Admin" : "User"}
              </span>
            </p>
          </div>
          <motion.button
            onClick={openCreateModal}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-xl glow-sm"
          >
            + New Task
          </motion.button>
        </motion.div>

        <Alert type={alert.type} message={alert.message} />

        {loadingTasks ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <motion.div
            {...fadeUp(0.1)}
            className="text-center py-28 border border-dashed border-white/10 rounded-3xl glass"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-card flex items-center justify-center">
              <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No tasks yet</p>
            <p className="text-slate-600 text-sm mt-1">Click "+ New Task" to create your first one</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
            {tasks.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                currentUser={user}
                onEdit={openEditModal}
                onDelete={handleDelete}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-3xl p-7 w-full max-w-md glow"
            >
              <h3 className="text-base font-bold text-white mb-6">
                {editTask ? "Edit Task" : "New Task"}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="Task title"
                    className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    placeholder="Optional description"
                    className="input-dark w-full rounded-xl px-4 py-3 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-1">
                  <motion.button
                    type="button"
                    onClick={closeModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 glass border border-white/10 text-slate-300 py-2.5 rounded-xl text-sm font-semibold hover:text-white transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Saving…
                      </>
                    ) : editTask ? "Update Task" : "Create Task"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}