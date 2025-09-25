"use client";

import { useState, useEffect } from "react";
import { useLatestAppointmentContext } from "@/context/LatestAppointmentContext";
import { MdOutlineFileDownloadDone, MdOutlinePending } from "react-icons/md";
import { BsInboxes } from "react-icons/bs";

/**
 * Displays the numbers of current total, pending, and confirmed appointments
 * @returns the current appointment count
 */
export default function CurrentTotalAppointmentCount(){
  const { currentAppointmentCount } = useLatestAppointmentContext();

  // count of current appointments { confirmed: 0, pending: 0, total: 0 }
  const [ currentCount, setCurrentCount ] = useState<{
    [key: string]: number
  }>({});

  // count of current appointments { confirmed: 0, pending: 0, total: 0 }
  const { confirmed, pending, total } = currentCount;

  useEffect(()=>{
    if (currentAppointmentCount.length === 0) return;

    // update the current count
    currentAppointmentCount.forEach(currentCount => {
      const { status, count } = currentCount;
      setCurrentCount(x => {
        x[status] = count;
        return {...x};
      });
    });

    // calculate the total
    setCurrentCount(x => {
      const {confirmed, pending} = x;
      x.total = (confirmed || 0) + (pending || 0);
      return {...x};
    });
  }, [currentAppointmentCount]);


  return (
    <div>
      <div
        className="flex flex-col gap-2 items-start justify-center
        border-highlight border-[1px] border-solid rounded-md
        sm:px-4 sm:py-4"
      >
        <p
          className="font-bold text-2xl"
        >
          Appointments Today
        </p>
        <div
          className="grid grid-cols-[auto_max-content] grid-rows-3
          items-end
          sm:gap-x-8 sm:gap-y-1 sm:mt-1 sm:px-4
          w-full
          [&>p]:font-light[&>p]:text-lg
          [&>span]:font-bold [&>span]:text-lg
          [&>span]:flex  [&>span]:flex-row [&>span]:items-center [&>span]:justify-end
          sm:[&>span]:gap-2"
        >
          <p>Confirmed:</p>
          <span>{confirmed} <MdOutlineFileDownloadDone /> </span>
          <p>Pending:</p>
          <span>{pending} <MdOutlinePending /> </span>
          <p>Total: </p>
          <span>{total} <BsInboxes /> </span>
        </div>
      </div>
    </div>
);
}