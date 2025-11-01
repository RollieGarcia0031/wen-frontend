"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Appointment(){
  const { user } = useAuth(); 
  
  const router = useRouter();

  useEffect( () => {
    if (user) {
      const { role } = user;

      const route = {
        'student': '/appointment/student',
        'professor': '/appointment/professor'
      }

      router.push( route[role] || '/' ); 
    }
  }, []);

  return (
    <p> Loading... </p>
  );
}
