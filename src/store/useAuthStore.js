import { create } from "zustand";

const getUsersFromStorage = () => {
  try {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse users from storage");
    return [];
  }
};

const getUserFromStorage = () => {
  try {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to parse user from storage");
    return null;
  }
};

const saveUsersToStorage = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const useAuthStore = create((set) => ({
  user: getUserFromStorage(),

  login: ({ email, password }) => {
    const users = getUsersFromStorage();

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return { ok: false, message: "Invalid email or password" };
    }

    const loggedInUser = {
      name: foundUser.name,
      email: foundUser.email,
    };

    localStorage.setItem("user", JSON.stringify(loggedInUser));
    set({ user: loggedInUser });

    return { ok: true };
  },

  signup: ({ name, email, password }) => {
    const users = getUsersFromStorage();

    const alreadyExists = users.some((u) => u.email === email);

    if (alreadyExists) {
      return { ok: false, message: "Email already registered" };
    }

    const newUser = { name, email, password };
    const updatedUsers = [...users, newUser];

    saveUsersToStorage(updatedUsers);

    return { ok: true }; 
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));
