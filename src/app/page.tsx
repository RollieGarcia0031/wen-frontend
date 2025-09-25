"use client"

import { useAuthContext } from "@/context/AuthContext";
import { useEffect, createContext, useContext, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LatestAppointmentContextProvider } from '@/context/LatestAppointmentContext'
import { AppointmentCard, RemoveSeenAppointmentDialog, LatestAppointmentPanel } from '@/components/LatestAppointment';
import CurrentTotalAppointmentCount from "@/components/CurrentAppointmentCount";

export default function Home() {
  const { role, userName } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const sessionRole = sessionStorage.getItem("role");
    const sessionName = sessionStorage.getItem("name");

    if(sessionRole && sessionName) return;
    router.push("/login");

  }, [role]);

  return (
    <LatestAppointmentContextProvider>
      <div
        className="space-y-8
        sm:p-4"
      >
        <h1 className="text-4xl">{Greeting()}
          <span className="text-3xl ml-4">
            {userName}!
          </span>
        </h1>
        <CurrentTotalAppointmentCount />
        <LatestAppointmentPanel />
      </div>
      <RemoveSeenAppointmentDialog />
    </LatestAppointmentContextProvider>
  );

}

//util functions
function Greeting():"Good Morning"|"Good Afternoon"{
  const currentTime = new Date().getHours();
  if(currentTime >= 12) return "Good Afternoon";
  return "Good Morning"
}