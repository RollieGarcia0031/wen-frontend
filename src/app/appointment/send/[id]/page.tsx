"use client";

import {use, useEffect, useState, useRef} from 'react';
import { SearchAvailabilityResponseDataItem } from '@/lib/response';
import { fetchBackend } from '@/lib/api';
import { BsSkipBackwardCircle, BsSendPlus} from 'react-icons/bs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
          <BsSkipBackwardCircle className='text-2xl'/>
        </Link>
      </button>
      <h1
        className='text-3xl font-bold
        sm:my-6 sm:text-4xl'
      >
        Send Appointment
      </h1>

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
      className='border-gray-500 border-2 border-solid rounded-md p-4
      sm:min-w-[35rem]'
    >
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
      className='border-b-gray-500 border-b-2 border-solid rounded-md p-4 w-full
        flex flex-row justify-between
        sm:gap-5'
    >
      <div
        className='flex-row-center
          border-r-highlight-muted border-r-[1px] border-r-solid
          pr-8
        '
      >
          <p
            className='font-bold text-xl'
          >
            {day_of_week}
          </p>
      </div>

      <div>
          <p>{start_time}</p>
          <p>{end_time}</p>

      </div>

      <div className='flex-1 flex justify-end'>
        <button
          onClick={() => dialogRef.current?.showModal()}
          className='flex-row-center aspect-square rounded-full duration-150 transition-all
          *:fill-primary hover:bg-gray-700 hover:*:fill-white'
        >
          <BsSendPlus
            className='sm:text-xl'
          />
        </button>
      </div>
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
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

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
            className='flex flex-col w-full
            sm:mb-3 gap-2
            [&>div]:flex [&>div]:flex-row [&>div]:items-center
            sm:[&>div]:gap-6'
          >
            <div>
              <p className='flex-1'>{day_of_week}</p>
                <DatePicker
                  selected={date}
                  onChange={(date: Date | null, ) => setDate(date)}
                  filterDate={filteredDates}
                />        
            </div>

            <div>
              <p className='flex-1'>Subject</p>
              <input
                placeholder='Subject'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <p>{start_time}</p>
            <p>{end_time}</p>

          </div>

        </div>

        <div
          className='flex flex-row gap-2 justify-center'
        >
          <button
            onClick={handleConfirm}
            className='bg-green-600 hover:bg-green-700  text-black
              sm:py-1 sm:px-3 rounded-xl'
          >
            Confirm
          </button>

          <button
            onClick={() => ref.current?.close()}
            className='bg-red-600 hover:bg-red-700 text-black
              sm:py-1 sm:px-3 rounded-xl'
          >
            Cancel
          </button>
        </div>

      </div>
    </dialog>
  );

  async function handleConfirm(){
    const year = date?.getFullYear() || 0;
    const month = date?.getMonth() || 0;
    const day = date?.getDate() || 0;

    const dateString = `${year}-${month + 1}-${day}`;

    const body = {
      prof_id: parseInt(prof_id.toString()),
      availability_id: id,
      time_stamp: dateString,
      message: message,
    }

    const daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const selectedDay = day_of_week;
    const calendarPickedDay = daysArray[date?.getDay() || 0];

    if(selectedDay !== calendarPickedDay){
      alert('Please select a day that matches the availability day');
      return;
    }

    const response = await fetchBackend(
      'appointment/send',
      'POST', JSON.stringify(body),
      new Headers({"Content-Type": "application/json"})
    );

    if(response.success){
      ref.current?.close();
      router.push('/appointment');      
    } else {
      alert(response.message);
    }
  }
}