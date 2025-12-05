"use client"

import { HiOutlineHome } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdOutlineScheduleSend } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";
import { RiCalendarScheduleLine } from "react-icons/ri";

export default function Sidebar(){
  const path = usePathname();

  const { user } = useAuth();

  if (path.includes("/login")){
    return <span> </span>; 
  }

  if (!user) return <div></div>;

  if (user)
  return (
    <div
      className="flex-ct gap-3
        py-4
        [&_svg]:text-2xl
        [&_button]:p-3 [&_button]:rounded-full
        [&_button]:duration-300
        border-r-highlight-muted border-r-[1px]
        h-[100dvh]"
    >
      <button className={`${path == "/" ? "bg-highlight-muted" : ""}`}>
        <Link href="/">
          <HiOutlineHome/>
        </Link>
      </button>

      <button
        className={`${path == `/appointment/${user.role}` ? "bg-highlight-muted" : ""}`}
      >
        <Link href={`/appointment/${user.role}`}
        >
          <MdOutlineScheduleSend />
        </Link>
      </button>

      <button
        className={`${path === '/notifications'? "bg-highlight-muted" : ""}`}
      >
        <Link href="/notifications">
          <IoIosNotificationsOutline />
        </Link>
      </button>
      
      {/* side bar options exclusive to professors */}
      { user?.role == 'professor' &&
        <button
          className={`${path == '/professor/availability'? "bg-highlight-muted" : ""}`}
        >
          <Link href="/professor/availability">
            <RiCalendarScheduleLine /> 
          </Link>
        </button>
      }
    </div>
  );
}
