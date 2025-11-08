"use client"

import { RefObject } from "react";

export default function NotifMiniPanel({ref}:{
  ref: RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={ref}
      className="card p-4 absolute right-[5rem]
      w-[20rem]"
    >
      Notif
    </div>
  );
}
