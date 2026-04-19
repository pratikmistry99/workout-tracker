import { useState, useCallback } from 'react';

const ACCOUNTS_KEY = 'workout-accounts-v1';
const SESSION_KEY = 'workout-session-v1';
const SESSION_FLAG = 'workout-session-active';

async function hashPassword(plain) {
  const data = new TextEncoder().encode(plain);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session.rememberMe && !sessionStorage.getItem(SESSION_FLAG)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function saveSession(userId, rememberMe) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId, rememberMe }));
  if (!rememberMe) {
    sessionStorage.setItem(SESSION_FLAG, '1');
  }
}

function migrateOldData(userId) {
  const oldData = localStorage.getItem('workout-data-v1');
  if (oldData) {
    localStorage.setItem(`workout-data-v1-${userId}`, oldData);
    localStorage.setItem('workout-data-v1-migrated', oldData);
    localStorage.removeItem('workout-data-v1');
  }
  const oldCustoms = localStorage.getItem('workout-customizations-v1');
  if (oldCustoms) {
    localStorage.setItem(`workout-customizations-v1-${userId}`, oldCustoms);
    localStorage.removeItem('workout-customizations-v1');
  }
}

function resolveUser() {
  const session = getSession();
  if (!session) return null;
  const accounts = getAccounts();
  const account = accounts.find((a) => a.userId === session.userId);
  if (!account) return null;
  return { userId: account.userId, name: account.name, username: account.username };
}

export function useAuth() {
  const [user, setUser] = useState(resolveUser);

  const signup = useCallback(async (name, username, password, rememberMe) => {
    const trimName = name.trim();
    const trimUser = username.trim().toLowerCase();

    if (!trimName) return { error: 'Name is required' };
    if (!trimUser) return { error: 'Username is required' };
    if (trimUser.length < 3) return { error: 'Username must be at least 3 characters' };
    if (password.length < 4) return { error: 'Password must be at least 4 characters' };

    const accounts = getAccounts();
    if (accounts.some((a) => a.username === trimUser)) {
      return { error: 'Username already taken' };
    }

    const userId = 'u_' + crypto.randomUUID().slice(0, 12);
    const passwordHash = await hashPassword(password);

    const account = {
      userId,
      name: trimName,
      username: trimUser,
      passwordHash,
      createdAt: Date.now(),
    };

    saveAccounts([...accounts, account]);
    saveSession(userId, rememberMe);
    migrateOldData(userId);
    setUser({ userId, name: trimName, username: trimUser });
    return { ok: true };
  }, []);

  const login = useCallback(async (username, password, rememberMe) => {
    const trimUser = username.trim().toLowerCase();
    if (!trimUser || !password) return { error: 'All fields are required' };

    const accounts = getAccounts();
    const account = accounts.find((a) => a.username === trimUser);
    if (!account) return { error: 'Invalid username or password' };

    const hash = await hashPassword(password);
    if (hash !== account.passwordHash) return { error: 'Invalid username or password' };

    saveSession(account.userId, rememberMe);
    if (!rememberMe) sessionStorage.setItem(SESSION_FLAG, '1');
    setUser({ userId: account.userId, name: account.name, username: account.username });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_FLAG);
    setUser(null);
  }, []);

  return { user, login, signup, logout };
}
