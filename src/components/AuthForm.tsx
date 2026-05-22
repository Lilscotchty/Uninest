import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User, Phone, BookOpen, Layers } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Base schema for Login
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Advanced schema for Signup
const signupSchema = loginSchema.extend({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[!@#$%^&*,.?":{}|<>]/, { message: "Password must contain at least one symbol" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  phone: z.string().min(6, { message: "Valid phone number is required" }),
  university: z.string().optional(),
  level: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  type: 'login' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const rawRole = searchParams.get('role') || 'student';
  const role = rawRole === 'manager' ? 'manager' : 'student';
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useAppContext();

  // Use Zod resolver based on type
  const isLogin = type === 'login';
  const currentSchema = isLogin ? loginSchema : signupSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      university: '',
      level: '',
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let authError = null;

    try {
      if (isLogin) {
        // Handle Login
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        authError = error;
      } else {
        // Handle Signup
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              full_name: `${data.firstName} ${data.lastName}`,
              phone: data.phone,
              account_type: role,
              university: data.university,
              level: data.level,
            }
          }
        });
        authError = error;
      }

      if (authError) {
        toast.error(authError.message);
        showToast(authError.message);
      } else {
        toast.success(isLogin ? "Logged in successfully!" : "Account created successfully!");
        showToast(isLogin ? "Logged in successfully!" : "Account created successfully!");
        // The App component's useEffect will automatically redirect based on user role
        // but we can also manually navigate here for swift reaction.
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      if (!isLogin && role) {
        // Store the intended role in localStorage so we can tag them after redirect, 
        // Note: Supabase UI handles metadata via Trigger or next login, but for simplicity:
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

  const InputField = ({ label, icon: Icon, id, type: inputType, placeholder, error }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon className="absolute left-3.5 text-gray-400" size={16} />
        <input
          {...register(id)}
          type={inputType}
          id={id}
          placeholder={placeholder}
          className={`w-full bg-white border ${error ? 'border-red-500' : 'border-gray-200'} rounded-[14px] py-3.5 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 text-[0.9rem] transition-all shadow-sm font-medium`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error.message}</p>}
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-6">
        <h2 className="font-montserrat text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500 text-[0.85rem] mt-1">
          {isLogin 
            ? 'Sign in to continue to UniNest.' 
            : `Signing up as a ${role === 'manager' ? 'Manager' : 'Student'}.`}
        </p>
      </div>

      <button
        onClick={handleGoogleAuth}
        type="button"
        className="w-full bg-white border border-gray-300 text-gray-700 font-bold text-[0.95rem] py-3.5 rounded-[14px] shadow-sm mb-6 flex items-center justify-center gap-3 transition-colors hover:bg-gray-50 active:scale-[0.98]"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
        {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
      </button>

      <div className="relative flex items-center py-2 mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
          Or continue with email
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-3">
            <InputField label="First Name" icon={User} id="firstName" type="text" placeholder="Kwame" error={errors.firstName} />
            <InputField label="Last Name" icon={User} id="lastName" type="text" placeholder="Owusu" error={errors.lastName} />
          </div>
        )}
        
        <InputField label="Email Address" icon={Mail} id="email" type="email" placeholder="you@example.com" error={errors.email} />
        
        {!isLogin && (
           <InputField label="Phone" icon={Phone} id="phone" type="tel" placeholder="+233 50 123 4567" error={errors.phone} />
        )}

        {!isLogin && role === 'student' && (
          <div className="grid grid-cols-2 gap-3">
            <InputField label="University" icon={BookOpen} id="university" type="text" placeholder="KNUST" error={errors.university} />
            <InputField label="Level" icon={Layers} id="level" type="text" placeholder="200" error={errors.level} />
          </div>
        )}

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 text-gray-400" size={16} />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-[14px] py-3.5 pl-10 pr-12 outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 text-[0.9rem] transition-all shadow-sm font-medium`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{String(errors.password?.message)}</p>}
        </div>

        {!isLogin && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Confirm Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-gray-400" size={16} />
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-[14px] py-3.5 pl-10 pr-12 outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 text-[0.9rem] transition-all shadow-sm font-medium`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{String(errors.confirmPassword?.message)}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white font-bold text-[0.95rem] py-4 rounded-[14px] shadow-lg transition-transform active:scale-[0.98] mt-2 flex justify-center items-center ${
            role === 'manager' ? 'bg-[#14b8a6] shadow-[#14b8a6]/25 hover:bg-[#0d9488]' : 'bg-[#6366f1] shadow-[#6366f1]/25 hover:bg-[#4f46e5]'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        {isLogin ? (
          <p className="text-gray-500 text-sm font-medium">
            Don't have an account?{' '}
            <button onClick={() => navigate(`/signup?role=${role}`)} className="text-[#6366f1] font-bold hover:underline">
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-gray-500 text-sm font-medium">
            Already have an account?{' '}
            <button onClick={() => navigate(`/login?role=${role}`)} className="text-[#6366f1] font-bold hover:underline">
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
