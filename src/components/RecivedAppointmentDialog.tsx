"use client"

import {  } from "@/context/ProfessorAppointmentContext"
import { RefObject } from "react"

export default function RecivedAppointmentDialog({ref}:{
  ref: RefObject<HTMLDialogElement | null>
}){
  
  return (
    <dialog ref={ref}
      
    >
      Dialog heheheh
    </dialog>
  );
}
