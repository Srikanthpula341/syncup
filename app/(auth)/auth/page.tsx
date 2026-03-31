'use client';

import React, { useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setAuthError, setAuthLoading } from '@/app/store/slices/authSlice';
import Image from 'next/image';
import { Mail, ShieldCheck } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { ROUTES } from '@/app/lib/route-constants';

const AuthPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(ROUTES.CHAT);
    }
  }, [status, router]);

  const handleGoogleLogin = async () => {
    dispatch(setAuthLoading());
    try {
      await signInWithPopup(auth, googleProvider);
      router.push(ROUTES.CHAT);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in with Google';
      dispatch(setAuthError(errorMessage));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4EDE4] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4A154B]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4A154B]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-12 relative z-10 border border-white/20 backdrop-blur-sm transition-all duration-300">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-[#4A154B] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#4A154B]/20 overflow-hidden" />
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2">
            SyncUp
          </h1>
          <p className="text-zinc-500 font-medium max-w-[280px]">
            Real-time collaboration for the modern workspace.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={status === 'loading'}
            className={cn(
              "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-zinc-100 bg-white hover:border-[#4A154B]/30 hover:bg-zinc-50 transition-all duration-200 active:scale-[0.98]",
              status === 'loading' && "opacity-70 cursor-not-allowed"
            )}
          >
            <div className="w-6 h-6 relative shrink-0">
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                fill
                priority
                sizes="24px"
                className="object-contain"
              />
            </div>
            <span className="font-bold text-zinc-700">
              {status === 'loading' ? 'Signing in...' : 'Continue with Google'}
            </span>

            {status === 'loading' && (
              <div className="absolute right-6 w-4 h-4 border-2 border-zinc-200 border-t-[#4A154B] rounded-full animate-spin" />
            )}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-zinc-400 font-semibold tracking-widest">
                or
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AuthSocialButton icon={<Mail size={20} />} label="Email" />
            <AuthSocialButton icon={<ShieldCheck size={20} />} label="SSO" />
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center shadow-sm transition-all duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 shrink-0" />
            {error}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-zinc-400 font-medium">
          By continuing, you agree to SyncUp&apos;s <br />
          <span className="underline cursor-pointer hover:text-zinc-600">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline cursor-pointer hover:text-zinc-600">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
};

const AuthSocialButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-all duration-200 active:scale-[0.98] text-zinc-600 hover:text-zinc-900">
    {icon}
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export default AuthPage;