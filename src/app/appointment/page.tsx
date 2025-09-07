"use client";

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import SentAppointments from './StudentAppointments';
import { fetchBackend } from '@/lib/api';
import { appointmentData } from '@/context/ProffesorAppointMentContext';
import { ProfessorContextProvider, useProfessorContext } from '@/context/ProffesorAppointMentContext';


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
  const {
    setAppointments,
    appointments,
  } = useProfessorContext();

  useEffect(()=>{
    const fetchAppointments = async () => {
      const response = await fetchBackend('appointment/list', 'GET');

      if(!response.success || !response?.data || !response?.data?.appointments) return;

      const {appointments} = response.data;
      console.log(appointments)
      if(setAppointments)setAppointments(appointments);
    }

    fetchAppointments().catch(console.error);
  }, [])

  return (
    <ProfessorContextProvider>
    <div>
      <h1>Received Appointments</h1>

      <div
        className='flex flex-col justify-center items-center w-full border-white border-2 border-solid rounded-md p-4'
      >
        {appointments?.map((appointment, index) =>
          <AppointmentCard
            key={index}
            appointment={appointment}
            index={index}
          />)}
      </div>

      <ConfirmationDialog/>

    </div>
    </ProfessorContextProvider>
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
        {status === "pending" && <AcceptButton/>}
        <DeclineButton/>
      </div>
    </div>

);

  function AcceptButton(){
    return (
      <button
        onClick={handleAccept}
      >
        Accept
      </button>
    );

  }

  function DeclineButton(){
    return (
      <button
        onClick={handleDecline}
      >
        Decline
      </button>
    );
  }

  function handleAccept(){
    setAppointmentId(appointment_id);
    setSelectedAppointment(appointment);
    setSelectedIndex(index);
    confirmDialogRef.current?.showModal();
  }

  function handleDecline(){

  }
}

function ConfirmationDialog({selectedAppointment, ref, id, selectedIndex, setAppointments}:{
  selectedAppointment: appointmentData | null,
  ref: React.RefObject<HTMLDialogElement | null>,
  id: number,
  selectedIndex: number,
  setAppointments: React.Dispatch<React.SetStateAction<appointmentData[]>>
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
          <button
            onClick={() => handleConfirm()}
          >
            Confirm
          </button>

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
        setAppointments(x => {
          x[selectedIndex].status = "Accepted";
          return [...x];
        });
        return ref.current?.close()
      };

    } catch (err){
      console.error(err);
    }

  }
}

function DeclineDialog(){
  return (
    <dialog>
      <div
        className='flex flex-col justify-center items-center w-full rounded-md p-4'
      >
        <h1>
          Are you sure?
        </h1>
      </div>
    </dialog>
  );
}