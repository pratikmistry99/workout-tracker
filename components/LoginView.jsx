import React, { useState } from 'react';
import { Dumbbell, Eye, EyeOff } from 'lucide-react';

export function LoginView({ onLogin, onSignup }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      if (password !== confirm) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      const res = await onSignup(name, username, password, rememberMe);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      }
    } else {
      const res = await onLogin(username, password, rememberMe);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      }
    }
  };

  const toggle = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setName('');
    setPassword('');
    setConfirm('');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-5">
      <div className="w-full max-w-sm animate-viewEnter">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 animate-fadeSlideUp">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/60 flex items-center justify-center border border-zinc-700/30 mb-4">
            <Dumbbell className="w-7 h-7 text-zinc-100" />
          </div>
          <h1 className="font-display text-3xl text-zinc-100 tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-zinc-600 mt-1.5 uppercase tracking-widest">
            {isSignUp ? 'Start tracking your progress' : 'Sign in to continue'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div className="animate-fadeSlideUp" style={{ animationDelay: '50ms' }}>
              <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium mb-1.5 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition"
              />
            </div>
          )}

          <div className="animate-fadeSlideUp" style={{ animationDelay: isSignUp ? '100ms' : '50ms' }}>
            <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium mb-1.5 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition"
            />
          </div>

          <div className="animate-fadeSlideUp" style={{ animationDelay: isSignUp ? '150ms' : '100ms' }}>
            <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 active:text-zinc-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="animate-fadeSlideUp" style={{ animationDelay: '200ms' }}>
              <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium mb-1.5 block">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-zinc-600 transition"
              />
            </div>
          )}

          {/* Remember me */}
          <div className="animate-fadeSlideUp flex items-center gap-2 pt-1" style={{ animationDelay: isSignUp ? '250ms' : '150ms' }}>
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                rememberMe ? 'bg-zinc-100 border-zinc-100' : 'border-zinc-700 bg-transparent'
              }`}
            >
              {rememberMe && (
                <svg className="w-2.5 h-2.5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-xs text-zinc-500">Remember me</span>
          </div>

          {/* Error */}
          {error && (
            <div className="animate-fadeSlideUp text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="animate-fadeSlideUp pt-2" style={{ animationDelay: isSignUp ? '300ms' : '200ms' }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-100 text-zinc-900 font-medium text-sm py-3 rounded-lg active:bg-zinc-300 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  {isSignUp ? 'Creating...' : 'Signing in...'}
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center animate-fadeSlideUp" style={{ animationDelay: isSignUp ? '350ms' : '250ms' }}>
          <button onClick={toggle} className="text-xs text-zinc-600 active:text-zinc-400 transition">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span className="text-zinc-400 font-medium">{isSignUp ? 'Sign in' : 'Sign up'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
