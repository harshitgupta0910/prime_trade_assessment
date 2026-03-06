import { motion } from "framer-motion";

export default function TaskCard({ task, currentUser, onEdit, onDelete, index = 0 }) {
  const isCompleted = task.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3 cursor-default"
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-semibold text-sm leading-snug flex-1 ${
            isCompleted ? "line-through text-slate-500" : "text-white"
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
            isCompleted
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          }`}
        >
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-[11px] text-slate-600">{task.createdBy?.name}</span>

        <div className="flex gap-1.5">
          <motion.button
            onClick={() => onEdit(task)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="text-xs font-semibold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition"
          >
            Edit
          </motion.button>
          {currentUser?.role === "admin" && (
            <motion.button
              onClick={() => onDelete(task._id)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition"
            >
              Delete
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
