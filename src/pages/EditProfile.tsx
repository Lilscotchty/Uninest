import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { ChevronLeft, Save, User, Phone, BookOpen, Layers, Camera, Image, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { PhotoModal } from '../components/profile/PhotoModal';

export const EditProfile: React.FC = () => {
  const { user, profile, refreshProfile, showToast } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCompleting = searchParams.get('complete') === 'true';
  const role = user?.user_metadata?.account_type || profile?.role || 'student';

  const [isLoading, setIsLoading] = useState(false);
  const [photoModalState, setPhotoModalState] = useState<{
    isOpen: boolean;
    type: 'avatar' | 'cover';
  }>({
    isOpen: false,
    type: 'avatar',
  });

  const [coverUrl, setCoverUrl] = useState<string>(
    profile?.cover_url || user?.user_metadata?.cover_url || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
  );
  const [avatarUrl, setAvatarUrl] = useState<string>(
    profile?.avatar_url || user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  );

  // Extend basic schema based on role
  const baseSchema = z.object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    phone: z.string().min(6, { message: "Valid phone number is required" }),
  });

  const studentSchema = baseSchema.extend({
    university: z.string().min(2, { message: "University is required" }),
    level: z.string().min(1, { message: "Level is required" }),
  });

  const schema = role === 'manager' ? baseSchema : studentSchema;
  type FormValues = z.infer<typeof schema>;

  // Initialize names correctly (Google auth puts full_name and sometimes first/last name)
  let initialFirstName = profile?.first_name || user?.user_metadata?.first_name || '';
  let initialLastName = profile?.last_name || user?.user_metadata?.last_name || '';

  if (!initialFirstName && (profile?.full_name || user?.user_metadata?.full_name)) {
    const rawFullName = profile?.full_name || user?.user_metadata?.full_name;
    const parts = rawFullName.split(' ');
    initialFirstName = parts[0];
    initialLastName = parts.slice(1).join(' ');
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      phone: profile?.phone || user?.user_metadata?.phone || '',
      university: profile?.university || user?.user_metadata?.university || '',
      level: user?.user_metadata?.level || '',
    }
  });

  useEffect(() => {
    // Sync when user/profile loads
    if (profile || user) {
      if (!initialFirstName && (profile?.full_name || user?.user_metadata?.full_name)) {
        const rawFullName = profile?.full_name || user?.user_metadata?.full_name;
        const parts = rawFullName.split(' ');
        setValue('firstName', parts[0]);
        setValue('lastName', parts.slice(1).join(' '));
      } else {
        if (profile?.first_name || user?.user_metadata?.first_name) {
          setValue('firstName', profile?.first_name || user?.user_metadata?.first_name);
        }
        if (profile?.last_name || user?.user_metadata?.last_name) {
          setValue('lastName', profile?.last_name || user?.user_metadata?.last_name);
        }
      }
      if (profile?.phone || user?.user_metadata?.phone) {
        setValue('phone', profile?.phone || user?.user_metadata?.phone);
      }
      if (profile?.university || user?.user_metadata?.university) {
        setValue('university', profile?.university || user?.user_metadata?.university);
      }
      if (user?.user_metadata?.level) {
        setValue('level', user.user_metadata.level);
      }

      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
      else if (user?.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);

      if (profile?.cover_url) setCoverUrl(profile.cover_url);
      else if (user?.user_metadata?.cover_url) setCoverUrl(user.user_metadata.cover_url);
    }
  }, [user, profile, setValue, initialFirstName]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const updates = {
        first_name: data.firstName,
        last_name: data.lastName,
        full_name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        university: data.university,
        level: data.level,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
        updated_at: new Date().toISOString(),
      };

      // 1. Update auth.users metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: updates
      });

      if (authError) throw authError;

      // 2. Try to update public.profiles if exists
      if (user?.id) {
        await supabase.from('profiles').update(updates).eq('id', user.id);
      }

      // 3. Refresh context state
      if (refreshProfile) {
        await refreshProfile();
      }

      toast.success(isCompleting ? "Profile completed!" : "Profile updated successfully!");
      showToast(isCompleting ? "Profile completed!" : "Profile updated successfully!");
      
      if (isCompleting) {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate(-1); // Go back
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
      showToast(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, icon: Icon, id, type: inputType, placeholder, error }: any) => (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      <label htmlFor={id} className="text-[0.7rem] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon className="absolute left-3.5 text-[var(--color-text-disabled)]" size={16} />
        <input
          {...register(id)}
          type={inputType}
          id={id}
          placeholder={placeholder}
          className={`w-full bg-card-bg border ${error ? 'border-red-500' : 'border-transparent'} rounded-[14px] py-3.5 pl-10 pr-4 outline-none focus:border-[var(--color-accent)]-500 focus:ring-[3px] focus:ring-[var(--color-accent)]/10 text-[0.9rem] transition-all shadow-sm font-medium`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error.message}</p>}
    </div>
  );

  return (
    <div className="w-full flex flex-col bg-app-bg font-sans relative animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-xl mx-auto w-full flex flex-col flex-1">
        <PageHeader 
          title={isCompleting ? 'Complete Profile' : 'Edit Profile'}
          showBackButton={!isCompleting}
          onBack={() => navigate(-1)}
        />

        <div className="px-5 pb-8">
          {isCompleting && (
            <div className="bg-[var(--color-accent)]/10 p-4 rounded-xl mb-6 border border-[var(--color-accent)]/20">
              <p className="text-sm text-[var(--color-accent)] font-medium">
                We need a little more information to set up your {role} account properly before you can continue.
              </p>
            </div>
          )}

          {/* Photos Header Card */}
          <div className="bg-card-bg rounded-2xl shadow-sm border border-border-subtle overflow-hidden mb-6">
            {/* Cover Banner */}
            <div className="h-32 w-full relative bg-slate-200 group">
              <img 
                src={coverUrl} 
                alt="Cover Preview" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30"></div>
              <button 
                type="button"
                onClick={() => setPhotoModalState({ isOpen: true, type: 'cover' })}
                className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center gap-1.5 text-white transition-all shadow-md active:scale-95"
              >
                <Camera size={13} className="stroke-[2.5]" />
                <span className="text-[11px] font-bold">Change Cover</span>
              </button>
            </div>

            {/* Avatar section */}
            <div className="px-5 pb-4 pt-1 flex items-end justify-between">
              <div className="relative -mt-12 flex items-end gap-3">
                <div 
                  onClick={() => setPhotoModalState({ isOpen: true, type: 'avatar' })}
                  className="w-20 h-20 rounded-full border-4 border-card-bg overflow-hidden relative shadow-md bg-[var(--color-button)]/10 cursor-pointer group"
                >
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={18} className="text-white drop-shadow" />
                  </div>
                </div>

                <div className="mb-1">
                  <button
                    type="button"
                    onClick={() => setPhotoModalState({ isOpen: true, type: 'avatar' })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-button)] hover:underline"
                  >
                    <Camera size={13} />
                    <span>Change Profile Photo</span>
                  </button>
                  <p className="text-[11px] text-text-muted mt-0.5">Click photo or cover to update</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
            <div className="grid grid-cols-2 gap-3">
              <InputField label="First Name" icon={User} id="firstName" type="text" placeholder="First name" error={errors.firstName} />
              <InputField label="Last Name" icon={User} id="lastName" type="text" placeholder="Last name" error={errors.lastName} />
            </div>

            <InputField label="Phone / WhatsApp" icon={Phone} id="phone" type="tel" placeholder="+233 50 123 4567" error={errors.phone} />

            {role === 'student' && (
              <div className="flex flex-col gap-4">
                <InputField label="University" icon={BookOpen} id="university" type="text" placeholder="e.g. KNUST, UG" error={errors.university} />
                <InputField label="Level" icon={Layers} id="level" type="text" placeholder="e.g. 200, 300" error={errors.level} />
              </div>
            )}

            <div className="mt-6 mb-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-bold text-[0.95rem] py-4 rounded-[14px] shadow-lg transition-transform active:scale-[0.98] flex justify-center items-center gap-2 ${
                  role === 'manager' ? 'bg-teal shadow-teal/25 hover:bg-[var(--color-button)]' : 'bg-[var(--color-button)] shadow-indigo/25 hover:bg-[var(--color-button-hover)]'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    {isCompleting ? 'Save & Continue' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interactive Photo Upload / Presets Modal */}
      {user && (
        <PhotoModal
          isOpen={photoModalState.isOpen}
          onClose={() => setPhotoModalState((prev) => ({ ...prev, isOpen: false }))}
          userId={user.id}
          type={photoModalState.type}
          currentUrl={photoModalState.type === 'avatar' ? avatarUrl : coverUrl}
          onSuccess={async (newUrl) => {
            if (photoModalState.type === 'avatar') {
              setAvatarUrl(newUrl);
            } else {
              setCoverUrl(newUrl);
            }
            if (refreshProfile) {
              await refreshProfile();
            }
          }}
        />
      )}
    </div>
  );
};

