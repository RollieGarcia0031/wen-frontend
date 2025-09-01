"use client";

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { useState, useEffect, useRef, use } from 'react';
import { fetchBackend } from '@/lib/api';
import { SearchProfessorResponse, SearchProfessorResponseDataItem } from '@/lib/response';

export default function Appointment(){
  const { role } = useAuthContext();
  
  useEffect(()=>{
    console.log(role);
  }, [role]);

  return(
    <div>
      <div className="flex gap-4 flex-row">
        <Link href='/'>Home</Link>
      </div>
      {role === "student" ? <SentAppointments /> : <ReceivedAppointments />}
    </div>
  );
}

function SentAppointments(){
  const [nameInput, setNameInput] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [professors, setProfessors] = useState<SearchProfessorResponseDataItem[]>([]);

  return (
  <>
  <div>
    <button  onClick={() => dialogRef.current?.showModal()}>New</button>  
    <h1>Sent Appointments</h1>
  </div>

  <dialog ref={dialogRef}
    className='open:sm:w-[30rem]  open:sm:h-[80dvh] open:w-full
      open:flex open:flex-col open:justify-center open:items-center'
  >
    <div className='flex flex-row justify-end align-top items-end w-full'>
      <button onClick={() => dialogRef.current?.close()}>❌</button>
    </div>
    <div className='flex-1 w-full'>
      <h1>New Appointment</h1>
      <SearchPanel />
    </div>
  </dialog>
  </>
  );

  interface SearchRequest{
    name?: string
  }
  
  function SearchPanel(){
    return (
      <div className='w-full flex flex-row justify-center items-center gap-2'>
        <label>
          🔎: 
          <input type='text' className='ml-2'
            onChange={(e) => setNameInput(e.target.value)}
          />
        </label>
        <div className='flex-1'>
          other options...
        </div>
        <button onClick={() => search()}>Search</button>
      </div>
    );

    async function search() {
      const body = JSON.stringify({name: nameInput});
  
      const response: SearchProfessorResponse = await fetchBackend("search/professor", "POST", body);
      
      if(response.success){
        const { data } = response;
        if(data){
          setProfessors(data);
        }
      }
      console.log(response);
    }
  }

}



function ReceivedAppointments(){
  return (
    <div>
      <h1>Received Appointments</h1>
    </div>
  );
}