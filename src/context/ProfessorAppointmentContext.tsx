"use client"

import fetchBackend from "@/lib/fetchBackend";
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react"
import { toast } from "react-toastify";

type appointmentDispatch = Dispatch<SetStateAction<appointment_list_response_item[]>>;

interface ProfAppointmentContextProps {
  /**
   * Array of recieved appointments by the logged user
   */
  recievedAppointments: appointment_list_response_item[];
  setRecievedAppointments: appointmentDispatch;

  /**
   * Selected ID of the appointment,
   * used in delete and update operations
   */
  selectedAppointmentId: number;
  setSelectedAppointmentId: Dispatch<SetStateAction<number>>;

  /**
   * State for opening option dialog in declining/accepting
   * appointments
   */
  mainDialogOpened: boolean;
  setMainDialogOpened: Dispatch<SetStateAction<boolean>>;

  /**
   * Option mode for user, reflects how click event on
   * the appointment cards will behave
   */
  selectionOption: number;
  setSelectionOption: Dispatch<SetStateAction<number>>;

  /**
   * Array of selected appointment ids
   * Useful for operations requiring multiple selection
   */
  selectedIds: number[]
  setSelectedIds: Dispatch<SetStateAction<number[]>>;
}

const Context = createContext<ProfAppointmentContextProps>({
  recievedAppointments: [],
  setRecievedAppointments: ()=>{},

  selectedAppointmentId: -1,
  setSelectedAppointmentId: ()=>{},

  mainDialogOpened: false,
  setMainDialogOpened: ()=>{},

  selectionOption: 0,
  setSelectionOption: ()=>{},

  selectedIds: [],
  setSelectedIds: ()=>{}
});

export function ProfAppointmentContextProvider({children}:{
  children: React.ReactNode
}){
  const [ mainDialogOpened, setMainDialogOpened ] = useState(false);
  const [ selectedAppointmentId, setSelectedAppointmentId ] = useState(-1);
  const [ recievedAppointments, setRecievedAppointments ] = useState<appointment_list_response_item[]>([]);
  const [ selectionOption, setSelectionOption ] = useState(0);
  const [ selectedIds, setSelectedIds ] = useState<number[]>([]);

  return (
    <Context.Provider
      value={{
        recievedAppointments,
        setRecievedAppointments,
        selectedAppointmentId,
        setSelectedAppointmentId,
        mainDialogOpened,
        setMainDialogOpened,
        selectionOption,
        setSelectionOption,
        selectedIds,
        setSelectedIds

      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useProfAppointment = ()=> useContext(Context);

/**
 * Fetches the appointments recieved by the logged user
 */
export async function fetchRecievedAppointments(setRecievedAppointments: appointmentDispatch){

  try {

    const response = await fetchBackend("appointment/list",{
      method: "POST",
      headers: { 'Content-Type' : 'application/json' }
    });

    const { data, success } = await response.json() as appointment_list_response;

    if (!success) throw new Error("Request Failed");

    const { items } = data;
    setRecievedAppointments(items);
  } catch (error) {
    toast.error("Unexpected error occured");
  }
}
