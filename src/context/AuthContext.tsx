"use client"

import fetchBackend from "@/lib/fetchBackend";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    /**
     * The info currently logged in user
     */
    user: User | null;
    setUser: (user: any) => void;
    refreshAuth: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    setUser: (user: any) => {},
    refreshAuth: async () => {},
    isLoading: true
});

export function AuthContextProvider({ children }: any) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const userInfoResponse = await fetchBackend('auth/profile', {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            
            const userInfoJson = await userInfoResponse.json() as auth_profile_response;
            if (userInfoResponse.ok || userInfoJson.success) {
                if (userInfoJson.data){
                    localStorage.setItem('user', JSON.stringify(userInfoJson.data));
                    setUser(userInfoJson.data);
                } else {
                    localStorage.removeItem('user');     
                    setUser(null);
                    router.replace('/login');
                }
            } else {
                if (userInfoResponse.status === 401) {
                    throw new Error("Not logged in");
                } else {
                    throw new Error(userInfoJson.message || "An error occurred during authentication.");
                }
            }
        } catch (error){
            localStorage.removeItem('user');     
            setUser(null);
            router.replace('/login');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        fetchUser();
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, refreshAuth: fetchUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}