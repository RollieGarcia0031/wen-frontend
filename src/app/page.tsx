"use client"

import { useAuthContext } from "@/context/AuthContext";
import { useEffect, createContext, useContext, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchBackend } from "@/lib/api";
import { convertTo12Hour } from "@/lib/timeFormatter";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LatestAppointment } from "@/context/LatestAppointmentContext";
import { LatestAppointmentContextProvider, useLatestAppointmentContext } from '@/context/LatestAppointmentContext'

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
      <div>
        <h1 className="text-4xl">{Greeting()}
          <span className="text-3xl ml-4">
            {userName}!
          </span>
        </h1>
        <LatestAppointmentPanel />
      </div>

      <RemoveSeenAppointmentDialog />
    </LatestAppointmentContextProvider>
  );

}

function LatestAppointmentPanel(){
  const { latestAppointments } = useLatestAppointmentContext();
  // used to toggle show all appointments of current day
  const [showMoreEnabled, setShowMoreEnabled] = useState<boolean>(false);


  return (
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
  );

  function handleShowMoreButton(){
    setShowMoreEnabled(x => !showMoreEnabled);
  }
}

function AppointmentCard({index, appointment}:
  {index: number, appointment: LatestAppointment})
{
  const { setSelectedIndexOfLatestAppointment, removeDialogRef } = useLatestAppointmentContext();
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
        onClick={HandleRemoveSeenAppointment}
      >
        <MdOutlineRemoveRedEye
          className="sm:text-2xl fill-text-muted hover:fill-primary"
        />

      </button>
    </div>
  );

  function HandleRemoveSeenAppointment(){
    setSelectedIndexOfLatestAppointment(index);
    removeDialogRef?.current?.showModal();
  }
}

function RemoveSeenAppointmentDialog(){
  const {
    latestAppointments,
    setLatestAppointments,
    selectedIndexOfLatestAppointment,
    removeDialogRef,
    setSelectedIndexOfLatestAppointment
  } = useLatestAppointmentContext();

  const selectedLatestAppointment = latestAppointments[selectedIndexOfLatestAppointment];
  const { name } = selectedLatestAppointment || {};

  return (
    <dialog ref={removeDialogRef}>
      <div className="flex flex-col
        sm:p-4 leading-loose
      ">
        <p>Are you done?</p>
        <p className="text-text-muted">
          If yes, you can now discard your appointment with: <br/>
          <i className="font-bold">
            {name}
          </i>
        </p>

        <div
          className="flex-row-center
          sm:gap-4 sm:mt-4
          sm:[&>button]:px-8 sm:[&>button]:py-[0.05rem]
          [&>button]:rounded-md [&>button]:font-bold"
        >
          <button
            className="bg-green-700"
          >
            Yes
          </button>

          <button className="bg-red-700"
            onClick={handleNoButton}
          >
            No
          </button>
        </div>
      </div>
    </dialog>
  );

  function handleNoButton(){
    removeDialogRef?.current?.close();
    setSelectedIndexOfLatestAppointment(-1);
  }
}

//util functions
function Greeting():"Good Morning"|"Good Afternoon"{
  const currentTime = new Date().getHours();
  if(currentTime >= 12) return "Good Afternoon";
  return "Good Morning"
}