"use client"

import { AvailabilityContextProvider, AvailabilityItem, useAvailabilityContext, TemporaryAvailabilityItem } from "@/context/AvailabilityContext";
import fetchBackend from "@/lib/fetchBackend";
import { useEffect, useRef, useState } from "react";
import { BiCircle } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import { ImTerminal } from "react-icons/im";

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

  const { availabilityList, setAvailabilityList, setTemporaryAvailabilityList, temporaryAvailabilityList } = useAvailabilityContext();

  /** Filtered list of availability grouped by day_of_week */
  const containedList = availabilityList.filter(availability => availability.day_of_week === index);

  /** Filter list of temporary availability for UI */
  const containedTemporaryList = temporaryAvailabilityList.filter(item => item.day_of_week === index);

  /** for UI state */
  const [ isCollapsed, setIsCollapsed ] = useState(containedList?.length <= 0);

  return (
    <div
      className={`border-mute-theme w-full p-2 rounded-md
      `}
    >

      <button onClick={()=>setIsCollapsed(x => !x)}
        className="flex-rl items-center gap-2"
      >
        <BiCircle
          className={`${containedList?.length > 0? 'fill-green-500' : 'fill-highlight-muted'}`}
        />
        <p>{day}</p>
      </button>

      <div className="mx-4 space-y-2">
        {/* render the set of availability from database */}
        { 
          containedList?.map((availability, index) =>
            !isCollapsed &&
              <AvailabilityListCard
                key={index}
                availability={availability}
                containedList={containedList}                
              /> 
          )
        }


        {/* render list of availability to be saved */
          containedTemporaryList?.map(( temporaryItem, index) =>
            !isCollapsed && 
              <TemporaryAvailabilityCard
                key={temporaryItem.id}
                index={index}
                temporaryAvailability={temporaryItem}
              />
          )
        }

        {
          !isCollapsed && 
          <button
            className="border-mute-theme px-2 py-sm rounded-md bg-primary"
            onClick={()=>handleAddAvailability()}
          >
            Add
          </button>
        }
      </div>
    </div>
  );

  /**
   * Temporarily display row in the avaiability table
   * in which the user has the option to discard/save
   * it in the database
   */
  function handleAddAvailability(){
    const lastAvailability = containedList[containedList.length - 1];
    
    const randomId = Math.floor( Math.random() * 9999999999 );

    const newAvailability: TemporaryAvailabilityItem = {
      id: randomId, 
      start_time: lastAvailability?.end_time || "07:00:00",
      end_time: lastAvailability?.end_time || "08:00:00",
      day_of_week: index
    };

    setTemporaryAvailabilityList(x => [...x, newAvailability]); 
    
  }
}

/**
 * Component that holds the single row of table showing a single
 * availability of user along with delete option
 */
function AvailabilityListCard({availability, containedList}: {
  availability: AvailabilityItem;
  /** Contains the sibling of the avaibility on the same group*/
  containedList: AvailabilityItem[];
}){

  const { setAvailabilityList } = useAvailabilityContext();
  const { end_time, start_time, id } = availability;

  const startTimeRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className="grid grid-cols-[1fr_auto_1fr_auto] space-x-2 items-center"
    >

      <div
        className={`border-mute-theme px-2 py-1 rounded-md`}
      >
        <input
          ref={startTimeRef}
          type='time' defaultValue={start_time}
          className="w-full rounded-md"
        />
      </div>

      <p> - </p>

      <div className={`border-mute-theme px-2 py-1 rounded-md
        'border-highlight-muted`}
      >
        <input type='time' defaultValue={end_time}
          className="w-full rounded-md"
        />
      </div>

      <button onClick={handleDelete}>
        <FiTrash/>
      </button>

    </div>
  );

  /**
   *  Deletes the availability from the UI and database
   */
  async function handleDelete(){
    const body = { id };

    const response = await fetchBackend("availability/delete", {
      method: "DELETE",
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const { message } = await response.json() as common_response;
      alert(message);
      return;
    }

    //delete from the UI
    setAvailabilityList(list => list.filter(item =>
      item.id !== id
    ));  
  }
}
/**
 * Component holding a row of temporary availabilty
 * Temporary availability is listed in the UI can
 * be saved if desired by user
 */
function TemporaryAvailabilityCard({index, temporaryAvailability}: {
  index: number,
  temporaryAvailability: TemporaryAvailabilityItem
}){
  
  const { setTemporaryAvailabilityList, temporaryAvailabilityList } = useAvailabilityContext();
  const { start_time, end_time, id } = temporaryAvailability;

  const [ startInput, setStartInput ] = useState(start_time);

  useEffect(()=>{
    setTemporaryAvailabilityList(list => list.map(item => {
      if (item.id === id) item.start_time = startInput;
      return item;
    }))
  
    console.log(temporaryAvailabilityList);
    console.log('changed startinput', startInput);
  }, [startInput])

  return (
    <div
      className="grid grid-cols-[1fr_auto_1fr_auto] space-x-2 items-center"
    >

      <div
        className={`px-2 py-1 rounded-md`}
      >
        <input
          type='time' value={startInput} onChange={e=>setStartInput(e.target.value)}
          className="w-full rounded-md"
        />
      </div>

      <p> - </p>

      <div className={`px-2 py-1 rounded-md
        'border-highlight-muted`}
      >
        <input type='time' defaultValue={end_time}
          className="w-full rounded-md"
        />
      </div>

      <button onClick={handleDelete}>
        <FiTrash/>
      </button>

    </div>
  );

  function handleDelete(){
    setTemporaryAvailabilityList(list => {
      list = list.filter(item => item.id !== id);

      return list;
    })    
  }
}
