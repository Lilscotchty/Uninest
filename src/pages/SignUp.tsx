import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Eye, EyeOff, User, Lock, ArrowLeft } from "lucide-react";
import { Facebook, Twitter, Linkedin, Apple, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

// ─── Zod schemas ──────────────────────────────────────────────────────────────
const signInSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

// ─── Circuit divider SVG ──────────────────────────────────────────────────────
function CircuitDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <svg className="flex-1 h-px" viewBox="0 0 100 1" preserveAspectRatio="none">
        <line x1="0" y1="0.5" x2="80" y2="0.5" stroke="#334155" strokeWidth="1" />
        <circle cx="85" cy="0.5" r="2" fill="#334155" />
        <circle cx="93" cy="0.5" r="1.2" fill="#334155" />
        <circle cx="99" cy="0.5" r="0.8" fill="#334155" />
      </svg>
      <span className="text-[#64748b] text-sm font-medium px-2">or</span>
      <svg className="flex-1 h-px" viewBox="0 0 100 1" preserveAspectRatio="none">
        <circle cx="1" cy="0.5" r="0.8" fill="#334155" />
        <circle cx="7" cy="0.5" r="1.2" fill="#334155" />
        <circle cx="15" cy="0.5" r="2" fill="#334155" />
        <line x1="20" y1="0.5" x2="100" y2="0.5" stroke="#334155" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function SkyCobeLogo() {
  return (
    <div className="flex flex-col items-center mb-6">
      {/* Hexagonal logo mark */}
      <div className="relative mb-5">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-[22px]"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(192,132,60,0.35) 0%, transparent 70%)",
            transform: "scale(1.4)",
            filter: "blur(12px)",
          }}
        />
        <div
          className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center relative justify-center overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #1e2936 0%, #111827 60%, #0f1720 100%)",
            border: "1px solid rgba(192,132,60,0.4)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)",
          }}
        >
          {/* Concentric square rings */}
          {[72, 60, 48].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-[14px] border"
              style={{
                width: size,
                height: size,
                borderColor: `rgba(192,132,60,${0.15 + i * 0.08})`,
              }}
            />
          ))}
          {/* S lettermark */}
          <span
            className="relative z-10 text-3xl font-black tracking-tighter"
            style={{
              fontFamily: "'Georgia', serif",
              color: "transparent",
              backgroundImage: "linear-gradient(160deg, #e8b96a 0%, #c0843c 50%, #8b5e2a 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            S
          </span>
        </div>
      </div>

      <h1
        className="text-2xl font-bold tracking-wide"
        style={{
          color: "transparent",
          backgroundImage: "linear-gradient(90deg, #e0c080 0%, #ffffff 50%, #c8a060 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Welcome to <span style={{ color: "#e8b96a" }}>SKYCOBE</span>
      </h1>
    </div>
  );
}

// ─── Social icon button ───────────────────────────────────────────────────────
function SocialBtn({ icon, label, ...props }: { icon: React.ReactNode; label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        background: "linear-gradient(145deg, #1e2936, #111827)",
        border: "1px solid rgba(100,116,139,0.3)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function AuthInput({
  icon,
  placeholder,
  type = "text",
  trailing,
  error,
  ...rest
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  trailing?: React.ReactNode;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4 text-left">
      <div
        className="flex items-center gap-3 px-4 h-[52px] rounded-xl relative"
        style={{
          background: "rgba(15,23,36,0.8)",
          border: `1px solid ${error ? "rgba(239,68,68,0.6)" : "rgba(100,116,139,0.3)"}`,
        }}
      >
        <span className="text-[#64748b] flex-shrink-0">{icon}</span>
        <input
          {...rest}
          type={type}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-[#4a5568] text-[16px] outline-none"
          style={{ fontSize: 16 }}
        />
        {trailing && <span className="flex-shrink-0">{trailing}</span>}
      </div>
      {error && <p className="text-red-400 text-xs mt-1 pl-1 text-left">{error}</p>}
    </div>
  );
}

// ─── Primary CTA button ───────────────────────────────────────────────────────
function PrimaryBtn({ children, loading, className = "", ...rest }: { children: React.ReactNode; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`w-full h-[52px] rounded-xl font-semibold text-[15px] tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center cursor-pointer ${className}`}
      style={{
        background: "linear-gradient(135deg, #c0843c 0%, #8b5e2a 100%)",
        color: "#fff",
        boxShadow: "0 4px 20px rgba(192,132,60,0.3)",
      }}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────

export function SignUp() {
  const location = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">(location.pathname === "/signup" ? "signup" : "signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  // Sign-in form
  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  // Sign-up form
  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  
  const [searchParams] = useSearchParams();
  const rawRole = searchParams.get('role') || 'student';
  const role = rawRole === 'manager' ? 'manager' : 'student';

  const onSignIn = async (data: SignInData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.emailOrUsername,
        password: data.password || '',
      });
      
      if (error) {
        toast.error(error.message);
        showToast(error.message);
      } else {
        toast.success("Logged in successfully!");
        showToast("Logged in successfully!");
        navigate(role === 'manager' ? '/manager/dashboard' : '/student/dashboard', { replace: true });
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.fullName.split(" ")[0] || "",
            last_name: data.fullName.split(" ").slice(1).join(" ") || "",
            full_name: data.fullName,
            account_type: role,
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        showToast(error.message);
      } else {
        toast.success("Account created successfully!");
        showToast("Account created successfully!");
        navigate(role === 'manager' ? '/manager/dashboard' : '/student/dashboard', { replace: true });
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      if (role) {
        localStorage.setItem('signupRole', role);
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        toast.error(error.message);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
    }
  };


  const socialProviders = [
    { icon: <Facebook color="#1877f2" />, label: "Continue with Facebook" },
    { icon: <Twitter color="white" />, label: "Continue with X" },
    { icon: <Linkedin color="#0a66c2" />, label: "Continue with LinkedIn" },
    { icon: <CheckCircle2 color="#720e9e" />, label: "Continue with Yahoo" },
    { icon: <Apple color="white" />, label: "Continue with Apple" },
  ];

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0f1a 0%, #0d1525 40%, #111827 100%)",
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(192,132,60,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Circuit board texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm mx-4 px-7 py-8 rounded-3xl z-10"
        style={{
          background: "rgba(10,15,26,0.85)",
          border: "1px solid rgba(100,116,139,0.2)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Back button — only on signup */}
        <AnimatePresence>
          {mode === "signup" && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={() => setMode("signin")}
              className="absolute top-5 left-5 w-9 h-9 rounded-full flex items-center justify-center z-20 cursor-pointer"
              style={{ border: "1px solid rgba(100,116,139,0.3)", background: "rgba(15,23,36,0.8)" }}
              aria-label="Back to sign in"
            >
              <ArrowLeft size={16} className="text-[#94a3b8]" />
            </motion.button>
          )}
        </AnimatePresence>

        <SkyCobeLogo />

        <AnimatePresence mode="wait">
          {/* ── SIGN IN ── */}
          {mode === "signin" && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-center text-[#64748b] text-sm mb-5 tracking-wide">Sign in with</p>

              {/* Google primary */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full h-[52px] rounded-xl flex items-center justify-center gap-3 mb-3 font-medium text-white text-[15px] transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
                style={{
                  background: "rgba(15,23,36,0.8)",
                  border: "1px solid rgba(59,130,246,0.5)",
                  boxShadow: "0 0 0 1px rgba(59,130,246,0.1)",
                }}
              >
                <FcGoogle size={22} />
                Continue with Google
              </button>

              {/* Other socials */}
              <div className="flex justify-center gap-2 mb-1">
                {socialProviders.map((p) => (
                  <SocialBtn key={p.label} icon={p.icon} label={p.label} />
                ))}
              </div>

              <CircuitDivider />

              {/* Email/username input */}
              <form onSubmit={signInForm.handleSubmit(onSignIn)}>
                <AuthInput
                  icon={<Mail size={18} />}
                  placeholder="Email or Username"
                  error={signInForm.formState.errors.emailOrUsername?.message}
                  {...signInForm.register("emailOrUsername")}
                />
                
                <AuthInput
                  icon={<Lock size={18} />}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  error={signInForm.formState.errors.password?.message}
                  trailing={
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="text-[#64748b] cursor-pointer">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...signInForm.register("password")}
                />

                <PrimaryBtn type="submit" loading={loading} className="mt-2">
                  Continue
                </PrimaryBtn>
              </form>

              <p className="text-center text-[11px] text-[#475569] mt-4 leading-relaxed">
                By signing in, you agree to our{" "}
                <a href="#" className="text-[#c0843c] hover:underline">Terms of Use</a>
                {", "}
                <a href="#" className="text-[#c0843c] hover:underline">Privacy Policy</a>
                {", and "}
                <a href="#" className="text-[#c0843c] hover:underline">Cookies Policy</a>.
              </p>

              <p className="text-center text-[#64748b] text-sm mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[#e8b96a] font-medium hover:underline cursor-pointer"
                >
                  [Sign up]
                </button>
              </p>
            </motion.div>
          )}

          {/* ── SIGN UP ── */}
          {mode === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-center text-[#64748b] text-sm mb-5 tracking-wide">Create your account</p>

              <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-0">
                <AuthInput
                  icon={<User size={18} />}
                  placeholder="Full Name"
                  error={signUpForm.formState.errors.fullName?.message}
                  {...signUpForm.register("fullName")}
                />
                <AuthInput
                  icon={<Mail size={18} />}
                  placeholder="Email Address"
                  type="email"
                  error={signUpForm.formState.errors.email?.message}
                  {...signUpForm.register("email")}
                />
                <AuthInput
                  icon={<Lock size={18} />}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  error={signUpForm.formState.errors.password?.message}
                  trailing={
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="text-[#64748b] cursor-pointer">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...signUpForm.register("password")}
                />
                <AuthInput
                  icon={<Lock size={18} />}
                  placeholder="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  error={signUpForm.formState.errors.confirmPassword?.message}
                  trailing={
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-[#64748b] cursor-pointer">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...signUpForm.register("confirmPassword")}
                />

                <div className="pt-2">
                  <PrimaryBtn type="submit" loading={loading}>
                    Create Account
                  </PrimaryBtn>
                </div>
              </form>

              <p className="text-center text-[11px] text-[#475569] mt-4 leading-relaxed">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-[#c0843c] hover:underline">Terms of Use</a>
                {" and "}
                <a href="#" className="text-[#c0843c] hover:underline">Privacy Policy</a>.
              </p>

              <p className="text-center text-[#64748b] text-sm mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-[#e8b96a] font-medium hover:underline cursor-pointer"
                >
                  [Sign in]
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
