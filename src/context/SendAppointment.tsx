"use client"

import { useContext, createContext, useState, Dispatch, SetStateAction } from "react";

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

  /**
   * The selected availability, serving as the selected time range by the
   * user
   */
  selectedAvailability: search_professor_user_availability | null;
  setSelectedAvailability: React.Dispatch< React.SetStateAction<search_professor_user_availability | null> >;

  /**
   * The full personal information on the target professor
   */
  fullInfo: info_professor_response_item;
  setFullInfo: Dispatch<SetStateAction<info_professor_response_item>>;
}

const fullInfoInitial: info_professor_response_item = {
  bio: "",
  birthday: "",
  cellphone_number: "",
  department_code: "",
  department_name: "",
  email: "",
  first_name: "",
  gender: 0,
  last_name: "",
  middle_name: "",
  sections: [],
  user_id: "",
  user_name: ""
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
  setSelectedDate: ()=>{},

  selectedAvailability: null,
  setSelectedAvailability: function(arg){arg},

  fullInfo: fullInfoInitial,
  setFullInfo: ()=>{}
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

  const [ fullInfo, setFullInfo ] = useState<info_professor_response_item>(fullInfoInitial);
  const [ selectedDate, setSelectedDate ] = useState<Date | null>(new Date());
  const [ selectedAvailability, setSelectedAvailability ] = useState<search_professor_user_availability | null>(null);
  return (
    <Context.Provider value={{
      userInfo,
      setUserInfo,
      selectedDate,
      setSelectedDate,
      selectedAvailability,
      setSelectedAvailability,
      fullInfo,
      setFullInfo
    }}>
      {children}
    </Context.Provider>
  );
}

/**
 * - Provides information about the target professor
 */
export const useSendAppointment = () => useContext(Context);
