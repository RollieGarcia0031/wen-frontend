"use client";

import {use} from 'react';

export default function SendAppointment({params}: {
  params : Promise<{id: string}>
}) {

  const { id } = use(params);
  return (
    <div>
      <h1>Send Appointment</h1>

    </div>
  );
}