"use client"

import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchBackend } from "@/lib/api";
import Appointment from "./appointment/page";

export default function Home() {
  const { role, userName } = useAuthContext();
  const [ latestAppointments, setLatestAppointments ] = useState<LatesAppointment[]>([]);
  // used to toggle show all appointments of current day
  const [showMoreEnabled, setShowMoreEnabled] = useState<boolean>(false);
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

      <div
        className='border-highlight-muted border-2 border-solid rounded-md
        sm:m-6 sm:p-4'
      >
        <h2 className="text-2xl my-4">Appointments Today</h2>
        {latestAppointments?.length > 0 && (<AppointmentCard
          index={0}
          appointment={latestAppointments[0]}
        />)}

        { latestAppointments?.length > 1 &&
          <div
            className={`${showMoreEnabled ?
              "" :
              "[&>div]:hidden"}`}
          >
            <button
              className={`
                ${showMoreEnabled ? "hidden" : ""}`}
              onClick={handleShowMoreButton}
            >
              more ...
            </button>
            {latestAppointments.map((appointment, index) => (
              ( index > 0 && <AppointmentCard
                key={index}
                index={index}
                appointment={appointment}
              />)
            ))}

            <button
              className={`
                ${showMoreEnabled ? "" : "hidden"}`}
              onClick={handleShowMoreButton}
            >
              less ...
            </button>
          </div>
        }
      </div>
    </div>
  );

  function handleShowMoreButton(){
    setShowMoreEnabled(x => !showMoreEnabled);
  }
}

function AppointmentCard({index, appointment}:
  {index: number, appointment: LatesAppointment})
{
  const { message, name } = appointment;

  return (
    <div>
      <p>{name}</p>
      <p>{message}</p>
    </div>
  );
}

//util functions
function Greeting():"Good Morning"|"Good Afternoon"{
  const currentTime = new Date().getHours();
  if(currentTime >= 12) return "Good Afternoon";
  return "Good Morning"
}

interface LatesAppointment {
  id: number;
  student_id: number;
  professor_id: number;
  availability_id: number;
  status: string;
  message: string;
  time_stamp: string;
  created_at: string;
  updated_at: string;
  name: string;
};