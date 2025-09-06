"use client";

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import SentAppointments from './StudentAppointments';
import { fetchBackend } from '@/lib/api';

export interface appointmentData {
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
    </div>
  );
}

function AppointmentCard({appointment}: {appointment: appointmentData}){
  const { status, name, day_of_week, start_time, end_time } = appointment;

  return (
    <div
      className='border-gray-500 border-2 border-solid rounded-md p-4 w-full m-4'
    >
      <div
        className='flex flex-row justify-start gap-6'
      >
        <p>{name}</p> <p>{status}</p>
      </div>
      <div 
        className='flex flex-row justify-between'
      >
        <p>{day_of_week}</p>
        <p>{start_time}</p>
        <p>{end_time}</p>
      </div>
    </div>
  );
}