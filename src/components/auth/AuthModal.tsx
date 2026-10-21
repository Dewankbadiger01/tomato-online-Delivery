import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, CheckCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    loginUser,
    signupUser,
    setCurrentView
  } = useFoodDelivery();

  // Login form state
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('9845231092');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('4281');
  const [email, setEmail] = useState('dewankbadiger@gmail.com');
  const [password, setPassword] = useState('tomato123');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Admin state
  const [adminEmail, setAdminEmail] = useState('admin@tomato.in');
  const [adminPin, setAdminPin] = useState('8421');
  const [adminError, setAdminError] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'phone') {
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
      loginUser('customer', `+91 ${phone}`);
    } else {
      loginUser('customer', email);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPhone.trim()) return;
    signupUser(signupName, signupEmail, signupPhone);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '8421' || adminPin.length >= 4) {
      loginUser('admin', adminEmail);
      setCurrentView('restaurant_admin');
    } else {
      setAdminError('Invalid security PIN. Default is 8421');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {authModalTab === 'signup'
                ? 'Sign up'
                : authModalTab === 'admin'
                ? 'Admin & Partner Login'
                : 'Log in'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {authModalTab === 'signup'
                ? 'Create a new account on Tomato'
                : authModalTab === 'admin'
                ? 'Restricted kitchen management console'
                : 'Welcome back to Tomato'}
            </p>
          </div>
          <button
            onClick={() => {
              setAuthModalOpen(false);
              setOtpSent(false);
              setAdminError('');
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================
            TAB 1: LOG IN VIEW
        ======================================================== */}
        {authModalTab === 'login' && (
          <div className="p-6 space-y-5 text-xs">
            {/* Toggle Phone vs Email Login */}
            <div className="flex border-b border-slate-200 pb-1 gap-4 font-semibold text-xs">
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`pb-2 border-b-2 transition-colors ${
                  loginMethod === 'phone'
                    ? 'border-[#E23744] text-[#E23744]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Mobile Number (OTP)
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`pb-2 border-b-2 transition-colors ${
                  loginMethod === 'email'
                    ? 'border-[#E23744] text-[#E23744]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Email & Password
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginMethod === 'phone' ? (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        disabled={otpSent}
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744] font-mono text-sm"
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2 pt-1 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-700 font-bold">One Time Password (OTP)</label>
                        <span className="text-[11px] text-emerald-600 font-semibold">Demo OTP: 4281</span>
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        className="w-full text-center tracking-[0.6em] text-lg font-mono font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744]"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#E23744] hover:bg-[#d02c38] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <span>{otpSent ? 'Verify OTP & Log in' : 'Send One Time Password'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#E23744] hover:bg-[#d02c38] text-white font-bold text-sm rounded-xl shadow-xs transition-colors active:scale-[0.99]"
                  >
                    Log in
                  </button>
                </>
              )}
            </form>

            {/* Google Sign In Option */}
            <div className="relative text-center my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-2 text-slate-400 font-medium text-[11px]">
                or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={() => loginUser('customer', 'dewankbadiger628@gmail.com')}
              className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Switch to Sign up */}
            <div className="pt-2 text-center text-xs text-slate-500">
              New to Tomato?{' '}
              <button
                type="button"
                onClick={() => setAuthModalTab('signup')}
                className="text-[#E23744] font-bold hover:underline"
              >
                Create account
              </button>
            </div>

            {/* Admin Switcher */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Restaurant Partner?</span>
              <button
                type="button"
                onClick={() => setAuthModalTab('admin')}
                className="text-slate-600 font-semibold hover:text-slate-900"
              >
                Partner / Admin Login →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: SIGN UP VIEW
        ======================================================== */}
        {authModalTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744] font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <input
                type="password"
                required
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E23744]"
              />
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 pt-1 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#E23744] focus:ring-[#E23744]"
              />
              <span className="text-[11px] leading-tight">
                I agree to Tomato's <span className="text-[#E23744] underline">Terms of Service</span>, <span className="text-[#E23744] underline">Privacy Policy</span> and Content Policies.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-[#E23744] hover:bg-[#d02c38] text-white font-bold text-sm rounded-xl shadow-xs transition-colors active:scale-[0.99]"
            >
              Create account
            </button>

            {/* Quick Demo Autofill */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setSignupName('Aarav Mehta');
                  setSignupEmail('aarav.mehta@example.com');
                  setSignupPhone('9820123456');
                  setSignupPassword('pass123');
                }}
                className="text-[11px] text-rose-600 font-semibold hover:underline"
              >
                ⚡ Autofill Sample Details
              </button>
            </div>

            {/* Switch to Log in */}
            <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className="text-[#E23744] font-bold hover:underline"
              >
                Log in
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            TAB 3: ADMIN & PARTNER PORTAL VIEW
        ======================================================== */}
        {authModalTab === 'admin' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-rose-600" />
                <span>Privileged Kitchen & Admin Console</span>
              </div>
              <p>Authorize to manage menus, dispatch delivery couriers, and view live order queues.</p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Security PIN</label>
                <input
                  type="password"
                  required
                  value={adminPin}
                  onChange={e => setAdminPin(e.target.value)}
                  placeholder="PIN: 8421"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                />
              </div>

              {adminError && (
                <p className="text-[11px] text-rose-600 font-medium">{adminError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login to Admin Dashboard</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Quick Testing:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginUser('admin');
                    setCurrentView('restaurant_admin');
                  }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  ⚡ Admin
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    loginUser('partner', 'partner@meghanafoods.in');
                    setCurrentView('restaurant_admin');
                  }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  ⚡ Chef Sameer Besin
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ← Back to Customer Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
