"use client";

import {use, useEffect, useState, useRef} from 'react';
import { SearchAvailabilityResponseDataItem } from '@/lib/response';
import { fetchBackend } from '@/lib/api';
import Link from 'next/link';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SendAppointment({params}: {
  params : Promise<{id: number}>
}) {

  // id of professor in the users table
  const { id } = use(params);
  return (
    <div
      className='w-full h-full flex flex-col justify-center items-center'
    >
      <button>
        <Link href='/appointment'>
          Go Back
        </Link>
      </button>
      <h1>Send Appointment</h1>

      <AvailabilityPanel
        id={id}
      />
    </div>
  );
}

/**
 * 
 * @param {number} id - id of the professor
 */
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
                prof_id={id}
              />
            ))
          }
        </div>
    </div>
  );
}

function AvailabilityCard({availability, profName, prof_id}:{
  availability: SearchAvailabilityResponseDataItem,
  profName: string,
  prof_id: number
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
      prof_id={prof_id}
    />
    
    </>
  );
}

function ConfirmationDialog({ref, availability, profName, prof_id}: {
  ref: React.RefObject<HTMLDialogElement | null>,
  availability: SearchAvailabilityResponseDataItem,
  prof_id: number,
  profName: string
}){
  const { day_of_week, start_time, end_time, id } = availability;
  const [date, setDate] = useState<Date | null>(new Date());

  const filteredDates = (date: Date) => {
    const day = date.getDay();
    const daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return day === daysArray.indexOf(day_of_week);
  };

  return (
    <dialog
      ref={ref}
      className='sm:p-4 open:overflow-visible'
    >
      <div
        className='flex flex-col w-full'
      >
        <div
          className='flex flex-col w-full flex-1'
        >
            <p
              className='sm:mb-6 text-center'
            >
              Are you sure you want to send this appointment to
              <span className='font-bold italic ml-1'>
                {profName}
              </span>
              ?
            </p>
          <div
            className='flex flex-col w-full'
          >
            <div className='flex flex-row justify-center items-center'>
              <p className='flex-1'>{day_of_week}</p>
              <div>
                <DatePicker
                  selected={date}
                  onChange={(date: Date | null, ) => setDate(date)}
                  filterDate={filteredDates}
                />        
              </div>
            </div>
            <p>{start_time}</p>
            <p>{end_time}</p>

          </div>

        </div>

        <div
          className='flex flex-row gap-4 justify-center'
        >
          <button
            onClick={handleConfirm}
            className='bg-green-600 hover:bg-green-700 font-bold
              sm:py-1 sm:px-3 rounded-xl'
          >
            Confirm
          </button>

          <button
            onClick={() => ref.current?.close()}
            className='bg-red-600 hover:bg-red-700 text-text-muted
              sm:py-1 sm:px-3 rounded-xl'
          >
            Cancel
          </button>
        </div>

      </div>
    </dialog>
  );

  async function handleConfirm(){
    const body = {
      prof_id: parseInt(prof_id.toString()),
      availability_id: id
    }

    const response = await fetchBackend(
      'appointment/send',
      'POST', JSON.stringify(body),
      new Headers({"Content-Type": "application/json"})
    );

    if(response.success){
      ref.current?.close();
      alert('Appointment sent!');``
    } else {
      alert(response.message);
    }
  }
}