import fetchBackend from "@/lib/fetchBackend";
import { useContext, createContext, useState, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

interface AppointmentProps {
  /**
   * State for UI to determine weather to render
   * the search dialog
   */
  searchDialogOpened: boolean;
  /**
   * Control the visilibility of search dialog
   * to search for professors
   */
  setSearchDialogOpened: Dispatch<SetStateAction<boolean>>;

  /**
   * Contains list of fetched appointments sent by the
   * logged user
   */
  sentAppointments: appointment_list_response_item[];
  setSentAppointments: Dispatch<SetStateAction<appointment_list_response_item[]>>;
}

const AppointmentContext = createContext<AppointmentProps>({
  searchDialogOpened: false,
  setSearchDialogOpened: (arg: any) =>{},

  sentAppointments: [],
  setSentAppointments: (arg: any) => {} 
});

export function AppointmentContextProvider({children}: {
  children: React.ReactNode
}){

  const [ searchDialogOpened, setSearchDialogOpened ] = useState(false);
  const [ sentAppointments, setSentAppointments ] = useState<appointment_list_response_item[]>([]);
  return (
    <AppointmentContext.Provider
      value={{
        setSearchDialogOpened,
        searchDialogOpened,
        sentAppointments,
        setSentAppointments
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );

}

/**
 * Reset the state of the list of sent appointments
 */
export async function refreshSentAppointments(
  setState: Dispatch<SetStateAction<appointment_list_response_item[]>>
){
  const response = await fetchBackend('appointment/list',{
    method: "POST",
    headers: { 'Content-Type' : 'application/json' }
  });

  const { data, message } = await response.json() as appointment_list_response;

  if (!response.ok) return toast.error(message);
  const { items } = data;

  setState(items);
}

export const useAppointment = () => useContext(AppointmentContext);
