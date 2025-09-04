"use client";

import {use} from 'react';

export default function SendAppointment({params}: {
  params : Promise<{id: number}>
}) {

  const { id } = use(params);
  return (
    <div>
      <h1>Send Appointment</h1>
      <p>{id}</p>
    </div>
  );
}