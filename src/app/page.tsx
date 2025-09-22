"use client"

import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchBackend } from "@/lib/api";
import Appointment from "./appointment/page";
import { convertTo12Hour } from "@/lib/timeFormatter";
import { MdOutlineRemoveRedEye } from "react-icons/md";

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

      <div className="flex-row-center">
        {/* panel for latest appointments of the day */}
        <div
          className='border-highlight-muted border-2 border-solid rounded-md
          sm:p-4 sm:w-[30rem]'
        >
          <h2 className="text-2xl my-4">Appointments Today</h2>
          {/* render only the first appointment */}
          {latestAppointments?.length > 0 && (<AppointmentCard
            index={0}
            appointment={latestAppointments[0]}
          />)}

            {/* if more than one appointment is booked for the day, they are
            rendered inside another panel with a toggle button for hide and show */}
          { latestAppointments?.length > 1 &&
            <div
              className={`${showMoreEnabled ?
                "" :
                "[&>div]:hidden"}`}
            >
              {/* render the more button when other appointments are hidden */}
              <button
                className={`
                  ${showMoreEnabled ? "hidden" : ""}
                  text-text-muted font-bold`}
                onClick={handleShowMoreButton}
              >
                more ...
              </button>
              {/* render the appointments with index greater than 0 */}
              {latestAppointments.map((appointment, index) => (
                ( index > 0 && <AppointmentCard
                  key={index}
                  index={index}
                  appointment={appointment}
                />)
              ))}

              {/* render the less button when other appointments are shown */}
              <button
                className={`
                  ${showMoreEnabled ? "" : "hidden"}
                  text-text-muted font-bold`}
                onClick={handleShowMoreButton}
              >
                less ...
              </button>
            </div>
          }
        </div>
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
  const { message, name, start_time } = appointment;

  return (
    <div className="flex fex-row
    sm:gap-2">
      <div
        className="border-[1px] border-highlight-muted border-solid rounded-md p-4 my-2
        flex flex-row flex-1"
      >
        <div className="flex-1">
          <p>{name}</p>
          <p>{message}</p>
        </div>

        <div className="flex-row-center">
          <p>{ convertTo12Hour(start_time)}</p>
        </div>
      </div>

      <button
        title="Remove Seen Appointment"
      >
        <MdOutlineRemoveRedEye
          className="sm:text-2xl fill-text-muted hover:fill-primary"
        />

      </button>
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
  start_time: string;
};