"use client"

import fetchBackend from "@/lib/fetchBackend";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userInfo } from "os";

interface AuthContextProps {
    user: User | null;
    setUser: (user: any) => void;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    setUser: (user: any) => {},
    refreshAuth: async () => {}
});

export function AuthContextProvider({ children }: any) {
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    const fetchUser = async () => {
        const userInfoResponse = await fetchBackend('auth/profile', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        
        try {
            const userInfoJson = await userInfoResponse.json() as auth_profile_response;
            if (userInfoResponse.ok || userInfoJson.success) {
                if (userInfoJson.data){
                    localStorage.setItem('user', JSON.stringify(userInfoJson.data));
                    setUser(userInfoJson.data);
                } else throw new Error("Not logged in");

            } else {
                if (userInfoResponse.status === 401) throw new Error("Not logged in");
            }
        } catch (error){
            localStorage.removeItem('user');     
            setUser(null);
            router.replace('/login');
        }
    }

    useEffect(()=>{
        fetchUser();
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, refreshAuth: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
