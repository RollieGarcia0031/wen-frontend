"use client"

import { AvailabilityContextProvider, AvailabilityItem, useAvailabilityContext } from "@/context/AvailabilityContext";
import { useState } from "react";
import { BiCircle } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";

const DayOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Availability(){
  const { availabilityList, setAvailabilityList } = useAvailabilityContext();

  return (
    <AvailabilityContextProvider>
      <div>

        <p className="text-main-big px-10">Schedule</p>

        <div className="flex-rc mt-10">
          <div className="card2 sm:w-[40rem] p-6">
            <p> Weekly Availability </p> 
           
            <p>
              Set your recurring available time slots for students to book
            </p>

            <div
              className="mt-2 flex-cl space-y-2"
            >
              { DayOfWeek.map(
                (day, index) =>
                <AvailabilityDayCard key={index} day={day} index={index} />
              )}

            </div>

          </div>
        </div>
      </div>
    </AvailabilityContextProvider>
  );
}

/**
 * Contains a whole availability of professor in a single day of a week
 */
function AvailabilityDayCard({day, index}:{
  /** The actual string for day_of_week (Monday, Tuesday, ...) */
  day: string;
  /** Serves as index of the day_of_week (0-6 as Monday-Sunday) */
  index: number;
}){

  const { availabilityList } = useAvailabilityContext();

  /** Filtered list of availability grouped by day_of_week */
  const containedList = availabilityList.filter(availability => availability.day_of_week === index);

  /** for UI state */
  const [ isCollapsed, setIsCollapsed ] = useState(containedList?.length <= 0);

  return (
    <div
      className={`border-mute-theme w-full p-2 rounded-md
      `}
    >

    <button onClick={()=>setIsCollapsed(true)}
      className="flex-rl items-center gap-2"
    >
      <BiCircle/>
      <p>{day}</p>
    </button>

      { 
        containedList?.map((availability, index) =>
          isCollapsed && <AvailabilityListCard key={index} availability={availability} /> 
        )
      }
    </div>
  );
}

/**
 * Component that holds the single row of table showing a single
 * availability of user along with delete option
 */
function AvailabilityListCard({availability}: {
  availability: AvailabilityItem;
}){
  
  const { end_time, start_time } = availability;

  return (
    <div
      className="grid grid-cols-[1fr_1fr_auto] px-4 space-x-2"
    >

      <div className="border-mute-theme px-2 py-1 rounded-md">
        {start_time} 
      </div>

      <div className="border-mute-theme px-2 py-1 rounded-md">
        {end_time}
      </div>

      <button>
        <FiTrash/>
      </button>

    </div>
  );
}
