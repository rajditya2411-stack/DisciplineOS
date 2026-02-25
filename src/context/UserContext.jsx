import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'discipline-tracker-user';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        return { name: data.name ?? 'Your Name' };
      }
    } catch (_) {}
    return { name: 'Your Name' };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (_) {}
  }, [user]);

  const setName = (name) => setUser((prev) => ({ ...prev, name: name?.trim() || 'Your Name' }));

  const initials = (user.name || 'Your Name')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'YN';

  return (
    <UserContext.Provider value={{ user, setName, initials }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
