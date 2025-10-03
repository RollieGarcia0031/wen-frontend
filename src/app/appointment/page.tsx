"use client";

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import SentAppointments from './StudentAppointments';
import { fetchBackend } from '@/lib/api';
import { appointmentData } from '@/context/ProffesorAppointMentContext';
import { ProfessorContextProvider, useProfessorContext } from '@/context/ProffesorAppointMentContext';
import { StudentContextProvider } from '@/context/StudentAppointmentContext';
import { MdOutlineInfo } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { convertTo12Hour } from '@/lib/timeFormatter'

export default function Appointment(){
  const { role } = useAuthContext();


  switch (role){
    case 'student':
      return (
        <div>
          <StudentContextProvider>
          <SentAppointments />
          </StudentContextProvider>
        </div>
      );

    case 'professor':
      return(
        <div>
            <ProfessorContextProvider>
              <ReceivedAppointments />
            </ProfessorContextProvider>
        </div>
      );
      
    default:
      return (
        <div>
          LOADING...
        </div>
      );
  }

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
        border-highlight border-2 border-solid rounded-md
        sm:p-6'
      >
        {/* message for empty apppointments */}
        {appointments?.length === 0 && (
          <div
            className='text-xl text-text-muted('
          >
            You haven&lsquo;t recieve any appointments yet            
          </div>
        )}

        {appointments?.map((appointment, index) =>
          <AppointmentCard
            key={index}
            appointment={appointment}
            index={index}
          />)}
      </div>

      <ConfirmationDialog/>
      <DeclineDialog/>
      <InfoDialog/>
    </div>
  );
}

//div for each appointment
function AppointmentCard({appointment, index}: {
  appointment: appointmentData
  index: number
}){
  const { status, name, day_of_week, start_time, end_time, appointment_id, time_stamp } = appointment;
  const timeStampDisplay = time_stamp ? new Date(time_stamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const {
    setAppointmentId,
    confirmDialogRef,
    setSelectedAppointment,
    setSelectedIndex,
    declineDialogRef,
    infoDialogRef
  } = useProfessorContext();
  return (
    <div
      className='border-b-highlight-muted border-b-2 border-solid
      sm:rounded-2xl sm:py-4 sm:pr-8 sm:pl-4 sm:gap-4
      w-full m-4
        flex flex-row'
    >
      {/* left side, contatins info button */}
      <div className='flex-row-center'>
        <button
          onClick={handeInfoButton}
          className='hover:bg-primary p-2 rounded-full hover:[&>svg]:fill-black
          duration-200 [&>svg]:duration-200'
        >
          <MdOutlineInfo
            className='text-2xl'
          />
        </button>
      </div>

      {/* right side, main content */}
      <div
        className='flex-1 flex flex-col 
        sm:min-w-[17rem]'
      >
          <p className='font-bold'>
            {name}
          </p>

          <p className='text-sm text-text-muted'>
            {timeStampDisplay}
          </p>
        <div 
          className='flex flex-row justify-between *:text-text-muted
          border-t-highlight-muted border-t-[1px] borderl-solid
          sm:mt-2'
        >
          <p>{day_of_week}</p>
          <p>{convertTo12Hour(start_time)}</p>
          <p>{convertTo12Hour(end_time)}</p>
        </div>
      </div>

      <div
        className="flex flex-row ml-10 flex-1 gap-4 justify-end
        *:rounded-md *:duration-500
        *:hover:text-text-muted
        [&_button]:p-2"
      >
        {status === "pending" && <AcceptButton/>}
        <DeclineButton/>
      </div>
    </div>

);

  function AcceptButton(){
    return (
      <div>
        <button
          onClick={handleAccept}
          className='border-green-600 border-2 border-solid rounded-md
            bg-green-950'
        >
          Accept
        </button>
      </div>
    );

  }

  function DeclineButton(){
    return (
      <div>
        <button
          onClick={handleDecline}
          className='border-red-600 border-2 border-solid rounded-md
            bg-red-950'
        >
          {status === "pending" ?"Decline":"Delete"}
        </button>
      </div>
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

  function handeInfoButton(){
    if(setAppointmentId && setSelectedAppointment && setSelectedIndex && infoDialogRef){
      setAppointmentId(appointment_id || -1);
      setSelectedAppointment(appointment);
      setSelectedIndex(index);
      infoDialogRef.current?.showModal();
    }
  }
}

//pop up for accepting an appointment
function ConfirmationDialog(){
  const { confirmDialogRef, selectedIndex, setAppointments, appointmentId, selectedAppointment } = useProfessorContext();
  const {name, time_stamp, message, start_time, end_time} = selectedAppointment || {};
  const selected_date = selectedAppointment? new Date(time_stamp || '') : null;
  const display_date = selected_date?.toLocaleDateString('en-US',{
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <dialog 
      ref={confirmDialogRef}
      className='sm:open:px-5 sm:open:pt-2 sm:open:w-[30rem]'
    >
      <div
        className='flex flex-col justify-center items-center w-full rounded-md p-4'
      >
          <div className='text-left space-y-2 mb-2'>
            <p>From: {name}</p>
            <p>Purpose: {message}</p>
            <p>Time: {convertTo12Hour(start_time)} - {convertTo12Hour(end_time)}</p>
            <p>Date: {display_date}</p>
            <DatePicker
              selected={selected_date}
              disabled
              inline
              dateFormat="MMMM d, yyyy"
            />
          </div>
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
        className='flex flex-col justify-center items-center w-full rounded-md p-4 text-center'
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
        return;
      }
      alert(response.message);
    } catch (error) {
      console.error(error);
    }
  }
}

function InfoDialog(){
  const { infoDialogRef, selectedAppointment, setSelectedAppointment, setSelectedIndex } = useProfessorContext();
  const {message, name, time_stamp, start_time, end_time} = selectedAppointment || {};
  const dateString = new Date(time_stamp || '').toLocaleDateString('en-US',{
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <dialog ref={infoDialogRef}
      className='open:px-6 open:pb-6 open:pt-4'
    >
      <div
        className='flex flex-col justify-center items-start w-full
        sm:gap-2'
      >
        <div className='w-full text-right'>
          <button>
            <IoIosCloseCircleOutline
              className='text-2xl fill-red-700'
              onClick={handleClose}
            />
          </button>
        </div>
        <p>Name:&nbsp; {name}</p>
        <p>Message: &nbsp; {message}</p>
        <p>Date: &nbsp; {dateString}</p>
        <p>Time: &nbsp; {convertTo12Hour(start_time)} - {convertTo12Hour(end_time)}</p>
      </div>
    </dialog>
  );

  function handleClose(){
    infoDialogRef?.current?.close();
    if(setSelectedIndex){
      setSelectedIndex(-1);
    }
  }
}
