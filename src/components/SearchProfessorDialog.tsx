"use cient"

import { useAppointment } from "@/context/AppointmentContext"
import { useEffect, useRef } from "react";

export default function SearchProfessorDialog(){
  const { searchDialogOpened, setSearchDialogOpened} = useAppointment();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  
  useEffect(()=>{
    if (searchDialogOpened) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [searchDialogOpened]);

  return (
    <dialog ref={dialogRef} onClose={()=>setSearchDialogOpened(false)}>
      <h1> Search </h1>
    </dialog>
  );
}
