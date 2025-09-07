"use client";

import { createContext, useContext, useState, useRef } from "react";

interface ProfessorContextProps {
    appointments?: appointmentData[],
    setAppointments?: React.Dispatch<React.SetStateAction<appointmentData[]>>
    selectedAppointment?: appointmentData | null,
    setSelectedAppointment?: React.Dispatch<React.SetStateAction<appointmentData | null>>,
    appointmentId?: number,
    setAppointmentId?: React.Dispatch<React.SetStateAction<number>>,
    selectedIndex?: number,
    setSelectedIndex?: React.Dispatch<React.SetStateAction<number>>,
    confirmDialogRef?: React.RefObject<HTMLDialogElement | null>,
    deleteDialogRef?: React.RefObject<HTMLDialogElement | null>
}

export interface appointmentData {
  appointment_id?: number,
  student_id?: number,
  professor_id?: number,
  status?: string,
  name?: string,
  day_of_week?: number,
  start_time?: string,
  end_time?: string
}

const ProfessorContext = createContext<ProfessorContextProps>({});

export function ProfessorContextProvider({children}: any){
    /**
     * appointments - contains received appointments
     * setAppointments - to update received appointments upon sucessful decline/accept user action
     * 
     * appointmentId - contains id of selected appointment
     * setAppointmentId - to update id of selected appointment, so dialog knows which appointment to update
     * 
     * selectedAppointment - contains selected appointment
     * setSelectedAppointment - to update selected appointment, baka next time ko lagyan extra details sa appointment
     * 
     * selectedIndex - contains index of selected appointment
     * setSelectedIndex - for dialog to know which index of appointments[] to update after sucessful accept/decline
     */
    const [appointments, setAppointments] = useState<appointmentData[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<appointmentData | null>(null);
    const [appointmentId, setAppointmentId] = useState<number>(0);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const confirmDialogRef = useRef<HTMLDialogElement>(null);
    const deleteDialogRef = useRef<HTMLDialogElement>(null);

    return (
        <ProfessorContext.Provider value={{
            appointments,
            setAppointments,
            selectedAppointment,
            setSelectedAppointment,
            appointmentId,
            setAppointmentId,
            selectedIndex,
            setSelectedIndex,
            confirmDialogRef,
            deleteDialogRef
        }}>
            {children}
        </ProfessorContext.Provider>
    );
}

export function useProfessorContext() {
  return useContext(ProfessorContext);
}