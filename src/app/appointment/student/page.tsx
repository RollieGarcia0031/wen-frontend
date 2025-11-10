"use client"

import { FaCheck, FaPlus, FaTrashAlt } from "react-icons/fa";
import { AppointmentContextProvider, refreshSentAppointments, useAppointment } from "@/context/AppointmentContext";
import SearchProfessorDialog from "@/components/SearchProfessorDialog";
import { SearchProfessorContextProvider } from "@/context/SearchProfessorContext";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import fetchBackend from "@/lib/fetchBackend";
import { MdCancel, MdWatchLater } from "react-icons/md";

export default function Student(){

  return (
    <AppointmentContextProvider>
      <SearchProfessorContextProvider>
        <div className="px-10 mt-4">

          <AppointmentHeader />

          <AppointmentsTable />

        </div>

      </SearchProfessorContextProvider>
    </AppointmentContextProvider>
  );
}

/**
 * Header and quick opttion bar in sending appointment
 */
function AppointmentHeader(){
  const { setSearchDialogOpened } = useAppointment();

  return (

    <div className="flex-rl">
      <h1 className="flex-1">
        Sent Appointments
      </h1>

      <button
        className="bg-primary hover:bg-primary-hover px-4 rounded-md
          shadow-black shadow-md
        "
        title="create new appointment"
        onClick={()=>setSearchDialogOpened(true)}
      >
        <FaPlus />
      </button>

      <SearchProfessorDialog />
    </div>
  );
}

function AppointmentsTable(){
  const { sentAppointments, setSentAppointments} = useAppointment();

  useEffect(()=>{
    refreshSentAppointments(setSentAppointments);
  }, []);

  if (sentAppointments.length === 0){

    return (
      <div className="flex-full-center h-[30dvh]">
        <p>
          No Appointments Found
        </p>
      </div>
    );
  }
  return (
    <div
      className="flex-cc mt-10"
    >
      
      <div
        className="w-[40rem] card p-8"
      >
        <div className="mb-8">
          <p className="text-4xl font-extrabold">
            Appointments
          </p>
          <p>
            View your sent appointments
          </p>
        </div>
        <div
          className="grid grid-cols-[1fr_1fr_4rem_4rem] px-4 my-4 font-semibold"
        >
          <p>Name</p>
          <p>Date</p>
          <p>Status</p>
        </div>

        <AnimatePresence> 
        {sentAppointments.map(item => (
          <AppointmentCard item={item} key={item.id}/> 
        ))}
        </AnimatePresence>
      </div>
      
    </div>
  );
}

function AppointmentCard({item}:{
  item: appointment_list_response_item
}){

  const { setSentAppointments } = useAppointment();
  const { name, id, target_date, status } = item;

  const displayDate = new Date(target_date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <motion.div
      className="grid grid-cols-[1fr_1fr_4rem_4rem]
      border-y-highlight-muted border-y-[1px] cursor-pointer
      px-4 py-4 my-2 duration-100 rounded-md hover:bg-highlight-muted"
      initial={{ opacity: 0, height: 'auto', marginBottom: 0 }}
      animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
      exit={{ opacity: 0, height: 'auto', marginBottom: 0 }}
      transition={{ duration: 0.3}}
    >
      <p className="overflow-x-hidden">
        {name}
      </p>

      <p className="flex flex-row items-center">
        {displayDate}
      </p>

      <div className="flex-cc">
        <StatusIcon status={status} />
      </div>

      <button
        onClick={handleDelete}
        className="flex-cc"
      >
        <FaTrashAlt />
      </button>
    </motion.div>
  );

  async function handleDelete(){

    const reqBody = { id };

    try {

      const response = await fetchBackend("appointment/delete", {
        method: "DELETE",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(reqBody)
      });

      const { message, success } = await response.json() as common_response;

      if (!response.ok || !success) throw new Error(message || "Error Occured");

      setSentAppointments(appointments => 
        appointments.filter(apt => apt.id !== id)
      );

    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    }
    
  }
}

function StatusIcon({status}:{status:number}){
  switch (status){
    case 0: return (
      <MdWatchLater title="pending" className="fill-orange-500"/>
    )
    case 1: return (
      <FaCheck title='approved' className="fill-green-500"/>
    )
    case 2: return (
      <MdCancel title='declined' className="fill-red-400"/>
    )
    default:
      <MdWatchLater />
  }
}
