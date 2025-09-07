"use client"

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, use } from "react";
import { usePathname } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineAttachEmail } from "react-icons/md";

export default function Header(){
  const { role } = useAuthContext();

  useEffect(() => {
    console.log(role)
  }, [role]);

  const pathname = usePathname();
  const protectedRoutes = ['/login', '/register'];

  if(protectedRoutes.includes(pathname)) return null;

  return (
    <header>
      {role === "professor" ? <ProfessorHeader /> : <StudentHeader />}
    </header>
  );
}

function StudentHeader(){
  const pathname = usePathname().split("/");
  const basePath = pathname[1];

  const HeaderIconAnchorDesign = (requiredPath: string) =>{
    return `${basePath === requiredPath ? "bg-primary" : ""}`;
  }

  return (
    <header
      className="flex flex-row justify-center items-center h-full p-2"
    >
      <nav className="w-full flex flex-row">
        <div
          className="flex gap-4 flex-row
          justify-center items-center
          *:flex-row *:flex *:justify-center *:items-center *:gap-2
          [&_svg]:text-2xl [&_svg]:cursor-pointer [&_a]:duration-200
          sm:[&_a]:p-2 sm:[&_a]:rounded-xl
          "
        
        >
          <Link href="/"
            className={HeaderIconAnchorDesign("")}
          >
            <IoHomeOutline />
          </Link>
          <Link href="/appointment"
            className={HeaderIconAnchorDesign("appointment")}
          >
            <MdOutlineAttachEmail />
            Send Appointments
          </Link>
        </div>
        <div className='flex-1 flex flex-row justify-end'>
          <Link href="/login">Login</Link>
        </div>
      </nav>
    </header>
  );
}

function ProfessorHeader(){
  return (
    <header>
      <nav>
        <div className="flex gap-4 flex-row">
          <Link href="/">Home</Link>
          <Link href="/appointment">View Your Appointments</Link>
          <Link href="/professor/profiles">Manage Your Profile</Link>
          <div className='flex-1 text-right'>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}