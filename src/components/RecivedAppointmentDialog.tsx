"use client"

import { useProfAppointment } from "@/context/ProfessorAppointmentContext"
import { useEffect, useRef } from "react"
import { IoMdCloseCircleOutline } from "react-icons/io";

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

  useEffect(()=>{
    if (mainDialogOpened) ref.current?.showModal();
    else ref.current?.close();
  },[mainDialogOpened]);

  return (
    <dialog ref={ref}
      onClose={handleClose}    
    >
      <div
        className="grid grid-rows-[auto_1fr] h-[40dvh] w-[50dvh]"
      >
        <div className="flex-rr">
          <button onClick={handleClose}>
            <IoMdCloseCircleOutline />  
          </button>
        </div>

        <div>
          {selectedAppointment?.message}
        </div>
      </div>
    </dialog>
  );

  function handleClose(){
    setMainDialogOpened(false);
    setSelectedAppointmentId(-1);
  }
}
