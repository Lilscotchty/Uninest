import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Building, GraduationCap, ChevronLeft, User, Mail, Phone, 
  Lock, Eye, EyeOff, Check, Shield, School, MapPin, AlignLeft, 
  Images, Plus, Trash2, ShieldCheck, ChartLine, MessageCircle, AlertCircle
} from 'lucide-react';
import { LocationInput } from '../components/LocationInput';
import { LocationData } from '../hooks/useLocationVerification';

const customCSS = `
@keyframes drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(15px, -15px) scale(1.05); }
  66% { transform: translate(-10px, 15px) scale(0.95); }
}
.animate-drift { animation: drift 10s ease-in-out infinite; }
`;

type Role = 'student' | 'manager';

export const SignUp: React.FC = () => {
  const { setCurrentView, showToast } = useAppContext();
  
  const [role, setRole] = useState<Role>('student');
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Student
    university: '',
    level: '',
    // Manager
    hostelName: '',
    distance: '',
    description: '',
    digitalAddress: '',
    // Password
    password: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState(false);
  
  // Specific states for Manager
  const [locationVerified, setLocationVerified] = useState<LocationData | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  type RoomType = { id: string; type: string; price: string; quantity: string; occupants: string };
  const [rooms, setRooms] = useState<RoomType[]>([
    { id: '1', type: 'Single', price: '', quantity: '', occupants: '1' }
  ]);

  const AMENITIES_LIST = [
    'Wi-Fi', 'Air Conditioning', '24/7 Security', 'Laundry Room',
    'Backup Generator', 'Study Lounge', 'Water 24/7', 'Cafeteria'
  ];

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const addRoom = () => setRooms([...rooms, { id: Math.random().toString(), type: 'Single', price: '', quantity: '', occupants: '1' }]);
  const removeRoom = (id: string) => setRooms(rooms.filter(r => r.id !== id));
  const updateRoom = (id: string, field: keyof RoomType, value: string) => setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));

  const validateStep = () => {
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        showToast('Please fill all personal details');
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        showToast('Invalid email format');
        return false;
      }
    }
    if (step === 3) {
      if (role === 'student' && (!formData.university || !formData.level)) {
        showToast('Please select your institution and level');
        return false;
      }
      if (role === 'manager') {
        if (!locationVerified) {
          showToast('Please verify your digital address location');
          return false;
        }
        if (!formData.hostelName || !formData.distance || !formData.description) {
          showToast('Please fill all property details');
          return false;
        }
        if (rooms.length === 0 || !rooms[0].price) {
          showToast('Please configure at least one room type with a price');
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(4, s + 1));
  };

  const handleSubmit = () => {
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    setIsSuccess(true);
  };

  const renderInput = (label: string, icon: any, field: keyof typeof formData, type="text", placeholder="") => {
    const Icon = icon;
    return (
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative flex items-center">
          <Icon className="absolute left-3.5 text-gray-400" size={16} />
          <input 
            type={type} 
            placeholder={placeholder}
            value={formData[field]}
            onChange={e => setFormData({...formData, [field]: e.target.value})}
            className="w-full bg-card-bg border border-border-subtle rounded-[14px] py-3.5 pl-10 pr-4 outline-none focus:border-indigo focus:ring-[3px] focus:ring-indigo/10 text-[0.9rem] transition-all shadow-sm font-medium"
          />
        </div>
      </div>
    );
  };

  const isStudent = role === 'student';
  const roleColor = isStudent ? 'indigo' : 'teal';

  if (isSuccess) {
    return (
      <div className="w-full h-full bg-app-bg flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 relative">
          <div className="absolute inset-[-8px] rounded-full border-2 border-green-500/20 animate-ping"></div>
          <Check className="text-green-600 w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-center text-text-primary">
          {isStudent ? 'Welcome aboard!' : 'Application Submitted!'}
        </h2>
        <p className="text-gray-500 text-[0.9rem] text-center mb-8 max-w-[280px]">
          {isStudent 
            ? 'Your Student Dwell account is ready. Start exploring hostels near your campus right now.' 
            : 'Your manager account is under review. We will verify your documents and notify you within 24 hours.'}
        </p>
        <button 
          onClick={() => setCurrentView('home')}
          className="w-full bg-green text-white font-bold text-[0.95rem] py-4 rounded-[14px] shadow-[0_6px_20px_rgba(22,163,74,0.25)] hover:bg-green-700 transition-colors"
        >
          {isStudent ? 'Go to Home' : 'Return to Home'}
        </button>
      </div>
    );
  }

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
          <button onClick={() => setCurrentView('home')} className="self-start flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-[0.8rem] font-semibold mb-3">
            <ChevronLeft size={14} /> Already have an account? Sign in
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <Building size={14} className="text-amber-glow" />
            </div>
            <span className="font-fraunces text-white/70 text-[0.65rem] uppercase tracking-[0.2em] font-medium">Student Dwell</span>
          </div>

          <h1 className="font-fraunces text-white text-[1.4rem] leading-[1.1] font-bold">
            {isStudent ? <>Join the<br/><em className="text-amber-glow font-light italic">community.</em></> : <>List with<br/><em className="text-amber-glow font-light italic">confidence.</em></>}
          </h1>
        </div>
      </div>

      {/* Progress & Form Area */}
      <div className="flex-1 -mt-4 px-5 pb-20 relative z-20 flex flex-col">
        
        {/* Dots */}
        <div className="flex justify-center items-center gap-1.5 mb-6">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-2 transition-all duration-300 rounded-full ${step === s ? (isStudent ? 'w-6 bg-indigo' : 'w-6 bg-teal') : step > s ? 'w-2 bg-gray-400' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-5">
              <h2 className="font-fraunces text-2xl font-bold text-text-primary">Who are you?</h2>
              <p className="text-gray-500 text-[0.8rem] mt-1 leading-relaxed">Choose the account type that best describes you.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => setRole('student')} className={`relative overflow-hidden p-4 rounded-[18px] flex flex-col items-center gap-2.5 transition-all text-center border-2 ${isStudent ? 'border-indigo bg-indigo/5 shadow-[0_8px_24px_rgba(55,48,163,0.12)] -translate-y-1' : 'border-transparent bg-card-bg shadow-sm border-border-subtle'}`}>
                {isStudent && <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-indigo text-white rounded-full flex items-center justify-center"><Check size={10} /></div>}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${isStudent ? 'bg-indigo text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <div className="font-fraunces font-bold text-[0.85rem] text-text-primary">I'm a Student</div>
                  <div className="text-[0.65rem] text-gray-500 mt-0.5 px-1 leading-tight">Find & book hostels near my campus</div>
                </div>
              </button>

              <button onClick={() => setRole('manager')} className={`relative overflow-hidden p-4 rounded-[18px] flex flex-col items-center gap-2.5 transition-all text-center border-2 ${!isStudent ? 'border-teal bg-teal/5 shadow-[0_8px_24px_rgba(13,148,136,0.12)] -translate-y-1' : 'border-transparent bg-card-bg shadow-sm border-border-subtle'}`}>
                {!isStudent && <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-teal text-white rounded-full flex items-center justify-center"><Check size={10} /></div>}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${!isStudent ? 'bg-teal text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                  <Building size={20} />
                </div>
                <div>
                  <div className="font-fraunces font-bold text-[0.85rem] text-text-primary">Hostel Manager</div>
                  <div className="text-[0.65rem] text-gray-500 mt-0.5 px-1 leading-tight">List & manage my properties</div>
                </div>
              </button>
            </div>

            <div className="mb-6">
              <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-2 block">What you'll unlock</span>
              <div className="flex flex-col gap-2">
                {(isStudent ? [
                  { icon: <MapPin size={14}/>, text: 'Browse verified student hostels' },
                  { icon: <Check size={14}/>, text: 'Save & compare listings' },
                  { icon: <MessageCircle size={14}/>, text: 'Chat directly with landlords' }
                ] : [
                  { icon: <Building size={14}/>, text: 'List unlimited properties with photos' },
                  { icon: <ChartLine size={14}/>, text: 'Real-time analytics and booking stats' },
                  { icon: <ShieldCheck size={14}/>, text: 'Get a Verified Landlord badge' }
                ]).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-card-bg p-3 rounded-xl border border-border-subtle shadow-sm">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isStudent ? 'bg-indigo/10 text-indigo' : 'bg-teal/10 text-teal'}`}>
                      {item.icon}
                    </div>
                    <span className="text-[0.8rem] font-medium text-text-primary">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleNext} className={`w-full py-4 rounded-[14px] text-white font-bold text-[0.95rem] shadow-lg transition-transform active:scale-[0.98] ${isStudent ? 'bg-indigo shadow-indigo/25' : 'bg-teal shadow-teal/25'}`}>
              Continue as {isStudent ? 'Student' : 'Manager'} &rarr;
            </button>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[0.8rem] font-bold text-gray-500 hover:text-text-primary mb-4 w-fit"><ChevronLeft size={16}/> Back</button>
            
            <div className="mb-5">
              <h2 className="font-fraunces text-2xl font-bold text-text-primary">Personal Details</h2>
              <p className="text-gray-500 text-[0.8rem] mt-1 leading-relaxed">Tell us a little about yourself.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {renderInput('First Name', User, 'firstName', 'text', 'Kwame')}
              {renderInput('Last Name', User, 'lastName', 'text', 'Owusu')}
            </div>
            {renderInput('Email Address', Mail, 'email', 'email', 'you@example.com')}
            {renderInput('Phone / WhatsApp', Phone, 'phone', 'tel', '+233 50 123 4567')}

            <button onClick={handleNext} className={`w-full py-4 mt-2 rounded-[14px] text-white font-bold text-[0.95rem] shadow-lg transition-transform active:scale-[0.98] ${isStudent ? 'bg-indigo shadow-indigo/25' : 'bg-teal shadow-teal/25'}`}>
              Continue &rarr;
            </button>
          </div>
        )}

        {/* Step 3: Academic / Business */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-[0.8rem] font-bold text-gray-500 hover:text-text-primary mb-4 w-fit"><ChevronLeft size={16}/> Back</button>
            
            <div className="mb-5">
              <h2 className="font-fraunces text-2xl font-bold text-text-primary">{isStudent ? 'Academic Details' : 'Property Details'}</h2>
              <p className="text-gray-500 text-[0.8rem] mt-1 leading-relaxed">{isStudent ? 'Help us show hostels near your campus.' : 'Help us verify and list your property.'}</p>
            </div>

            {isStudent ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Institution</label>
                  <div className="relative">
                    <School className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                    <select className="w-full bg-card-bg border border-border-subtle rounded-[14px] py-3.5 pl-10 pr-4 outline-none focus:border-indigo focus:ring-[3px] focus:ring-indigo/10 text-[0.9rem] font-medium appearance-none"
                      value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})}
                    >
                      <option value="">Select your university...</option>
                      <option value="UG">University of Ghana</option>
                      <option value="KNUST">KNUST</option>
                      <option value="UCC">UCC</option>
                      <option value="ATU">Accra Technical University</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Academic Level</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                    <select className="w-full bg-card-bg border border-border-subtle rounded-[14px] py-3.5 pl-10 pr-4 outline-none focus:border-indigo focus:ring-[3px] focus:ring-indigo/10 text-[0.9rem] font-medium appearance-none"
                      value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}
                    >
                      <option value="">Select level...</option>
                      <option value="100">Level 100</option>
                      <option value="200">Level 200</option>
                      <option value="300">Level 300</option>
                      <option value="400">Level 400</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Manager Property Form */}
                <div className="bg-card-bg p-4 rounded-2xl border border-border-subtle shadow-sm flex flex-col gap-3">
                  <span className="font-fraunces font-bold text-teal flex items-center gap-2"><MapPin size={16}/> Digital Location</span>
                  <LocationInput 
                    address={formData.digitalAddress}
                    setAddress={val => setFormData({...formData, digitalAddress: val})}
                    onVerifySuccess={setLocationVerified}
                  />
                </div>

                {renderInput('Hostel Name', Building, 'hostelName', 'text', 'University Village')}
                
                <div className="flex flex-col gap-1.5 mb-1">
                  <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                    <textarea 
                      placeholder="Briefly describe what makes your hostel unique..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-card-bg border border-border-subtle rounded-[14px] py-3.5 pl-10 pr-4 outline-none focus:border-teal focus:ring-[3px] focus:ring-teal/10 text-[0.9rem] font-medium resize-none h-24 leading-relaxed"
                    />
                  </div>
                </div>
                
                {renderInput('Distance to Campus', MapPin, 'distance', 'text', 'e.g. 5 min walk')}

                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_LIST.map(a => {
                      const sel = selectedAmenities.includes(a);
                      return (
                        <button key={a} onClick={() => toggleAmenity(a)} className={`px-3 py-2 border rounded-xl text-[0.75rem] font-bold transition-all ${sel ? 'bg-teal border-teal text-white' : 'bg-card-bg border-border-subtle text-gray-500'}`}>
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-center bg-app-bg p-2 rounded-lg border border-border-subtle">
                    <label className="text-[0.75rem] font-bold text-text-primary ml-1">Room Configurations</label>
                    <button onClick={addRoom} className="text-teal font-bold text-[0.75rem] flex items-center gap-1 hover:bg-teal/10 px-2 py-1 rounded"><Plus size={14}/> Add Room</button>
                  </div>
                  {rooms.map((room, i) => (
                    <div key={room.id} className="bg-card-bg border border-border-subtle rounded-xl p-3 relative flex flex-col gap-3">
                      {rooms.length > 1 && (
                        <button onClick={() => removeRoom(room.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-card-bg border border-border-subtle rounded-full text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"><Trash2 size={12}/></button>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <select className="bg-app-bg border border-border-subtle rounded-lg p-2 text-[0.8rem] outline-none font-medium appearance-none" value={room.type} onChange={e => updateRoom(room.id, 'type', e.target.value)}>
                          <option value="Single">1 in a room</option><option value="Double">2 in a room</option><option value="Triple">3 in a room</option><option value="Quad">4 in a room</option>
                        </select>
                        <input type="number" placeholder="Price/Sem (GH₵)" className="bg-app-bg border border-border-subtle rounded-lg p-2 text-[0.8rem] outline-none font-medium" value={room.price} onChange={e => updateRoom(room.id, 'price', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            <button onClick={handleNext} className={`w-full py-4 mt-6 rounded-[14px] text-white font-bold text-[0.95rem] shadow-lg transition-transform active:scale-[0.98] ${isStudent ? 'bg-indigo shadow-indigo/25' : 'bg-teal shadow-teal/25'}`}>
              Continue &rarr;
            </button>
          </div>
        )}

        {/* Step 4: Password & Review */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep(3)} className="flex items-center gap-1 text-[0.8rem] font-bold text-gray-500 hover:text-text-primary mb-4 w-fit"><ChevronLeft size={16}/> Back</button>
            
            <div className="mb-5">
              <h2 className="font-fraunces text-2xl font-bold text-text-primary">Secure your account</h2>
              <p className="text-gray-500 text-[0.8rem] mt-1 leading-relaxed">Choose a password and review details.</p>
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-gray-400" size={16} />
                <input 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-card-bg border border-border-subtle rounded-[14px] py-3.5 pl-10 pr-12 outline-none focus:border-indigo focus:ring-[3px] focus:ring-indigo/10 text-[0.9rem] transition-all shadow-sm font-medium"
                />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-4 text-gray-400 hover:text-text-primary">
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-gray-400" size={16} />
                <input 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-card-bg border border-border-subtle rounded-[14px] py-3.5 pl-10 pr-4 outline-none focus:border-indigo focus:ring-[3px] focus:ring-indigo/10 text-[0.9rem] transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            {/* Review Block */}
            <div className="bg-card-bg rounded-2xl border border-border-subtle shadow-sm overflow-hidden mb-6">
              <div className={`p-4 flex items-center gap-3 ${isStudent ? 'bg-indigo' : 'bg-teal'} text-white`}>
                <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center font-fraunces font-bold text-lg">
                  {formData.firstName?.[0] || '?'}{formData.lastName?.[0] || ''}
                </div>
                <div>
                  <div className="font-fraunces font-bold text-[1.1rem] leading-tight">{formData.firstName} {formData.lastName}</div>
                  <div className="text-[0.7rem] text-white/70 font-medium">{isStudent ? 'Student Account' : 'Manager Account'}</div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3 text-[0.8rem] font-medium text-text-primary">
                <div className="flex justify-between border-b border-border-subtle pb-2"><span className="text-gray-500">Email</span><span>{formData.email}</span></div>
                {isStudent && <div className="flex justify-between border-b border-border-subtle pb-2"><span className="text-gray-500">Institution</span><span>{formData.university}</span></div>}
                {!isStudent && <div className="flex justify-between border-b border-border-subtle pb-2"><span className="text-gray-500">Hostel</span><span>{formData.hostelName}</span></div>}
                <div className="flex justify-between items-center"><span className="text-gray-500">Status</span><span className={`flex items-center gap-1 ${isStudent ? 'text-green-600' : 'text-amber-500'}`}><Shield size={14}/> {isStudent ? 'Instant Access' : 'Requires Approval'}</span></div>
              </div>
            </div>

            <button onClick={handleSubmit} className={`w-full py-4 rounded-[14px] text-white font-bold text-[0.95rem] shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${isStudent ? 'bg-indigo shadow-indigo/25' : 'bg-teal shadow-teal/25'}`}>
              <Check size={18} /> {isStudent ? 'Create My Account' : 'Submit for Verification'}
            </button>

            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest"><Shield size={12}/> 256-bit SSL</div>
              <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest"><Lock size={12}/> Encrypted</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
