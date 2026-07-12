import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return "All fields are required";
    }
    if (!EMAIL_REGEX.test(email)) return "Enter a valid email address";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(name, email, password);
      navigate("/login");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;
      setError(message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-start bg-hero-gradient text-white px-14 lg:px-20 py-16 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="relative animate-fade-in-up">
          <Logo size="lg" withText={false} linkTo="" />
          <h1 className="text-3xl lg:text-4xl font-bold mt-6 mb-4 leading-tight">
            Begin your journey<br />with VedConnect
          </h1>
          <p className="text-purple-100/90 max-w-sm leading-relaxed">
            Create an account and experience secure, real-time conversations built for meaningful connection.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 sm:px-8 py-14">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center md:text-left">Create an Account</h2>
          <p className="text-sm text-slate-500 mb-6 text-center md:text-left">
            Join VedConnect in just a few seconds.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-3xl shadow-card border border-purple-100/60 animate-fade-in-up">
            {error && (
              <p className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm" role="alert">
                {error}
              </p>
            )}

            <div className="relative">
              <User className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-purple-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-purple-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-purple-200 rounded-xl pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-purple-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white py-2.5 rounded-xl font-medium shadow-soft hover:shadow-card hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-sm text-center text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-700 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
