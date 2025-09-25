"use client";
import { fetchBackend } from "@/lib/api";
import { Tomorrow } from "next/font/google";
import { useEffect, useState } from "react";

interface TomorrowCountReponseData {
  status: string;
  count: number;
}

interface TommorowCount {
  [key: string]: number
}

export default function TomorrowAppointmentCount(){
  // contains count of tommorow's pending, confirmed and total appointment
  const [tommorowCount, setTommorrowCount] = useState<TommorowCount>({});
  const { pending, confirmed, total } = tommorowCount;

  useEffect(()=>{
    const fetchTommorowCount = async () =>  {
      const body = { time_range: "tomorrow" };

      const response = await fetchBackend(
        "appointments/groupedCount",
        "POST",
        JSON.stringify(body),
        new Headers({"Content-Type": "application/json"})
      );

      const { success, data }
      : {success: boolean, data: TomorrowCountReponseData[]} = response;

      if (success && data) {
        data.forEach((item) => {
          const { count, status } = item;

          // update the count of tommorow's appointment, after fetching
          setTommorrowCount(x => {
            x[status] = count;
            return {...x};
          });
        })

        setTommorrowCount(x => {
          x.total = (x.confirmed || 0) + (x.pending || 0);
          return {...x};
        });
      }
    }

    fetchTommorowCount().catch(console.error);
  },[]);

  return (
    <div
      className="py-4 px-6
      border-highlight border-[1px] border-solid rounded-md"
    >
      <p
        className="font-bold text-xl"
      >
        Tommorow
      </p>

      <div
        className="grid grid-cols-[auto_max-content] grid-rows-3 gap-2
        sm:mt-4 sm:px-2 sm:w-[8rem]
        [&>span]:font-bold"
      >
        <p>Confirmed:</p>
        <span>{confirmed || 0}</span>

        <p>Pending:</p>
        <span>{pending || 0}</span>

        <p>Total:</p>
        <span>{total || 0}</span>
      </div>
    </div>
  );
}