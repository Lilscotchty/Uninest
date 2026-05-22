import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { Building, ChevronLeft } from 'lucide-react';

const customCSS = `
@keyframes drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(15px, -15px) scale(1.05); }
  66% { transform: translate(-10px, 15px) scale(0.95); }
}
.animate-drift { animation: drift 10s ease-in-out infinite; }
`;

export const SignUp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Check if we are on the login page or signup page
  const isLogin = location.pathname === '/login';
  
  // Read query params for visual identity
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role') || 'student';
  const isStudent = role === 'student';

  return (
    <div className="w-full h-full bg-app-bg flex flex-col font-sans relative overflow-x-hidden hide-scrollbar">
      <style>{customCSS}</style>
      
      {/* Hero Header */}
      <div 
        className="relative h-[240px] shrink-0 overflow-hidden transition-all duration-700 pb-8 px-6 pt-10"
        style={{ 
          background: isStudent 
            ? 'linear-gradient(155deg,#1e1b4b 0%,#3730a3 55%,#4f46e5 100%)' 
            : 'linear-gradient(155deg,#0f2620 0%,#0d9488 55%,#14b8a6 100%)' 
        }}
      >
        {/* Animated Orbs */}
        <div className={`absolute w-[200px] h-[200px] rounded-full blur-[44px] opacity-30 -top-[60px] -left-[40px] mix-blend-screen animate-drift ${isStudent ? 'bg-[#818cf8]' : 'bg-[#38bdf8]'}`}></div>
        <div className="absolute w-[150px] h-[150px] rounded-full bg-amber-glow blur-[44px] opacity-20 top-[40px] -right-[40px] mix-blend-screen animate-drift" style={{ animationDelay: '-3s' }}></div>

        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px]"></div>

        {/* Curved bottom edge */}
        <div className="absolute -bottom-1 left-0 right-0 h-[40px] bg-app-bg rounded-t-full rounded-b-none scale-x-110"></div>

        <div className="relative z-10 flex flex-col h-full">
          <button onClick={() => navigate(isLogin ? `/signup?role=${role}` : `/login?role=${role}`)} className="self-start flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-[0.8rem] font-semibold mb-3">
            <ChevronLeft size={14} /> {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
          
          <div className="flex items-center gap-2 mb-2">
             <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
               <Building size={14} className="text-amber-glow" />
             </div>
             <span className="font-fraunces text-white/70 text-[0.65rem] uppercase tracking-[0.2em] font-medium">UNINEST</span>
          </div>

          <h1 className="font-fraunces text-white text-[1.4rem] leading-[1.1] font-bold">
            {isLogin ? (
               <>Welcome<br/><em className="text-amber-glow font-light italic">back.</em></>
            ) : (
               isStudent ? <>Join the<br/><em className="text-amber-glow font-light italic">community.</em></> : <>List with<br/><em className="text-amber-glow font-light italic">confidence.</em></>
            )}
          </h1>
        </div>
      </div>

      <div className="flex-1 -mt-4 px-5 pb-20 relative z-20 flex flex-col overflow-y-auto hide-scrollbar">
        {/* Toggle between student and manager if on signup */}
        {!isLogin && (
          <div className="flex justify-center items-center gap-2 mb-4">
            <button 
              onClick={() => navigate('/signup?role=student', { replace: true })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors border ${isStudent ? 'bg-indigo/10 border-indigo text-indigo' : 'bg-transparent border-gray-200 text-gray-500'}`}
            >
              Sign up as Student
            </button>
            <button 
              onClick={() => navigate('/signup?role=manager', { replace: true })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors border ${!isStudent ? 'bg-teal/10 border-teal text-teal' : 'bg-transparent border-gray-200 text-gray-500'}`}
            >
              Sign up as Manager
            </button>
          </div>
        )}

        <AuthForm type={isLogin ? 'login' : 'signup'} />
      </div>
    </div>
  );
};

