import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { ChevronLeft, Save, User, Phone, BookOpen, Layers } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

import { PageHeader } from '../components/layout/PageHeader';

export const EditProfile: React.FC = () => {
  const { user, showToast } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCompleting = searchParams.get('complete') === 'true';
  const role = user?.user_metadata?.account_type || 'student';

  const [isLoading, setIsLoading] = useState(false);

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
  let initialFirstName = user?.user_metadata?.first_name || '';
  let initialLastName = user?.user_metadata?.last_name || '';

  if (!initialFirstName && user?.user_metadata?.full_name) {
    const parts = user.user_metadata.full_name.split(' ');
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
      phone: user?.user_metadata?.phone || '',
      university: user?.user_metadata?.university || '',
      level: user?.user_metadata?.level || '',
    }
  });

  useEffect(() => {
    // If the component mounts and we didn't have user initially, we update form when user loads
    if (user) {
      if (!initialFirstName && user.user_metadata?.full_name) {
        const parts = user.user_metadata.full_name.split(' ');
        setValue('firstName', parts[0]);
        setValue('lastName', parts.slice(1).join(' '));
      } else {
        if (user.user_metadata?.first_name) setValue('firstName', user.user_metadata.first_name);
        if (user.user_metadata?.last_name) setValue('lastName', user.user_metadata.last_name);
      }
      if (user.user_metadata?.phone) setValue('phone', user.user_metadata.phone);
      if (user.user_metadata?.university) setValue('university', user.user_metadata.university);
      if (user.user_metadata?.level) setValue('level', user.user_metadata.level);
    }
  }, [user, setValue, initialFirstName]);

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
      };

      // 1. Update auth.users metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: updates
      });

      if (authError) throw authError;

      // 2. Try to update public.profiles if exists (fire-and-forget for now, but better to await)
      await supabase.from('profiles').update(updates).eq('id', user.id);

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
          title={isCompleting ? 'Complete Profile' : 'Personal Info'}
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
    </div>
  );
};
