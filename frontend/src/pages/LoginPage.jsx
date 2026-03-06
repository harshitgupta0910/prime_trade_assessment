import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../api/authApi";
import Alert from "../components/Alert";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const { data } = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAlert({ type: "success", message: "Login successful. Redirecting..." });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Login failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080812] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-violet-600 -top-32 right-0" />
      <div className="orb w-80 h-80 bg-indigo-600 bottom-0 -left-20" />
      <div className="orb w-72 h-72 bg-blue-700 top-1/3 left-1/3" />

      <div className="w-full max-w-md relative z-10">
        <motion.div {...fadeUp(0)} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl btn-primary mb-4 glow">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Prime Trade</h1>
          <p className="text-slate-400 text-sm mt-1">Task Management Platform</p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="glass-card rounded-3xl p-8 glow">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <Alert type={alert.type} message={alert.message} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <motion.div {...fadeUp(0.18)}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
            </motion.div>

            <motion.div {...fadeUp(0.25)}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
            </motion.div>

            <motion.div {...fadeUp(0.32)} className="pt-1">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading && (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {loading ? "Signing in..." : "Sign In"}
                </span>
              </motion.button>
            </motion.div>
          </form>

          <motion.p {...fadeUp(0.38)} className="text-sm text-center text-slate-500 mt-6">
            No account?{" "}
            <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
