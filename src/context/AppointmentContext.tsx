import fetchAppointments from "@/util/fetchAppointments";
import { useContext, createContext, useState, Dispatch, SetStateAction } from "react";
import { useRef }from "react";

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

  fetchMoreAppointment: () => Promise<void>;
  searchFilter: React.RefObject<SearchFilter>;

  hasNext: boolean;
  isLoading: boolean;

  reset: () => void;
}



const AppointmentContext = createContext<AppointmentProps>({
  searchDialogOpened: false,
  setSearchDialogOpened: (arg: any) =>{},

  sentAppointments: [],
  setSentAppointments: (arg: any) => {},

  fetchMoreAppointment: async () => {},
  searchFilter: {current: {  }},

  hasNext: true,
  isLoading: false,

  reset: () => {}

});



export interface SearchFilter {
  status?: number,
  time_range?: string
}

export function AppointmentContextProvider({children}: {
  children: React.ReactNode
}){

  /**
   * State for UI to determine weather to render
   * the search dialog
   */
  const [ searchDialogOpened, setSearchDialogOpened ] = useState(false);
  
  /**
   * Contains list of fetched appointments sent by the
   * logged user
   */
  const [ sentAppointments, setSentAppointments ] = useState<appointment_list_response_item[]>([]);

  /**
   * Pagination cursors
   */
  const [ nextId, setNextId ] = useState<number>(0);
  const [ nextDate, setNextDate ] = useState<string>('0');

  /**
   * Pagination states
   */
  const [ hasNext, setHasNext ] = useState(true);
  const [ isLoading, setIsLoading ] = useState(false);

  /**
   * State for search filter
   */
  const searchFilter = useRef<SearchFilter>({});
  
  const fetchMoreAppointment = async () => {
    if (isLoading || !hasNext) return;

    try {
      setIsLoading(true);

      const response = await fetchAppointments(nextId, nextDate, searchFilter.current);
      const json = await response.json();

      if (!response.ok) throw new Error(json.message);

      const { items, next_cursor } = json.data;

      setSentAppointments(prev => [...prev, ...items]);
      setHasNext(!!next_cursor);
      setNextId(next_cursor?.cursor_id ?? null);
      setNextDate(next_cursor?.cursor_date ?? null);
      
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSentAppointments([]);
    setNextId(0);
    setNextDate("0");
    setHasNext(true);
  };


  return (
    <AppointmentContext.Provider
      value={{
        setSearchDialogOpened,
        searchDialogOpened,
        sentAppointments,
        setSentAppointments,
        fetchMoreAppointment,
        searchFilter,
        hasNext,
        isLoading,
        reset
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );

}

export const useAppointment = () => useContext(AppointmentContext);