"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getUserByToken, 
  getRefreshToken, 
  getProfileStatus 
} from "../api";
import { toast } from "react-toastify";
import { requestHandler } from "@/utils/auth";

interface User {
  id: string;
  name: string;
  email: string;
  isProfileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isProfileComplete: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: ( value:boolean ) => void;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
  getUserProfileStatus: () => Promise<void>;
  getUser: () => Promise<void>;
  handleModal: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isProfileComplete: false,
  isMenuOpen: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshToken: async () => null,
  getUserProfileStatus: async () => {},
  getUser: async () => {},
  handleModal: () => {},
  setIsMenuOpen:() => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalMsg, setModalMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  // ----------------- MODAL -----------------
  const handleModal = (msg: string) => {
    setModalMsg(msg);
    setIsModalOpen(true);
  };

  // ----------------- LOGIN -----------------
  const login = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await loginUser(data);
      const { user, accessToken } = res.data;

      setUser(user);
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      // toast.success("Login successful!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------- REGISTER -----------------
  const register = async (data: any) => {
    try {
      setIsLoading(true);
      await registerUser(data);
      // toast.success("Registration successful!");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------- LOGOUT -----------------
  const logout = async () => {
  try {
    await requestHandler(
      async () => await logoutUser(),
      setIsLoading,
      () => {
        // Optional: redirect after logoutUser
        // router.push("/");
      }
    );

    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out!");
    router.push("/"); // final redirect
  } catch (error) {
    console.error(error);
    toast.error("Logout failed!");
  }
};

const getToken = () => token;

  // ----------------- REFRESH TOKEN -----------------
  const refreshToken = async () => {
    try {
      const res = await getRefreshToken();
      const { accessToken: newToken } = res.data;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      return newToken;
    } catch (err) {
      logout();
      return null;
    }
  };

  // ----------------- GET PROFILE STATUS -----------------
  const getUserProfileStatus = async () => {
    try {
      const res = await getProfileStatus();
      const { complete } = res.data;
      setIsProfileComplete(complete);
    } catch {
      setIsProfileComplete(false);
    }
  };

  // ----------------- GET USER -----------------
  const getUser = async () => {
    try {
      const res = await getUserByToken();
      const { user } = res.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      logout();
    }
  };

  // ----------------- INITIAL LOAD -----------------
  const fetchUserFromToken = async () => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      try {
        await getUser();
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserFromToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isProfileComplete,
        isMenuOpen,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        getUserProfileStatus,
        getUser,
        handleModal,
        setIsMenuOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
