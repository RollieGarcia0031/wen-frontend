"use client"

import { FaPlus } from "react-icons/fa";
import { AppointmentContextProvider, useAppointment } from "@/context/AppointmentContext";
import SearchProfessorDialog from "@/components/SearchProfessorDialog";
import { SearchProfessorContextProvider } from "@/context/SearchProfessorContext";

export default function Student(){

  return (
    <AppointmentContextProvider>
      <SearchProfessorContextProvider>
        <div className="px-10 mt-4">
          <AppointmentHeader />
        </div>

        <AppointmentsTable />
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
  const { sentAppointments } = useAppointment();

  return (
    <div>
      
      {sentAppointments.map(item => (
        <AppointmentCard item={item} key={item.id}/> 
      ))}
    </div>
  );
}

function AppointmentCard({item}:{
  item: appointment_list_response_item
}){
  
  return (
    <div>
      {item.name}
    </div>
  );
}
