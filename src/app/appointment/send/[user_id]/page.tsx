"use client"

import Link from "next/link";
import fetchBackend from "@/lib/fetchBackend";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { useSendAppointment, SendAppointmentContextProvider } from "@/context/SendAppointment";
import { IoMdReturnLeft } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Main () {
  return (
    <SendAppointmentContextProvider>
      <div
        className="flex-cc"
      >
        <SendAppointment />
      </div>
    </SendAppointmentContextProvider>
  );
}

export function SendAppointment(){
  
  const { user_id } = useParams();

  const { setUserInfo } = useSendAppointment();

  useEffect(()=>{

    const fetchUserInfo = async () => {

      const reqBody = {
        professor_user_id: user_id
      }

      const response = await fetchBackend("search/professor/user", {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(reqBody)
      });

      if (!response.ok) return;

      const {data} = await response.json() as search_professor_user_response;

      if (data.length > 1) return; // make sure only one user exists

      setUserInfo(data[0]);
    }

    fetchUserInfo();
  }, []);

  return (
    <div
      className="grid grid-rows-[auto_auto_1fr]
      card w-[50rem] p-4 space-y-4 min-h-[80dvh]"
    >

      <div>
        <button className="bg-highlight p-1 rounded-full
        [&_svg]:fill-black [&_svg]:text-2xl"
        >
          <Link href='/appointment'>
            <IoMdReturnLeft /> 
          </Link>
        </button>
      </div>

      <SendAptHeader />

      <div
        className="grid grid-cols-2 justify-items-center"
      >
        <CalendarInput />

        <div>
          <TimeOptions />
        </div>

      </div>
    </div>
  );

}

/**
 * Contains general information about the target professor
 */
function SendAptHeader(){
  const { userInfo } = useSendAppointment();

  return (
    <div
      className=""
    >
      <p
        className="text-4xl font-bold"
      >
        {userInfo.name}
      </p>

    </div>
  );
}

/**
 * Takes the date input of user
 */
function CalendarInput(){
  const { setSelectedDate, selectedDate } = useSendAppointment();

  return (
    <div>

      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        inline
      />

    </div>
  );

}

/**
 * Shows the available time on the professor based on the
 * selected date from CalenderInput
 */
function TimeOptions(){
  const { userInfo: { availabilities }, selectedDate } = useSendAppointment();
  
  const newAvailabilities = useRef<search_professor_user_availability[]>(null);

  useEffect( () => {

    newAvailabilities.current = availabilities?.filter(item => {
      const inputDayOfWeek = selectedDate?.getDay();

      return item.day_of_week === inputDayOfWeek;
    });

    console.log(newAvailabilities.current);

  }, [selectedDate]);

  return (
    <div>
      <div> 9:00AM </div>
    </div>

  );

}
