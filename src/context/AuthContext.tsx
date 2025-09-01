"use client";

import React, { useContext, createContext, useState } from "react";

interface AuthContextProps {
    userName?: string;
    setUserName?: React.Dispatch<React.SetStateAction<string>>;
    role?: string;
    setRole?: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextProps>({});

export function AuthContextProvider({children}: {children: React.ReactNode}) {
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<string>("");

  return (
    <AuthContext.Provider value={{
      userName,
      setUserName,
      role,
      setRole}}
    >
      {children}
    </AuthContext.Provider>    
  );
}

export function useAuthContext() {
    return useContext(AuthContext);
}