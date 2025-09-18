"use client";
import React, {useState, useContext, createContext, useRef} from 'react';
import { SearchProfessorResponseDataItem } from '@/lib/response';
import { appointmentData } from '@/context/ProffesorAppointMentContext';

interface StudentContextProps {
    nameInput: string;
    setNameInput: React.Dispatch<React.SetStateAction<string>>;
    dialogRef?: React.RefObject<HTMLDialogElement | null>;
    professors: SearchProfessorResponseDataItem[];
    setProfessors: React.Dispatch<React.SetStateAction<SearchProfessorResponseDataItem[]>>;
    sentAppointments: appointmentData[];
    setSentAppointments: React.Dispatch<React.SetStateAction<appointmentData[]>>;
    infoDialogRef?: React.RefObject<HTMLDialogElement | null>;
}

const StudentContext = createContext<StudentContextProps>({
    nameInput: "",
    setNameInput: () => {return;},
    professors: [],
    setProfessors: () => {return;},
    sentAppointments: [],
    setSentAppointments: () => {return;},
});

export function StudentContextProvider({children}: {children: React.ReactNode}){
    //name input for searching professors
    const [nameInput, setNameInput] = useState<string>("");
    //dialog for adding a new appointment
    const dialogRef = useRef<HTMLDialogElement>(null);
    //professors that have been fetched as search result
    const [professors, setProfessors] = useState<SearchProfessorResponseDataItem[]>([]);
    //appointments that have been fetched as sent by the logged student
    const [sentAppointments, setSentAppointments] = useState<appointmentData[]>([]);
    //ref for information dialog, to see and edit appointment
    const infoDialogRef = useRef<HTMLDialogElement>(null);

    return (
        <StudentContext.Provider value={{
            nameInput,
            setNameInput,
            dialogRef,
            professors,
            setProfessors,
            sentAppointments,
            setSentAppointments,
            infoDialogRef
        }}
        >
            {children}
        </StudentContext.Provider>
    );
}

export function useStudentAppointmentContext(){
    return useContext(StudentContext);
}