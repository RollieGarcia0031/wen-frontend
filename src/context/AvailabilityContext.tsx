"use client"

import fetchBackend from "@/lib/fetchBackend";
import { createContext, SetStateAction, useContext, useEffect, useState } from "react"

export interface AvailabilityItem {
  day_of_week: number;
  start_time: string;
  end_time: string;
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
