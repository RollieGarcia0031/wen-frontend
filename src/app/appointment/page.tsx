"use client";

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import SentAppointments from './StudentAppointments';
import { fetchBackend } from '@/lib/api';
import { appointmentData } from '@/context/ProffesorAppointMentContext';
import { ProfessorContextProvider, useProfessorContext } from '@/context/ProffesorAppointMentContext';
import { StudentContextProvider } from '@/context/StudentAppointmentContext';


export default function Appointment(){
  const { role } = useAuthContext();
  
  useEffect(()=>{
    console.log(role);
  }, [role]);

  return(
    <div>
      {role === "student" ? (
        <StudentContextProvider>
        <SentAppointments />
        </StudentContextProvider>
      ):(
        <ProfessorContextProvider>
          <ReceivedAppointments />
        </ProfessorContextProvider>
      )}
    </div>
  );
}

/**
 * appointment panel rendered for professors
 */
function ReceivedAppointments(){
  const {
    setAppointments,
    appointments
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
    <div
      className='flex flex-col justify-center items-center w-full'
    >
      <h1
        className='my-4 text-2xl font-bold'
      >
        Received Appointments
      </h1>

      <div
        className='flex flex-col justify-center items-center w-[40rem]
        border-highlight-muted border-2 border-solid rounded-md p-4'
      >
        {appointments?.map((appointment, index) =>
          <AppointmentCard
            key={index}
            appointment={appointment}
            index={index}
          />)}
      </div>

      <ConfirmationDialog/>
      <DeclineDialog/>
    </div>
  );
}

//div for each appointment
function AppointmentCard({appointment, index}: {
  appointment: appointmentData
  index: number
}){
  const { status, name, day_of_week, start_time, end_time, appointment_id } = appointment;
  const {
    setAppointmentId,
    confirmDialogRef,
    setSelectedAppointment,
    setSelectedIndex,
    declineDialogRef
  } = useProfessorContext();
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
        className="flex flex-row ml-10 gap-4 flex-1 justify-end
        *:rounded-md *:p-2 *:duration-500
        *:hover:text-text-muted"
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
        className='border-green-600 border-2 border-solid rounded-md
          bg-green-950'
      >
        Accept
      </button>
    );

  }

  function DeclineButton(){
    return (
      <button
        onClick={handleDecline}
        className='border-red-600 border-2 border-solid rounded-md
          bg-red-950'
      >
        {status === "pending" ?"Decline":"Delete"}
      </button>
    );
  }

  function handleAccept(){
    if(setAppointmentId && setSelectedAppointment && setSelectedIndex && confirmDialogRef){
      setAppointmentId(appointment_id || -1);
      setSelectedAppointment(appointment);
      setSelectedIndex(index);
      confirmDialogRef.current?.showModal();
    }
  }

  function handleDecline(){
    if(setAppointmentId && setSelectedAppointment && setSelectedIndex && declineDialogRef){
      setAppointmentId(appointment_id || -1);
      setSelectedAppointment(appointment);
      setSelectedIndex(index);
      declineDialogRef.current?.showModal();
    }
  }
}

//pop up for accepting an appointment
function ConfirmationDialog(){
  const { confirmDialogRef, selectedIndex, setAppointments, appointmentId } = useProfessorContext();

  return (
    <dialog 
      ref={confirmDialogRef}
    >
      <div
        className='flex flex-col justify-center items-center w-full rounded-md p-4
          text-center'
      >
          <h1>
            Are you Sure? <br/>
            To accept this appointment?
          </h1>
        <div
          className='flex flex-row justify-end gap-4 mt-4
            *:py-1 *:px-2 *:rounded-md *:duration-500'
        >
          <button
            onClick={() => handleConfirm()}
            className='border-green-600 border-2 border-solid rounded-md'
          >
            Confirm
          </button>

          <button onClick={() => confirmDialogRef?.current?.close()}
            className='border-red-700 border-2 border-solid rounded-md
              text-text-muted'  
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );

  async function handleConfirm(){
    if(selectedIndex == undefined || selectedIndex < 0) return;
    if(!setAppointments || !appointmentId) return;
    const body = {id: parseInt(appointmentId.toString())};

    try{
      const response = await fetchBackend(
        'appointment/accept',
        'POST',
        JSON.stringify(body),
        new Headers({"Content-Type": "application/json"})
      );

      if(response.success) {
        setAppointments(x => {
          x[selectedIndex].status = "Accepted";
          return [...x];
        });
        return confirmDialogRef?.current?.close()
      };
      alert(response.message);

    } catch (err){
      console.error(err);
    }
  }
}

//pop up for declining an appointment
function DeclineDialog(){
  const ref = useProfessorContext().declineDialogRef;
  const { selectedAppointment, appointmentId, selectedIndex, setAppointments } = useProfessorContext();

  return (
    <dialog ref={ref}>
      <div
        className='flex flex-col justify-center items-center w-full rounded-md p-4 text-center
          '
      >
        <h1>
          Are you sure?
          <br/>
          This will permanently delete the sent appointment
        </h1>

        <div
          className='flex flex-row justify-end gap-4 mt-4
          *:border-2 *:border-solid *:rounded-md *:p-2'
        >
          <button
            onClick={handleConfirm}
            className='border-green-600'
          >Confirm</button>
          <button
            className='border-red-700
              text-text-muted'
            onClick={() => ref?.current?.close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );

  //delete recieved appointment
  async function handleConfirm(){
    if(appointmentId == undefined || appointmentId < 0 || !setAppointments) return;

    const body = {id: parseInt(appointmentId.toString())};

    try {
      const response = await fetchBackend(
        'appointment/delete',
        'DELETE',
        JSON.stringify(body),
        new Headers({"Content-Type": "application/json"})
      );

      if(response.success) {
        ref?.current?.close();
        if(selectedIndex != undefined){
          console.log(selectedIndex)
          setAppointments(x => {
            const filtered = x.filter((_, i) => i !== selectedIndex);
            return [...filtered];
          });
        };

        alert(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
}