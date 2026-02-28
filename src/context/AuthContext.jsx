import { createContext, useState, useMemo } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true" && !!user
  );

  const getStoredUsers = () => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  };

  const setStoredUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const login = (credentials) => {
    const users = getStoredUsers();
    const match = users.find(
      (entry) =>
        entry.email === credentials.email &&
        entry.password === credentials.password
    );

    if (!match) {
      return { ok: false, message: "Invalid email or password" };
    }

    const nextUser = { name: match.name, email: match.email };
    setUser(nextUser);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(nextUser));
    return { ok: true };
  };

  const signup = (userData) => {
    const users = getStoredUsers();
    const exists = users.some((entry) => entry.email === userData.email);

    if (exists) {
      return { ok: false, message: "Email already registered" };
    }

    const nextUsers = [...users, userData];
    setStoredUsers(nextUsers);

    const nextUser = { name: userData.name, email: userData.email };
    setUser(nextUser);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(nextUser));
    return { ok: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  };

  
  const value = useMemo(() => ({
    isLoggedIn,
    user,
    login,
    signup,
    logout,
  }), [isLoggedIn, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
