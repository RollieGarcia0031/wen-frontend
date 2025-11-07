import { useContext, createContext, useState, Dispatch, SetStateAction } from "react";

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
  setSentAppointments: ()=>{}
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

export const useAppointment = () => useContext(AppointmentContext);
