"use client"

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineUserCircle } from "react-icons/hi";

import ProfileMiniPanel from "./ProfileMiniPanel";
import NotifMiniPanel from "./NotifMiniPanel";

/**
 * Contains the main header, rendered to both students and professors
 * @returns header, or null in some routes
 */
export default function Header() {

  const pathname = usePathname();

  const [miniLogPanelIsOpened, setMiniLogPanelIsOpened] = useState(false);
  const logPanelRef = useRef<HTMLDivElement | null>(null);

  const [ miniNotifPanelIsOpened, setMiniNotifPanelIsOpened ] = useState(false);
  const notifPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{

    const handleBodyClick = (event: Event) => {
      const target = event.target as Node;

      if (!notifPanelRef.current?.contains(target)){
        setMiniNotifPanelIsOpened(false);
      }
      if (!logPanelRef.current?.contains(target)){
        setMiniLogPanelIsOpened(false);
      }
    }

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    }

  }, []);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }
  
  return (
    <header
      className="flex-rc py-2"
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
        <div>

          <button className="svg-btn-sm common-button"
            onClick={()=>setMiniNotifPanelIsOpened(x=>!x)}
          >
            <IoMdNotificationsOutline />
          </button>
          { miniNotifPanelIsOpened && <NotifMiniPanel ref={notifPanelRef} /> }
        </div>

        {/* shows the mini profile panel */}
        <div>
          <button className="svg-btn-sm common-button"
            onClick={() => setMiniLogPanelIsOpened(x=>!x)}
          >
            <HiOutlineUserCircle/>          
          </button>
          { miniLogPanelIsOpened && <ProfileMiniPanel ref={logPanelRef}/> }
        </div>
      </div>
    </header>
  );
}
