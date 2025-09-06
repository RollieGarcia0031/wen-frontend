"use client";

import {use, useEffect, useState, useRef} from 'react';
import { SearchAvailabilityResponseDataItem } from '@/lib/response';
import { fetchBackend } from '@/lib/api';
import { parse } from 'path';

export default function SendAppointment({params}: {
  params : Promise<{id: number}>
}) {

  // id of professor in the users table
  const { id } = use(params);
  return (
    <div
      className='w-full h-full flex flex-col justify-center items-center'
    >
      <h1>Send Appointment</h1>

      <AvailabilityPanel
        id={id}
      />
    </div>
  );
}

function AvailabilityPanel({id}:{
  id:number
}){
  const [availabilities, setAvailabilities] = useState<SearchAvailabilityResponseDataItem[]>([]);
  const [profName, setProfName] = useState<string>("");
  
  useEffect(()=>{
    const body = {id: parseInt(id.toString())};

    const fetchAvailabilities = async () =>  {
      const response = await fetchBackend(
        'search/availability',
        'POST', JSON.stringify(body),
        new Headers({"Content-Type": "application/json"})
      );

      if(response.success && response.data) {
        console.log(response.data);
        setAvailabilities(response.data);
      } 
    }

    fetchAvailabilities().catch(console.error);

    const fetchProfName = async () =>  {
      const response = await fetchBackend(
        'search/professor/info',
        'POST', JSON.stringify(body),
        new Headers({"Content-Type": "application/json"})
      );

      if(response.success && response.data) {
        console.log(response.data[0]);
        setProfName(response.data[0].name);
      } 
    }

    fetchProfName().catch(console.error);
  },[]);

  return (
    <div
      className='border-gray-500 border-2 border-solid rounded-md p-4 w-5xl'
    >
        <p>Availability</p>
        <div
          className='flex flex-col gap-4 w-full'
        >
          {
            availabilities.map((availability: SearchAvailabilityResponseDataItem) => (
              <AvailabilityCard
                key={availability.id}
                availability={availability}
                profName={profName}
              />
            ))
          }
        </div>
    </div>
  );
}

function AvailabilityCard({availability, profName}:{
  availability: SearchAvailabilityResponseDataItem,
  profName: string
}){
  const { day_of_week, start_time, end_time, id } = availability;
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
    <div
      className='border-gray-500 border-2 border-solid rounded-md p-4 w-full
        flex flex-row justify-between'
    >
      <div>
          <p>{day_of_week}</p>
          <p>{start_time}</p>
          <p>{end_time}</p>
      </div>

      <button onClick={() => dialogRef.current?.showModal()}>
        Send
      </button>
    </div>

    <ConfirmationDialog
      ref={dialogRef}
      availability={availability}
      profName={profName}
    />
    
    </>
  );
}

function ConfirmationDialog({ref, availability, profName}: {
  ref: React.RefObject<HTMLDialogElement | null>,
  availability: SearchAvailabilityResponseDataItem,
  profName: string
}){
  const { day_of_week, start_time, end_time, id } = availability;

  return (
    <dialog
      ref={ref}
    >
      <div>
        <p>Are you sure you want to send this appointment to {profName}?</p>
        <p>{day_of_week}</p>
        <p>{start_time}</p>
        <p>{end_time}</p>
      </div>

      <div>
        <button onClick={() => ref.current?.close()}>Cancel</button>
        <button>Send</button>
      </div>

    </dialog>
  );
}