"use client"

import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { AppointmentContextProvider, refreshSentAppointments, useAppointment } from "@/context/AppointmentContext";
import SearchProfessorDialog from "@/components/SearchProfessorDialog";
import { SearchProfessorContextProvider } from "@/context/SearchProfessorContext";
import { useEffect } from "react";

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

  return (
    <div
      className="flex-cc mt-10"
    >

      <div
        className="w-[30rem] card p-4 space-y-4"
      >
        
        {sentAppointments.map(item => (
          <AppointmentCard item={item} key={item.id}/> 
        ))}
      </div>

    </div>
  );
}

function AppointmentCard({item}:{
  item: appointment_list_response_item
}){
  
  const { setSentAppointments } = useAppointment();
  const { name, id } = item;
  return (
    <div
      className="grid grid-cols-[1fr_auto] card
      px-4 py-4"
    >
      <div>

        {name}

      </div>

      <button
        onClick={handleDelete}
      >
        <FaTrashAlt />
      </button>
    </div>
  );

  function handleDelete(){
    setSentAppointments(appointments => {
      return appointments.filter(apt => apt.id !== id)
    });

  }
}
