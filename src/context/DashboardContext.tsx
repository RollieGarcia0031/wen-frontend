"use client"

import fetchBackend from "@/lib/fetchBackend";
import { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from "react"

interface DashboardContextProps {
  /**
   * Contains the count of appointment from today
   * to future target_dates
   */
  upComingCount: appointment_count_response_item[];
  setUpcomingCount: Dispatch<SetStateAction<appointment_count_response_item[]>>;

  /**
   * Contains count of appointment for the
   * current day only
   */
  todayCount: appointment_count_response_item[];
  setTodayCount: Dispatch<SetStateAction<appointment_count_response_item[]>>;

  /**
   * Contains count of appointments for the current
   * week, from current day to upcoming sunday
   */
  weeklyCount: appointment_count_response_item[];
  setWeeklyCount: Dispatch<SetStateAction<appointment_count_response_item[]>>;
}

const Context = createContext<DashboardContextProps>({
  upComingCount: [],
  setUpcomingCount: ()=>{},

  todayCount: [],
  setTodayCount: ()=>{},

  weeklyCount: [],
  setWeeklyCount: ()=>{}
});

export function DashboardContextProvider({children}:{
  children: React.ReactNode
}){

  const [ upComingCount, setUpcomingCount ] = useState<appointment_count_response_item[]>([]);
  const [ todayCount, setTodayCount ] = useState<appointment_count_response_item[]>([]);
  const [ weeklyCount, setWeeklyCount ] = useState<appointment_count_response_item[]>([]);

  useEffect(() => {

    refreshCounter('tomorrow', setUpcomingCount);
    refreshCounter('today', setTodayCount);
    refreshCounter('this_week', setWeeklyCount);

  }, []);

  return (
    <Context.Provider
      value={{
        upComingCount,
        setUpcomingCount,
        todayCount,
        setTodayCount,
        weeklyCount,
        setWeeklyCount
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useDashboard = () => useContext(Context);

/**
 * refresh the counters of dashboard
 *
 * @param time_range - time range of appointment counts, it can be the current day or week
 * @param setCounter - the state to be updated
 */
export async function refreshCounter(
  time_range: TimeRange,
  setCounter: Dispatch<SetStateAction<appointment_count_response_item[]>>
){
  const body = { time_range };

  try {

    const response = await fetchBackend("appointment/count",{
      method: "POST",
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`Failed at ${time_range}`);
    const { data } = await response.json() as appointment_count_response;

    setCounter(data || []);

  } catch (error){
    console.error(error);
  }
}
