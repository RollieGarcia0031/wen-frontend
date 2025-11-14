"use client"

import { FaCheck, FaClock } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { DashboardContextProvider, useDashboard } from "@/context/DashboardContext";

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

/**
 * Contains the time, student_name, and status
 * that are assigned to the current day, only
 * with a status of pending and approved
 */
function DailySummaryTable(){

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

      {
          [0,1,2,3,4,5,6].map(item => (
            <DailySummaryCard key={item}/>
          ))
      }

    </div>
  );
}

function DailySummaryCard(){

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
