"use client"

import fetchBackend from "@/lib/fetchBackend";
import { createContext, SetStateAction, useContext, useEffect, useState } from "react"

export interface AvailabilityItem {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

/**
 * Contains the temporary custom avaiability
 * Used to update UI, while user haven't decided
 * weather to delete or remove the custom
 * availability
 */
export interface TemporaryAvailabilityItem {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface AvailabilityProps {
  availabilityList: AvailabilityItem[];
  setAvailabilityList: React.Dispatch< SetStateAction<AvailabilityItem[]> >;
  fetchAvailabilityList: (arg: any) => Promise<void>,

  temporaryAvailabilityList: TemporaryAvailabilityItem[];
  setTemporaryAvailabilityList: React.Dispatch<SetStateAction<TemporaryAvailabilityItem[]>>
}

const AvailabilityContext = createContext<AvailabilityProps>({
  availabilityList: [],
  setAvailabilityList: () => {},
  fetchAvailabilityList: (arg) => arg,

  temporaryAvailabilityList: [],
  setTemporaryAvailabilityList: (arg) => arg
});

export function AvailabilityContextProvider({children}:{
  children: React.ReactNode
}){
 
  const [ availabilityList, setAvailabilityList ] = useState<AvailabilityItem[]>([]);
  const [ temporaryAvailabilityList, setTemporaryAvailabilityList ] = useState<TemporaryAvailabilityItem[]>([]);

  useEffect(()=>{
    fetchAvailabilityList(setAvailabilityList);
  },[])

  return (
    <AvailabilityContext.Provider
      value={{
        availabilityList, setAvailabilityList,
        fetchAvailabilityList,
        temporaryAvailabilityList, setTemporaryAvailabilityList
      }}
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
