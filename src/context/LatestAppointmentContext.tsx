import { createContext, useState, useRef, useContext, useEffect } from "react";
import { fetchBackend } from "@/lib/api";

export interface AppointmentContextProps {
  latestAppointments: LatestAppointment[];
  setLatestAppointments: React.Dispatch<React.SetStateAction<LatestAppointment[]>>;
  selectedIndexOfLatestAppointment: number;
  setSelectedIndexOfLatestAppointment: React.Dispatch<React.SetStateAction<number>>;
  removeDialogRef: React.RefObject<HTMLDialogElement | null> | null;
  currentAppointmentCount: CurrentAppointmentCountData[];
  setCurrentAppointmentCount: React.Dispatch<React.SetStateAction<CurrentAppointmentCountData[]>>
}

const LatestAppointmentContext = createContext<AppointmentContextProps>({
  latestAppointments: [],
  setLatestAppointments: () => {},
  selectedIndexOfLatestAppointment: -1,
  setSelectedIndexOfLatestAppointment: () => {},
  removeDialogRef: null,
  currentAppointmentCount: [{count:0, status:""}],
  setCurrentAppointmentCount: () => {},
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

export interface CurrentAppointmentCountData {
  count: number
  status: string
}

export function LatestAppointmentContextProvider({children}: {children: React.ReactNode}){
    // list of current appointments
    const [latestAppointments, setLatestAppointments] = useState<LatestAppointment[]>([]);
    // selected index, used for dialog to know which index of appointments[] to update
    const [selectedIndexOfLatestAppointment, setSelectedIndexOfLatestAppointment] = useState<number>(-1);
    // dialog for removing an appointment
    const removeDialogRef = useRef<HTMLDialogElement | null>(null);

    // count of current appointments both confirmed and pending
    const [
      currentAppointmentCount,
      setCurrentAppointmentCount
    ] = useState<CurrentAppointmentCountData[]>([]);

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

      const fetchCurrentAppointmentCount = async () =>  {
          const body = { time_range: "today" };

          try{
              const currentAppointmentCount = await fetchBackend(
                "appointment/groupedCount",
                "POST",
                JSON.stringify(body),
                new Headers({"Content-Type": "application/json"})
              );

              const {data, success} = currentAppointmentCount;
              if(!data || !success) return;

              setCurrentAppointmentCount(x => data);
          } catch (err){
              console.error(err)
          }
      }

      fetchCurrentAppointmentCount();
    }, []);

    return(
        <LatestAppointmentContext.Provider
            value={{
                latestAppointments,
                setLatestAppointments,
                selectedIndexOfLatestAppointment,
                setSelectedIndexOfLatestAppointment,
                removeDialogRef,
                currentAppointmentCount,
                setCurrentAppointmentCount
            }}
        >
            {children}
        </LatestAppointmentContext.Provider>
    );
}

export function useLatestAppointmentContext() {
  return useContext(LatestAppointmentContext);
}
