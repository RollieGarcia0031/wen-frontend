"use client"

import { useProfAppointment } from "@/context/ProfessorAppointmentContext"
import { removeSeconds } from "@/util/TimeFormat";
import { useEffect, useRef } from "react"
import { BsPersonCircle } from "react-icons/bs";
import { FaRegCalendar } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { LuClock } from "react-icons/lu";

export default function RecivedAppointmentDialog(){
  
  const {
    mainDialogOpened,
    setMainDialogOpened,
    selectedAppointmentId,
    setSelectedAppointmentId,
    recievedAppointments
  } = useProfAppointment();

  const ref = useRef<HTMLDialogElement | null>(null);

  const selectedAppointment = recievedAppointments.filter(item => (
    item.id === selectedAppointmentId
  ))[0];

  const displayDate = new Date(selectedAppointment?.target_date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const displayStartTime = selectedAppointment? removeSeconds(selectedAppointment?.start_time): '';
  const displayEndTime = selectedAppointment? removeSeconds(selectedAppointment?.end_time): '';

  useEffect(()=>{
    if (mainDialogOpened) ref.current?.showModal();
    else ref.current?.close();
  },[mainDialogOpened]);

  return (
    <dialog ref={ref}
      className="shadow-black shadow-xl"
      onClose={handleClose}    
    >
      <div
        className="grid grid-rows-[auto_1fr] h-[20rem] w-[30rem]"
      >
        <div className="flex-rr">
          <button onClick={handleClose}>
            <IoMdCloseCircleOutline />  
          </button>
        </div>

        <div className="overflow-y-auto px-4">
          <p className="text-2xl font-semibold">
            {selectedAppointment?.message}
          </p>
          
          <p className="text-sm mb-8">
            Details for your appointment with {selectedAppointment?.name}
          </p>

          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 mb-8">
            <BsPersonCircle className="text-[5rem]"/>
            <div>
              <p className="text-xl">
                {selectedAppointment?.name}
              </p>

              <p>
                Student
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-[auto_1fr] items-center
            gap-x-2 gap-y-1 mb-4"
          >
            <FaRegCalendar />
            <p>{displayDate}</p>

            <LuClock />
            <p>
              {displayStartTime} - {displayEndTime}
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-x-4 px-4
            [&_button]:py-1 [&_button]:rounded-md"
          >
            
            <button
              className="bg-green-800"
            >
              Accept
            </button>

            <button
              className="bg-red-800"
            >
              Decline
            </button>

          </div>
        </div>
      </div>
    </dialog>
  );

  function handleClose(){
    setMainDialogOpened(false);
    setSelectedAppointmentId(-1);
  }
}
