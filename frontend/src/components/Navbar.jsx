import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center glow-sm">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-tight">Prime Trade</span>
          <p className="text-[10px] text-slate-500 leading-none mt-0.5">Task Manager</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 glass rounded-xl px-3 py-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{user?.name}</p>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider ${
                user?.role === "admin" ? "text-violet-400" : "text-indigo-400"
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="text-xs font-semibold text-slate-400 hover:text-white glass px-3.5 py-2 rounded-xl transition"
        >
          Sign out
        </motion.button>
      </div>
    </motion.header>
  );
}
