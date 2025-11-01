"use client"

import fetchBackend from "@/lib/fetchBackend";
import { createContext, SetStateAction, useContext, useEffect, useState } from "react"

export interface AvailabilityItem {
  day_of_week: number;
  start_time: string;
  end_time: string;
  /**
   * A property that is not applied to fetched availability
   * but will be used as temporary attribute, so the system
   * will be able to determine if the part of list is saved
   * in database or saved in buffer
   *
   * While in artificial = true, the UI will display that item
   * differently so user knows which is from database, which is
   * made-up
   */
  artificial: boolean;
}

interface AvailabilityProps {
  availabilityList: AvailabilityItem[];
  setAvailabilityList: React.Dispatch< SetStateAction<AvailabilityItem[]> >;
  fetchAvailabilityList: (arg: any) => Promise<void>
}

const AvailabilityContext = createContext<AvailabilityProps>({
  availabilityList: [],
  setAvailabilityList: () => {},
  fetchAvailabilityList: (arg) => arg
});

export function AvailabilityContextProvider({children}:{
  children: React.ReactNode
}){
 
  const [ availabilityList, setAvailabilityList ] = useState<AvailabilityItem[]>([]);

  useEffect(()=>{
    fetchAvailabilityList(setAvailabilityList);
  },[])

  return (
    <AvailabilityContext.Provider
      value={{availabilityList, setAvailabilityList, fetchAvailabilityList}}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

/**
 * Retrieve the availability of user from the availability table 
 */
const fetchAvailabilityList = async (
    setAvailabilityList: React.Dispatch<SetStateAction<AvailabilityItem[]>>
): Promise<void> =>
{
  const response = await fetchBackend("availability/list", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!response.ok) return;

  const { success, data } = await response.json() as common_response;

  if (!success){
    return;
  }
  
  setAvailabilityList(data);
}


export function useAvailabilityContext(){
  return useContext(AvailabilityContext);
}
