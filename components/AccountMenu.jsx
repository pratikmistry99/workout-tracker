import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';

export function AccountMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  const initial = (user.name || '?')[0].toUpperCase();

  return (
    <div className="relative z-30" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-semibold text-blue-400 active:bg-blue-500/20 transition"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-52 bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-scaleIn origin-top-right z-40">
          <div className="px-4 py-3.5 border-b border-zinc-800/50">
            <div className="text-sm font-semibold text-zinc-100">{user.name}</div>
            <div className="text-xs text-zinc-500 font-mono mt-0.5">@{user.username}</div>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-3.5 text-sm text-zinc-400 active:text-red-400 active:bg-zinc-800/50 transition"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
