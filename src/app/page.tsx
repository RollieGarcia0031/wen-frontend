"use client"

import { useAuthContext } from "@/context/AuthContext";
import { useEffect, createContext, useContext, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LatestAppointmentContextProvider } from '@/context/LatestAppointmentContext'
import { AppointmentCard, RemoveSeenAppointmentDialog, LatestAppointmentPanel } from '@/components/LatestAppointment';
import CurrentTotalAppointmentCount from "@/components/CurrentAppointmentCount";
import TomorrowAppointmentCount from "@/components/TomorrowAppointmentCount";

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
        sm:p-4 sm:mt-20"
      >
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center sm:w-[30rem] sm:gap-8">
            <div className="flex flex-row justify-between">
              <CurrentTotalAppointmentCount />
              <TomorrowAppointmentCount />
            </div>

            <LatestAppointmentPanel />
          </div>
        </div>
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