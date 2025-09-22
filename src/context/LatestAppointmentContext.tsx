import { createContext, useState, useRef, useContext, useEffect } from "react";
import { fetchBackend } from "@/lib/api";

export interface AppointmentContextProps {
  latestAppointments: LatestAppointment[];
  setLatestAppointments: React.Dispatch<React.SetStateAction<LatestAppointment[]>>;
  selectedIndexOfLatestAppointment: number;
  setSelectedIndexOfLatestAppointment: React.Dispatch<React.SetStateAction<number>>;
  removeDialogRef: React.RefObject<HTMLDialogElement | null> | null;
}

const LatestAppointmentContext = createContext<AppointmentContextProps>({
  latestAppointments: [],
  setLatestAppointments: () => {},
  selectedIndexOfLatestAppointment: -1,
  setSelectedIndexOfLatestAppointment: () => {},
  removeDialogRef: null,
});

export interface LatestAppointment {
  id: number;
  student_id: number;
  professor_id: number;
  availability_id: number;
  status: string;
  message: string;
  time_stamp: string;
  created_at: string;
  updated_at: string;
  name: string;
  start_time: string;
};

export function LatestAppointmentContextProvider({children}: {children: React.ReactNode}){
    // list of current appointments
    const [latestAppointments, setLatestAppointments] = useState<LatestAppointment[]>([]);
    // selected index, used for dialog to know which index of appointments[] to update
    const [selectedIndexOfLatestAppointment, setSelectedIndexOfLatestAppointment] = useState<number>(-1);
    // dialog for removing an appointment
    const removeDialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(()=>{
    const fetchLatestAppointments = async () =>  {
        try{
            const latestAppointments = await fetchBackend("appointment/currentDayBooked", "GET");
            if(!latestAppointments.data) return;

            setLatestAppointments(x => [...latestAppointments.data]);
        } catch (err){
            console.error(err)
        }
    }
    
    fetchLatestAppointments();
    }, []);

    return(
        <LatestAppointmentContext.Provider
            value={{
                latestAppointments,
                setLatestAppointments,
                selectedIndexOfLatestAppointment,
                setSelectedIndexOfLatestAppointment,
                removeDialogRef
            }}
        >
            {children}
        </LatestAppointmentContext.Provider>
    );
}

export function useLatestAppointmentContext() {
  return useContext(LatestAppointmentContext);
}