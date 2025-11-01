"use client"

import { FaPlus } from "react-icons/fa";
import { useAppointment } from "@/context/AppointmentContext";

export default function Student(){

  const { setSearchDialogOpened } = useAppointment();

  return (
    <div className="px-10 mt-4">

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

      </div>
    </div>

  );
}
