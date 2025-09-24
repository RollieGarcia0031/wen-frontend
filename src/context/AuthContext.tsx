"use client";

import React, { useContext, createContext, useState, useEffect, use } from "react";

interface AuthContextProps {
    userName?: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    role?: string;
    setRole?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AuthContext = createContext<AuthContextProps>({
  setUserName: () => {},
});

export function AuthContextProvider({children}: {children: React.ReactNode}) {
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<string | undefined>("");

  useEffect(()=>{
    const sessionName = sessionStorage.getItem("name");
    const sessionRole = sessionStorage.getItem("role");
    if(sessionName && sessionRole) setUserName(sessionName), setRole(sessionRole);
  },[]);

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