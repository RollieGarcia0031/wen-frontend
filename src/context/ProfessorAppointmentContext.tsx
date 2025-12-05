"use client"

import fetchBackend from "@/lib/fetchBackend";
import fetchAppointments from "@/util/fetchAppointments";
import { createContext, useContext, useState, Dispatch, SetStateAction, useRef, useEffect, RefObject, useCallback } from "react"
import { toast } from "react-toastify";
import { SearchFilter } from "./AppointmentContext";

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

  /**
   * Hooks for pagination
   */
  loaderRef: React.RefObject<HTMLDivElement | null>;
  observerRef: React.RefObject<IntersectionObserver | null>;
  fetchMoreAppointments: () => Promise<void>;
  hasNext: boolean;
  isLoading: boolean;

  /**
   * Remove all search results
   */
  resetAll: () => void;

  searchFilter: SearchFilter;
  setSearchFilter: Dispatch<SetStateAction<SearchFilter>>;
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
  setSelectedIds: ()=>{},

  fetchMoreAppointments: async ()=>{},
  loaderRef: { current: null },
  observerRef: { current: null },

  hasNext: true,
  isLoading: false,

  resetAll: ()=>{},

  searchFilter: {time_range: 'all'},
  setSearchFilter: ()=>{}
});

export function ProfAppointmentContextProvider({children}:{
  children: React.ReactNode
}){
  const [ mainDialogOpened, setMainDialogOpened ] = useState(false);
  const [ selectedAppointmentId, setSelectedAppointmentId ] = useState(-1);
  const [ recievedAppointments, setRecievedAppointments ] = useState<appointment_list_response_item[]>([]);
  const [ selectionOption, setSelectionOption ] = useState(0);
  const [ selectedIds, setSelectedIds ] = useState<number[]>([]);

  const [ nextCursor, setNextCursor ] = useState(0);
  const [ nextDate, setNextDate ] = useState('0');
  const [ hasNext, setHasNext ] = useState(true);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ searchFilter, setSearchFilter ] = useState<SearchFilter>(()=>{
    if (typeof window !== 'undefined') {
      const savedFilter = localStorage.getItem('professorSearchFilter');
      return savedFilter ? JSON.parse(savedFilter) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('professorSearchFilter', JSON.stringify(searchFilter));
    }
    resetAll();
  }, [searchFilter]);

  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchMoreAppointments = useCallback(async () => {
    if (!hasNext || isLoading) return;

    try {
      setIsLoading(true);

      const response = await fetchAppointments( nextCursor, nextDate, searchFilter);

      const { data, message } = await response.json() as appointment_list_response;

      if (!response.ok) throw new Error(message);

      setRecievedAppointments(prev => {
        const newItems = data.items.filter(newItem => !prev.some(existingItem => existingItem.id === newItem.id));
        return [...prev, ...newItems];
      });
      setHasNext(!!data.next_cursor);
      setNextCursor(data.next_cursor?.cursor_id ?? 0);
      setNextDate(data.next_cursor?.cursor_date ?? '0');

    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [hasNext, isLoading, nextCursor, nextDate, searchFilter, setRecievedAppointments, setHasNext, setNextCursor, setNextDate, setIsLoading]);

  const fetchFirst = useCallback(async () => {
    // If hasNext is false, it means we've already fetched all available items.
    // If isLoading is true, a fetch operation is already in progress.
    // In either case, we should not proceed with a new fetch.
    if (isLoading || !hasNext) return;

    try {
      setIsLoading(true);

      const response = await fetchAppointments( 0, '0', searchFilter);

      const { data, message } = await response.json() as appointment_list_response;
      console.log(data);

      if (!response.ok) throw new Error(message);

      setRecievedAppointments(data.items.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      ));
      setHasNext(!!data.next_cursor);
      setNextCursor(data.next_cursor?.cursor_id ?? 0);
      setNextDate(data.next_cursor?.cursor_date ?? '0');

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, searchFilter, setRecievedAppointments, setHasNext, setNextCursor, setNextDate, setIsLoading]);

  const resetAll = useCallback(() => {
    setRecievedAppointments([]);
    setNextCursor(0);
    setNextDate('0');
    setHasNext(true);
    setIsLoading(false);
    fetchFirst();
  }, [fetchFirst, setHasNext, setIsLoading, setNextCursor, setNextDate, setRecievedAppointments]);

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
        setSelectedIds,
        loaderRef,
        observerRef,
        fetchMoreAppointments,
        hasNext,
        isLoading,
        resetAll,
        searchFilter,
        setSearchFilter
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

