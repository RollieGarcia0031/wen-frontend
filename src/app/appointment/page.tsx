"use client";

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import SentAppointments from './StudentAppointments';
import { fetchBackend } from '@/lib/api';

export interface appointmentData {
  appointment_id: number,
  student_id: number,
  professor_id: number,
  status: string,
  name: string,
  day_of_week: number,
  start_time: string,
  end_time: string
}

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
 * appointment panel rendered for professors
 */
function ReceivedAppointments(){
  const [appointments, setAppointments] = useState<appointmentData[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<appointmentData | null>(null);
  const [appointmentId, setAppointmentId] = useState<number>(0);
  const confirmDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(()=>{
    const fetchAppointments = async () => {
      const response = await fetchBackend('appointment/list', 'GET');

      if(!response.success || !response?.data || !response?.data?.appointments) return;

      const {appointments} = response.data;
      console.log(appointments)
      setAppointments(appointments);
    }

    fetchAppointments().catch(console.error);
  }, [])

  return (
    <div>
      <h1>Received Appointments</h1>

      <div
        className='flex flex-col justify-center items-center w-full border-white border-2 border-solid rounded-md p-4'
      >
        {appointments?.map((appointment, index) =>
          <AppointmentCard
            key={index}
            appointment={appointment}
            setAppointmentId={setAppointmentId}
            confirmDialogRef={confirmDialogRef}
            setSelectedAppointment={setSelectedAppointment}
            index={index}
            setSelectedIndex={setSelectedIndex}
          />)}
      </div>

      <ConfirmationDialog id={appointmentId} ref={confirmDialogRef} selectedAppointment={selectedAppointment}/>

    </div>
  );
}

function AppointmentCard({appointment, setAppointmentId, confirmDialogRef, setSelectedAppointment, index, setSelectedIndex}: {
  appointment: appointmentData
  setAppointmentId: React.Dispatch<React.SetStateAction<number>>,
  confirmDialogRef: React.RefObject<HTMLDialogElement | null>
  setSelectedAppointment: React.Dispatch<React.SetStateAction<appointmentData | null>>,
  index: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
}){
  const { status, name, day_of_week, start_time, end_time, appointment_id } = appointment;

  return (
    <div
      className='border-gray-500 border-2 border-solid rounded-md p-4 w-full m-4
        flex flex-row'
    >
      <div
        className='flex-1 flex flex-col'
      >
        <div
          className='flex flex-row justify-start gap-6 flex-1'
        >
          <p
            className='font-bold'
          >
            {name}
          </p>
          <p>{status}</p>
        </div>
        <div 
          className='flex flex-row justify-between'
        >
          <p>{day_of_week}</p>
          <p>{start_time}</p>
          <p>{end_time}</p>
        </div>
      </div>

      <div
        className="flex flex-col px-5 ml-10 gap-4
        *:border-white *:border-2 *:border-solid *:rounded-md *:p-2"
      >
        <button
          onClick={handleAccept}
        >
          Accept
        </button>
        <button>Decline</button>
      </div>
    </div>
  );

  function handleAccept(){
    setAppointmentId(appointment_id);
    setSelectedAppointment(appointment);
    setSelectedIndex(index);
    confirmDialogRef.current?.showModal();
  }
}

function ConfirmationDialog({selectedAppointment, ref, id}:{
  selectedAppointment: appointmentData | null,
  ref: React.RefObject<HTMLDialogElement | null>,
  id: number
}){
  return (
    <dialog 
      ref={ref}
    >
      <div
        className='flex flex-col justify-center items-center w-full rounded-md p-4'
      >
          <h1>
            Are you Sure?
          </h1>
        <div
          className='flex flex-row justify-end gap-4 mt-4'
        >
          <button onClick={() => ref.current?.close()}>Confirm</button>
          <button onClick={() => ref.current?.close()}>Cancel</button>
        </div>
      </div>
    </dialog>
  );

  async function handleConfirm(){
    const body = {id: parseInt(id.toString())};

    try{
      const response = await fetchBackend(
        'appointment/accept',
        'POST',
        JSON.stringify(body),
        new Headers({"Content-Type": "application/json"})
      );

      if(response.success) {
        alert(response.message);
        return ref.current?.close()
      };

    } catch (err){
      console.error(err);
    }

  }
}