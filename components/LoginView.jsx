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
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-viewEnter">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 animate-fadeSlideUp">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
            <Dumbbell className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="font-display text-3xl text-zinc-100 tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            {isSignUp ? 'Start tracking your progress' : 'Sign in to continue'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="animate-fadeSlideUp" style={{ animationDelay: '50ms' }}>
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-base text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-blue-500/50 transition"
              />
            </div>
          )}

          <div className="animate-fadeSlideUp" style={{ animationDelay: isSignUp ? '100ms' : '50ms' }}>
            <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
              className="w-full bg-zinc-900 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-base text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-blue-500/50 transition"
            />
          </div>

          <div className="animate-fadeSlideUp" style={{ animationDelay: isSignUp ? '150ms' : '100ms' }}>
            <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-xl px-4 py-3.5 pr-12 text-base text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-blue-500/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 active:text-zinc-300 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="animate-fadeSlideUp" style={{ animationDelay: '200ms' }}>
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2 block">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full bg-zinc-900 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-base text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-blue-500/50 transition"
              />
            </div>
          )}

          {/* Remember me */}
          <div className="animate-fadeSlideUp flex items-center gap-3 pt-1" style={{ animationDelay: isSignUp ? '250ms' : '150ms' }}>
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                rememberMe ? 'bg-blue-500 border-blue-500' : 'border-zinc-600 bg-transparent'
              }`}
            >
              {rememberMe && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-sm text-zinc-400">Remember me</span>
          </div>

          {/* Error */}
          {error && (
            <div className="animate-fadeSlideUp text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="animate-fadeSlideUp pt-2" style={{ animationDelay: isSignUp ? '300ms' : '200ms' }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white font-semibold text-base py-4 rounded-2xl active:bg-blue-600 transition active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
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
        <div className="mt-8 text-center animate-fadeSlideUp" style={{ animationDelay: isSignUp ? '350ms' : '250ms' }}>
          <button onClick={toggle} className="text-sm text-zinc-500 active:text-zinc-300 transition py-2 px-4">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span className="text-blue-400 font-medium">{isSignUp ? 'Sign in' : 'Sign up'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
