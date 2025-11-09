"use client"

import { useProfAppointment } from "@/context/ProfessorAppointmentContext"
import { removeSeconds } from "@/util/TimeFormat";
import { useEffect, useRef } from "react"
import { BsPersonCircle } from "react-icons/bs";
import { FaRegCalendar } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { LuClock } from "react-icons/lu";
import fetchBackend from "@/lib/fetchBackend";
import { toast } from "react-toastify";

export default function RecivedAppointmentDialog(){
  
  const {
    mainDialogOpened,
    setMainDialogOpened,
    selectedAppointmentId,
    setSelectedAppointmentId,
    recievedAppointments,
    setRecievedAppointments
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

  const isAccepting = useRef(false);
  const isDeclining = useRef(false);

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
              className={`bg-green-800`}
              onClick={handleAccept}
              disabled={isAccepting.current}
            >
              { !isAccepting.current ? 
                <p>Accept</p>
                : <p>plese wait </p>
              }
            </button>

            <button
              className="bg-red-800"
              onClick={handleDecline}
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
    isAccepting.current = false;
  }

  async function handleAccept(){
    if (isAccepting.current) return;

    isAccepting.current = true;
    
    const reqBody = { id : selectedAppointment.id };

    try {

      const response = await fetchBackend("appointment/accept",{
        method: "POST",
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(reqBody)
      });

      const { message, data } = await response.json() as common_response;
      if (!response.ok) throw new Error(message);

      setRecievedAppointments(items => items.map(item => {
        if (item.id === selectedAppointment.id) {
          item = {...item, status: 1 }
        }

        handleClose();

        return item;
      }))
      toast.success("Appointment has been approved");

    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    } finally {
      isAccepting.current = false;
    }

  }

  async function handleDecline(){
    if (isDeclining.current) return;

    isDeclining.current = true;

    try {

      const response = await fetchBackend('', {

      });

      const { data, message, success } = await response.json() as common_response;

      if (!response.ok || !success)
        throw new Error(message);


    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    } finally {
      isDeclining.current = false;
    }
  }
}
