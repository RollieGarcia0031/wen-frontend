"use client"

import { FaCheck, FaClock } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { DashboardContextProvider, useDashboard } from "@/context/DashboardContext";
import { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import fetchBackend from "@/lib/fetchBackend";

export default function Home() {

  return (
    <DashboardContextProvider>
      <div className="flex flex-col items-center gap-10">
        <SummaryCount />
        <DailySummaryTable />
      </div>
    </DashboardContextProvider>
  );

}

/**
 * Contains card of elements showing the
 * - total of pending and approved appointment for current day
 * - total appointment for current week
 */
function SummaryCount(){

  const { todayCount, weeklyCount } = useDashboard();

  const todayPending = todayCount.find( item => item.status === 0)?.count || 0;
  const todayApproved = todayCount.find( item => item.status === 1)?.count || 0;
  const todayDeclined = todayCount.find( item => item.status === 2)?.count || 0;

  const weeklyPending = weeklyCount.find( item => item.status === 0)?.count || 0;
  const weeklyApproved = weeklyCount.find( item => item.status === 1)?.count || 0;
  const weeklyDeclined = weeklyCount.find( item => item.status === 2)?.count || 0;

  return (
    <div
      className="[&>div]:bg-background-light [&>div]:border-highlight-muted [&>div]:border-[1px]
      [&>div]:p-4 [&>div]:rounded-lg px-8
      [&>div]:shadow-black [&>div]:shadow-lg
      grid grid-cols-3 gap-10 w-full"
    >

      <div>
        <p className="text-2xl font-bold mb-2">
          Upcoming
        </p>

        <div className="grid grid-cols-[auto_1fr] items-center justify-items-end
          px-4 gap-y-1"
        >
          <FaClock />
          <p>0</p>

          <FaCheck />
          <p>0</p>

          <FaX />
          <p>0</p>
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold mb-2">
          This Day
        </p>

        <div className="grid grid-cols-[auto_1fr] items-center justify-items-end
          px-4 gap-y-1"
        >
          <FaClock />
          <p>{todayPending}</p>

          <FaCheck />
          <p>{todayApproved}</p>

          <FaX />
          <p>{todayDeclined}</p>
        </div>

      </div>

      <div>
        <p className="text-2xl font-bold mb-2">
          This week
        </p>

        <div className="grid grid-cols-[auto_1fr] items-center justify-items-end
          px-4 gap-y-1"
        >
          <FaClock />
          <p>{weeklyPending}</p>

          <FaCheck />
          <p>{weeklyApproved}</p>

          <FaX />
          <p>{weeklyDeclined}</p>
        </div>
      </div>

    </div>
  );
}

interface CursorProps {
  next_id: string;
  next_time: string;
}

const fetchAppointments = async (
  nextCursor: CursorProps,
  setNextCursor: Dispatch<SetStateAction<CursorProps>>,
  setAppointments: Dispatch<SetStateAction<appointment_currentDay_response_item[]>>,
  setIsloading: Dispatch<SetStateAction<boolean>>,
  setHasNext: Dispatch<SetStateAction<boolean>>
)=>{
  const body = {
    cursor_id: nextCursor.next_id,
    cursor_time: nextCursor.next_time
  };
  
  setIsloading(true);

  try {
    const response = await fetchBackend("appointment/current-day", {
      method: "POST",
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(body)
    });

    const { data, message, success } = await response.json() as appointment_currentDay_response;
    if (!response.ok || !success)
      throw new Error(message || "Failed to fetch appointments");

    setAppointments(prev => [...prev, ...data.data]);

    setNextCursor({
      next_id: data.next_cursor_id.toString(),
      next_time: data.next_cursor_time
    });
    
    setHasNext(data.data.length > 0);

  } catch (error) {
    if (error instanceof Error) toast.error(error.message);
  } finally {
    setIsloading(false);
  }
}

/**
 * Contains the time, student_name, and status
 * that are assigned to the current day, only
 * with a status of pending and approved
 */
function DailySummaryTable(){

  const [ appointments, setAppointments ] = useState<appointment_currentDay_response_item[]>([]);
  const [ hasNext, setHasNext ] = useState(true);
  const [ isloading, setIsloading ] = useState(false);
  const [ nextCursor, setNextCursor ] = useState<CursorProps>({next_id: '0',next_time:'0'});

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="card w-[50rem] min-h-[40dvh] rounded-md space-y-4
      [&>div]:grid [&>div]:grid-cols-[1fr_1fr_6.625rem] p-5"
    >
      <div>
        <p className="text-lg font-bold">
          Time
        </p>

        <p className="text-lg font-bold">
          Name
        </p>

        <p className="text-lg font-bold">
          Status
        </p>
   
      </div>

      { appointments.map(item => (
        <DailySummaryCard key={item.id} item={item} />
      ))}

    </div>
  );
}

function DailySummaryCard({item}:{
  item: appointment_currentDay_response_item
}){

  return (
    <div>
      <p>
        9:00-10:00
      </p>

      <p>
        Johnny Johny Yes papa 
      </p>

      <StatusIndicator status={0} />

    </div>
  );
}

function StatusIndicator({status}:{status: number}){

  const StatusWord = ['pending', 'approved'];
  const bgColor = [
    'bg-orange-500',
    'bg-green-500'
  ];

  return (
    <p className={`${bgColor[status]} text-black text-center
      rounded-full px-5`}
    >
      {StatusWord[status]}
    </p>
  );
}
