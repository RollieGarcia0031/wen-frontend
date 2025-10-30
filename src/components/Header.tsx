"use client"

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineUserCircle } from "react-icons/hi";

import ProfileMiniPanel from "./ProfileMiniPanel";

/**
 * Contains the main header, rendered to both students and professors
 * @returns header, or null in some routes
 */
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
      {/* link button/app name, shortcut to return to home */}
      <h1>
        <Link href="/">
          Wen
        </Link>
      </h1>
      
      {/* contains the shortcut menu (notif, user_settings) */}
      <div
        className=" flex-1
        flex flex-row justify-end items-center
        gap-2
        [&_button]:aspect-square [&_button]:rounded-full"
      >
        {/* shows the unread/fresh notfications */}
        <button className="svg-btn-sm common-button">
          <IoMdNotificationsOutline />
        </button>

        {/* shows the mini profile panel */}
        <div>
          <button className="svg-btn-sm common-button"
            onClick={() => setMiniLogPanelIsOpened(x=>!x)}
          >
            <HiOutlineUserCircle/>          
          </button>
          { miniLogPanelIsOpened && <ProfileMiniPanel/> }
        </div>
      </div>
    </header>
  );
}
