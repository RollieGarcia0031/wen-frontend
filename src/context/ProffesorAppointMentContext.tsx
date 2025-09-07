import { createContext, useContext, useState, useRef } from "react";

interface ProfessorContextProps {

}

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

const ProfessorContext = createContext<ProfessorContextProps | null>(null);

export default function ProfessorContextProvider({children}: {children: React.ReactNode}){
    const [appointments, setAppointments] = useState<appointmentData[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<appointmentData | null>(null);
    const [appointmentId, setAppointmentId] = useState<number>(0);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const confirmDialogRef = useRef<HTMLDialogElement>(null);

    return (
        <ProfessorContext.Provider value={{}}>
            {children}
        </ProfessorContext.Provider>
    );
}