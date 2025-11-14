"use client"

import { createContext, useContext, useState, Dispatch, SetStateAction } from "react"

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

export function DashoardContextProvider({children}:{
  children: React.ReactNode
}){

  const [ upComingCount, setUpcomingCount ] = useState<appointment_count_response_item[]>([]);
  const [ todayCount, setTodayCount ] = useState<appointment_count_response_item[]>([]);
  const [ weeklyCount, setWeeklyCount ] = useState<appointment_count_response_item[]>([]);

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
