import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ecostep_token'));
  const [loading, setLoading] = useState(true);

  // Decode a JWT payload (simple base64 decode, no verification)
  const decodeToken = (jwt) => {
    try {
      const payload = jwt.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  // Fetch user profile from API
  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/profile');
      setUser(res.data);
    } catch (err) {
      // If profile fetch fails, try decoding from token
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          setUser({
            id: decoded.id || decoded.userId,
            name: decoded.name || 'User',
            email: decoded.email || '',
          });
        }
      }
    }
  }, [token]);

  // On mount: check if token exists and load user
  useEffect(() => {
    const init = async () => {
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          // Check if token is expired
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('ecostep_token');
            setToken(null);
            setUser(null);
            setLoading(false);
            return;
          }
          await fetchProfile();
        } else {
          localStorage.removeItem('ecostep_token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, [token, fetchProfile]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('ecostep_token', newToken);
    setToken(newToken);
    setUser(userData || decodeToken(newToken));
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('ecostep_token', newToken);
    setToken(newToken);
    setUser(userData || decodeToken(newToken));
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('ecostep_token');
    localStorage.removeItem('ecostep_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
