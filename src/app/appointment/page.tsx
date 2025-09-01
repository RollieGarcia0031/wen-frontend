"use client";

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
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

/**
 * Appointments panel rendered for students
 */
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
  <NewAppointmentDialog
    nameInput={nameInput}
    setNameInput={setNameInput}
    dialogRef={dialogRef}
    setProfessors={setProfessors}
    professors={professors}
  />
  </>
  );

}
// dialog pop up for adding a new appointment and searching for professors
function NewAppointmentDialog({nameInput, setNameInput, dialogRef, setProfessors, professors}:{
  nameInput: string,
  setNameInput: React.Dispatch<React.SetStateAction<string>>,
  dialogRef: React.RefObject<HTMLDialogElement | null>  ,
  setProfessors: React.Dispatch<React.SetStateAction<SearchProfessorResponseDataItem[]>>,
  professors: SearchProfessorResponseDataItem[],
  }){
  return(
    <dialog ref={dialogRef} onSubmit={(e) => e.preventDefault()}
      className='open:sm:w-[30rem]  open:sm:h-[80dvh] open:w-full
        open:flex open:flex-col open:justify-center open:items-center'
    >
      <div className='flex flex-row justify-end align-top items-end w-full'>
        <button onClick={() => dialogRef.current?.close()}>❌</button>
      </div>
      <div className='flex-1 w-full flex flex-col justify-center items-center'>
        <h1>New Appointment</h1>
        <SearchPanel 
          nameInput={nameInput}
          setNameInput={setNameInput}
          setProfessors={setProfessors}
        />
        <SearchResult professors={professors}/>
      </div>
    </dialog>

  );
}

/**
 * search panel of user student, where the user can search for professors
 * TODO: add more search options
 */
function SearchPanel({nameInput, setNameInput, setProfessors}: {
  nameInput: string,
  setNameInput: React.Dispatch<React.SetStateAction<string>>,
  setProfessors: React.Dispatch<React.SetStateAction<SearchProfessorResponseDataItem[]>>,
}){
  return (
    <div className='w-full flex flex-row justify-center items-center gap-2'
    >
      <label>
        🔎: 
        <input type='text' className='ml-2'
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value) }
        />
      </label>
      <div className='flex-1'>
        other options...
      </div>
      <button type='button' onClick={e=>search(e)}>Search</button>
    </div>
  );

  // search function handling
  async function search(e: any){
    e.preventDefault();
    
    const body = JSON.stringify({name: nameInput});
    
    const response: SearchProfessorResponse = await fetchBackend("search/professor", "POST", body);
    
    console.log(response);
    if(response.success){
      const { data } = response;
      if(data){
        return setProfessors(data);
      }
    }
  }
}

/**
 * the box that shows the search result of user student
 */
function SearchResult({professors}: {professors: SearchProfessorResponseDataItem[]}){
  return (
    <div className='border-gray-500 border-2 border-solid m-4 w-[100%] rounded-md
      flex-1 p-4
    '>
      {professors?.map((professor) => <SearchResultContainer
        key={professor.prof_id}
        id={professor.prof_id}
        year={professor.year}
        department={professor.department}
        name={professor.name}
      />)}

      {professors?.length === 0 && <h1>Search Result</h1>}
    </div>
  );
}
/**
 * boxes holding the individual professor information 
 */
function SearchResultContainer({id, year, department, name}:{
  id?: number,
  year?: number,
  department?: string,
  name?: string

}){
  return (
    <div className='border-gray-500 border-2 border-solid w-[100%] rounded-md py-2 px-4'>
      <p className='font-bold'>{name}</p>
      <div className='flex flex-row gap-4'>
        <p className='text-xs'>year: {year}</p>
        <p className='text-xs'>department: {department}</p>
      </div>
    </div>
  );
}



/**
 * appointment panel rendered for professors
 */
function ReceivedAppointments(){
  return (
    <div>
      <h1>Received Appointments</h1>
    </div>
  );
}