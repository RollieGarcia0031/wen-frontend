import fetchBackend from "@/lib/fetchBackend";
import fetchAppointments from "@/util/fetchAppointments";
import { useContext, createContext, useState, Dispatch, SetStateAction, use, useEffect, useRef } from "react";
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

  fetchMoreAppointment: () => Promise<void>;
  searchFilter: React.RefObject<SearchFilter>;
}

const AppointmentContext = createContext<AppointmentProps>({
  searchDialogOpened: false,
  setSearchDialogOpened: (arg: any) =>{},

  sentAppointments: [],
  setSentAppointments: (arg: any) => {},

  fetchMoreAppointment: async () => {},
  searchFilter: {current: {  }}
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
  const [ nextId, setNextId ] = useState(0);
  const [ nextDate, setNextDate ] = useState('0');

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
    if (isLoading || !hasNext || nextId === null || nextDate === null) return;

    try {
      setIsLoading(true);
      const response = await fetchAppointments(nextId, nextDate, searchFilter.current);

      const {
        data: {
          items,
          next_cursor: {cursor_date, cursor_id}
        },
        message
      } = await response.json() as appointment_list_response;

      if (!response.ok) throw new Error(message || "Cannot get appointments");

      setSentAppointments(prev =>
        [...prev, ...items]
      );

      setHasNext(items.length === 10 || cursor_date === null);
      setNextDate(cursor_date);
      setNextId(cursor_id);

      console.log(cursor_id, cursor_date);

    } catch (error) {
      console.error(error);
      if (error instanceof Error) 
        toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMoreAppointment();
  }, []);

  return (
    <AppointmentContext.Provider
      value={{
        setSearchDialogOpened,
        searchDialogOpened,
        sentAppointments,
        setSentAppointments,
        fetchMoreAppointment,
        searchFilter
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );

}

export const useAppointment = () => useContext(AppointmentContext);
