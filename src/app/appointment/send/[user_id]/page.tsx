"use client"

import Link from "next/link";
import fetchBackend from "@/lib/fetchBackend";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSendAppointment, SendAppointmentContextProvider } from "@/context/SendAppointment";
import { removeSeconds } from '@/util/TimeFormat';
import { IoMdReturnLeft } from "react-icons/io";
import ProfInfoDialog from "./ProfInfoDialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import './styles.css';
import { FaInfo } from "react-icons/fa";

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

        <div
          className="grid grid-rows-[1fr_auto] gap-5 pb-5" 
        >
          <TimeOptions />
          <MessageInput />
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
  const infoDialogRef = useRef<HTMLDialogElement | null>(null);

  return (
    <div
      className="flex-rl gap-2"
    >
      <button className="bg-blue-900 aspect-square p-2 flex-cc rounded-full"
        onClick={()=>infoDialogRef.current?.showModal()}
      >
        <FaInfo />
      </button>
      <p
        className="text-4xl font-bold"
      >
        {userInfo.name}
      </p>

      <ProfInfoDialog ref={infoDialogRef}/>

    </div>
  );
}

/**
 * Takes the date input of user
 */
function CalendarInput(){
  const { setSelectedDate, selectedDate, setSelectedAvailability } = useSendAppointment();

  return (
    <div
      className="bg-background p-4 rounded-xl"
    >

      <DatePicker
        selected={selectedDate}
        onChange={date => handleChange(date)}
        inline
      />

    </div>
  );

  function handleChange(date: Date | null){
    setSelectedDate(date);
    setSelectedAvailability(null);
  }
}

/**
 * Shows the available time on the professor based on the
 * selected date from CalenderInput
 */
function TimeOptions(){
  const { userInfo: { availabilities }, selectedDate  } = useSendAppointment();

  /**
   * holds an array of filtered availability time slots based
   * on the selected date
   */
  const [ newAvailabilities, setNewAvailabilites ] = useState<search_professor_user_availability[]>([]);

  useEffect( () => {
    // set a new value for the availability time based on the selected
    // day of week
    setNewAvailabilites(
      availabilities?.filter(item => {
        const inputDayOfWeek = selectedDate?.getDay();

        return item.day_of_week === inputDayOfWeek;
      })
    );

  }, [selectedDate]);

  if(!newAvailabilities || newAvailabilities?.length <= 0) return null;

  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-2
    card p-6 items-start auto-rows-min"
    >
      {newAvailabilities?.map((item: search_professor_user_availability) => (
        <TimeSlotCard availabilityItem={item} key={item.availability_id}/>
      ))}
    </div>

  );

}

function TimeSlotCard(availabilityItem: {
  availabilityItem: search_professor_user_availability
}){
  
  const {
    availabilityItem: {end_time, start_time, availability_id, day_of_week}
  } = availabilityItem || {};

  const { selectedAvailability, setSelectedAvailability } = useSendAppointment();
  const isSelected = selectedAvailability?.availability_id === availability_id;

  return (
    <button className={`flex-rc gap-2 card rounded-sm
      ${isSelected? 'bg-primary' : ''}
      `}
      onClick={handleSelect}
    >

      <p>
        {removeSeconds(start_time)}
      </p>
      <p>
        {removeSeconds(end_time)}
      </p>

    </button>
  );

  function handleSelect(){
    setSelectedAvailability({availability_id, day_of_week, start_time, end_time});
  }
}

function MessageInput(){
  const { selectedAvailability, selectedDate } = useSendAppointment();
  const router = useRouter();

  // used to limit outgoing api request
  const isSending = useRef(false);

  if (!selectedAvailability) return null;

  return (
    <form className="grid grid-cols-[1fr_auto] gap-2 min-h-[2rem]
      card rounded-md py-2"
      onSubmit={e=>handleSubmit(e)}
    >
      <input type='text'
        className="px-4"
        placeholder="Message"
        name='message'
      />

      <button
        className="bg-primary hover:bg-primary-hover px-2 rounded-md"
        type='submit'
        disabled={isSending.current}
      >
        Send
      </button>
    </form>
  );

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>){
    event.preventDefault();

    if (isSending.current) return;

    isSending.current = true; 

    if (!selectedDate || !selectedAvailability) return;

    const formData = new FormData(event.currentTarget);
    formData.append('availability_id', selectedAvailability?.availability_id.toString());
    formData.append('target_date', selectedDate.toISOString());

    const reqBody = Object.fromEntries(formData);

    try {
      const response = await fetchBackend("appointment/send",{
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(reqBody)
      });

      const { message, success } = await response.json() as common_response;

      if (!response.ok || !success) throw new Error(message);
      
      toast.success("Appointment Sent!");
      router.push('/appointment');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      isSending.current = false;
    }
  }
}
