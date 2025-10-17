"use client"

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineUserCircle } from "react-icons/hi";

import ProfileMiniPanel from "./ProfileMiniPanel";

export default function Header() {
  const router = useRouter();

  const pathname = usePathname();

  const [miniLogPanelIsOpened, setMiniLogPanelIsOpened] = useState(false);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header
      className="flex-rc px-4 py-2"
    >
      <h1>
        Wen
      </h1>
      <div
        className=" flex-1
        flex flex-row justify-end items-center
        gap-2
        [&_button]:aspect-square [&_button]:rounded-full"
      >
        <button className="svg-btn-sm common-button">
          <IoMdNotificationsOutline />
        </button>

        <div>
          <button className="svg-btn-sm common-button"
            onClick={() => setMiniLogPanelIsOpened(x=>!x)}
          >
            <HiOutlineUserCircle/>          
          </button>
          {  miniLogPanelIsOpened && <ProfileMiniPanel/>}
        </div>
      </div>
    </header>
  );
}