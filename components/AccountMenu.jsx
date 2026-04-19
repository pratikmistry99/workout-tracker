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
        className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-xs font-medium text-zinc-300 active:bg-zinc-700 transition"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl shadow-black/40 overflow-hidden animate-scaleIn origin-top-right z-40">
          <div className="px-3.5 py-3 border-b border-zinc-800/50">
            <div className="text-sm font-medium text-zinc-200">{user.name}</div>
            <div className="text-[10px] text-zinc-600 font-mono mt-0.5">@{user.username}</div>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-zinc-500 active:text-red-400 active:bg-zinc-800/50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
