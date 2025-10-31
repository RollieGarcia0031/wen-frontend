"use client"

import { createContext, SetStateAction, useContext, useState } from "react"

type AvailabilityItem = {
  day_of_week: number;
  time_start: string;
  time_end: string;
}

interface AvailabilityProps {
  availabilityList: AvailabilityItem[];
  setAvailabilityList: React.Dispatch< SetStateAction<AvailabilityItem[]> > 
}

const AvailabilityContext = createContext<AvailabilityProps>({
  availabilityList: [],
  setAvailabilityList: () => {} 
});

export function AvailabilityContextProvider({children}:{
  children: React.ReactNode
}){
 
  const [ availabilityList, setAvailabilityList ] = useState<AvailabilityItem[]>([]);

  return (
    <AvailabilityContext.Provider
      value={{availabilityList, setAvailabilityList}}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailabilityContext(){
  return useContext(AvailabilityContext);
}
