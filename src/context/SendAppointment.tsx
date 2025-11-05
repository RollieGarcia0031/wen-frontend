"use client"

import { useContext, createContext, useState } from "react";

interface Props {
  /**
   * Information about the target pofessor,
   * this will be used to display information about
   * who they teach, and this will serve as basis for
   * availability prior to sending an appointment
   */
  userInfo: search_professor_user_response_item;
  setUserInfo: React.Dispatch< React.SetStateAction< search_professor_user_response_item> >;

  /**
   * The selected date of student
   * This date will be the exact date on when the student
   * will request the appointment
   */
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch< React.SetStateAction<Date | null> >;
}

const Context = createContext<Props>({

  userInfo: {
    id: '',
    email: '',
    name: 'Name',
    classes: [],
    availabilities: []
  },

  setUserInfo: function(arg){arg},

  selectedDate: new Date(),
  setSelectedDate: ()=>{}
});

/**
 * This Context provider will be used for student users
 * to send appointments to a certain professor
 */
export function SendAppointmentContextProvider({children}:{
  children: React.ReactNode
}) {
 
  const [ userInfo, setUserInfo ] = useState<search_professor_user_response_item>({
    availabilities: [],
    classes: [],
    name: 'loading',
    email: '',
    id: ''
  });

  const [ selectedDate, setSelectedDate ] = useState<Date | null>(new Date());

  return (
    <Context.Provider value={{
      userInfo,
      setUserInfo,
      selectedDate,
      setSelectedDate
    }}>
      {children}
    </Context.Provider>
  );
}

/**
 * - Provides information about the target professor
 */
export const useSendAppointment = () => useContext(Context);
