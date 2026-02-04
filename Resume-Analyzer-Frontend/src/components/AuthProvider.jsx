// src/components/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

let authInstance = null;

function safeInitFirebase() {
  try {
    const cfg = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    if (!cfg.apiKey || !cfg.authDomain || !cfg.projectId || !cfg.appId) {
      console.warn('Firebase env missing; running in unauthenticated mode.');
      return null;
    }
    
    console.log("Firebase Config:", cfg);
    
    const app = initializeApp(cfg);
    return getAuth(app);
  } catch (e) {
    console.error('Firebase init failed:', e);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authInstance) authInstance = safeInitFirebase();

    if (!authInstance) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(
      authInstance,
      (u) => { setUser(u ?? null); setLoading(false); },
      (err) => { console.error('Auth observer error:', err); setUser(null); setLoading(false); }
    );
    return () => { if (unsub) unsub(); };
  }, []);

  const logout = async () => {
    if (authInstance) await signOut(authInstance);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, auth: authInstance, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-pulse text-gray-500">Loading…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};
