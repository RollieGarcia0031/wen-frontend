"use client"

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchBackend } from "@/lib/api";

export default function Home() {
  const { role, userName } = useAuthContext();
  const [ latestAppointments, setLatestAppointments ] = useState<LatesAppointment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const sessionRole = sessionStorage.getItem("role");
    const sessionName = sessionStorage.getItem("name");

    if(sessionRole && sessionName) return;
    router.push("/login");

  }, [role]);
  
  useEffect(()=>{
    const fetchLatestAppointments = async () =>  {
      try{
        const latestAppointments = await fetchBackend("appointment/currentDayBooked", "GET");
        if(!latestAppointments.data) return;
        setLatestAppointments(latestAppointments.data);
      } catch (err){
        console.error(err)
      }
    }
    
    fetchLatestAppointments();
  }, [])

  return (
    <div>
      <h1 className="text-4xl">{Greeting()}
        <span className="text-3xl ml-4">
          {userName}!
        </span>
      </h1>

      <div>
        <h2 className="text-2xl my-4">Latest Appointments</h2>
      </div>
    </div>
  );
}


function Greeting():"Good Morning"|"Good Afternoon"{
  const currentTime = new Date().getHours();
  if(currentTime >= 12) return "Good Afternoon";
  return "Good Morning"
}

interface LatesAppointment {
  id: number,
  student_id: number,
  professor_id: number,
  availability_id: number,
  status: string,
  message: string,
  time_stamp: string,
  created_at: string,
  updated_at: string
};