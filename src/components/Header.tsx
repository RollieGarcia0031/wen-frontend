"use client"

import { usePathname } from "next/navigation";
import React, { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineUserCircle } from "react-icons/hi";

import ProfileMiniPanel from "./ProfileMiniPanel";
import NotifMiniPanel from "./NotifMiniPanel";
import { NotificationContextProvider, useNotification } from "@/context/NotificationContext";
import fetchBackend from "@/lib/fetchBackend";

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
      className="flex-rc py-2 mt-2"
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
        <NotificationContextProvider>
          <NotificationButton
            notifPanelRef={notifPanelRef}
            setMiniNotifPanelIsOpened={setMiniNotifPanelIsOpened}
            miniNotifPanelIsOpened={miniNotifPanelIsOpened}
          />
        </NotificationContextProvider>

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

function NotificationButton({setMiniNotifPanelIsOpened, miniNotifPanelIsOpened, notifPanelRef}:{
  setMiniNotifPanelIsOpened: Dispatch<SetStateAction<boolean>>,
  miniNotifPanelIsOpened: boolean,
  notifPanelRef: RefObject<HTMLDivElement | null>
}){

  const [ unreadCount, setUnreadCount ] = useState(0);

  useEffect(()=>{
    const fetchUnreadCount = async()=>{
      const response = await fetchBackend("notification/count/unread", {
        method: "GET",
        headers: { 'Content-Type' : 'application/json' }
      });

      if (!response.ok) return;

      const { data } = await response.json() as notification_count_unread;

      setUnreadCount(data.count);
    }

    fetchUnreadCount();
  }, []);

  return (
    <div>
      <button className="svg-btn-sm common-button relative"
        onClick={handleOpenNotif}
      >
        <IoMdNotificationsOutline />

        { unreadCount > 0 &&
          <span
            className="absolute top-[-3px] bg-primary rounded-full px-2 text-sm"
          >
           { unreadCount }   
          </span>
        }
      </button>

        { miniNotifPanelIsOpened && <NotifMiniPanel ref={notifPanelRef} /> }
    </div>
  );

  async function handleOpenNotif(){
    setMiniNotifPanelIsOpened(x=>!x);

    try {
      const response = await fetchBackend("notification/mark-all-read", {
        method: "GET",
        headers: { 'Content-Type' : 'application/json' }
      });

      if (!response.ok) return;

      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  }
}
