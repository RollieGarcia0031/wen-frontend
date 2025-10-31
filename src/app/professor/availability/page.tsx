"use client"

import { AvailabilityContextProvider, useAvailabilityContext } from "@/context/AvailabilityContext";

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
                <AvailabilityDayCard key={index} day={day} />
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
function AvailabilityDayCard({day}:{
  day: string;
}){
  return (
    <div
      className="border-mute-theme w-full p-2 rounded-md"  
    >
      <p className="text-lg">
        {day}
      </p>
    </div>

  );
}
