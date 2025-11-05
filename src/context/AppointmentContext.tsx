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
  setSearchDialogOpened: Dispatch<SetStateAction<boolean>>
}

const AppointmentContext = createContext<AppointmentProps>({
  searchDialogOpened: false,
  setSearchDialogOpened: (arg: any) =>{} 
});

export function AppointmentContextProvider({children}: {
  children: React.ReactNode
}){

  const [ searchDialogOpened, setSearchDialogOpened ] = useState(false);

  return (
    <AppointmentContext.Provider
      value={{ setSearchDialogOpened, searchDialogOpened }}
    >
      {children}
    </AppointmentContext.Provider>
  );

}

export const useAppointment = () => useContext(AppointmentContext);
