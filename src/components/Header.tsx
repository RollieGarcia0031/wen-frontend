"use client"

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, use, useState } from "react";
import { usePathname } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineAttachEmail } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { TbLayoutBottombarCollapse } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";

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
      className="flex flex-row justify-center items-center h-full p-2
      border-b-2 border-b-primary"
    >
      <nav className="w-full flex flex-row
        [&_svg]:text-2xl [&_svg]:cursor-pointer [&_a]:duration-200
        sm:[&_a]:rounded-xl">
        <div
          className="flex gap-4 flex-row
          justify-center items-center
          *:flex-row *:flex *:justify-center *:items-center *:gap-2
          sm:[&_a]:p-2
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
        <AccountOptionPanel />
      </nav>
    </header>
  );
}

function AccountOptionPanel(){
  const { userName } = useAuthContext();
  const [ isOpened, setIsOpened ] = useState(false);

  return (
    <div className='flex-1 flex flex-row justify-end items-center'>
      <div
        className='overflow-hidden'
      >
        <button className="flex-row-center gap-2"
          onClick={()=>setIsOpened(x=>!x)}
        >
          <VscAccount />
          <p>{userName}</p>
          <TbLayoutBottombarCollapse/>
        </button>

        {isOpened && (
          <div className="absolute flex flex-col justify-end items-end right-4
            card p-2 mt-4
            [&_a]:flex [&_a]:flex-row [&_a]:items-center [&_a]:gap-2
            sm:[&_a]:px-1 sm:[&_a]:py-0.5"
          >
            <button
              className='rounded-md'
            >
                <Link href='/login'><CiLogout className="text-sm"/>Logout</Link>
            </button>

            <button>
              <Link href='/professor/profiles'><VscAccount className="text-sm"/>My Profile</Link>
            </button>
          </div>
        )}
      </div>
    </div> 
  );
}

function ProfessorHeader(){
  const pathName = usePathname().split("/");
  const basePath = pathName[1];

  const HeaderIconClassName = (requiredPath: string) => {
    return `${basePath === requiredPath ?
      "text-primary border-b-[1px] border-b-primary" :
      ""}`;
  };

  return (
    <header>
      <nav
        className="flex flex-row justify-center items-center h-full p-4
          [&_a]:flex-row [&_a]:flex [&_a]:justify-center [&_a]:items-center [&_a]:gap-2
          sm:[&_a]:p-2"
      >
        <div 
          className="flex gap-4 flex-row [&_svg]:text-2xl [&_svg]:cursor-pointer"
        >
          <Link href="/"
            className={HeaderIconClassName("")}
          >
            <IoHomeOutline />
          </Link>
          <Link href="/appointment"
            className={HeaderIconClassName("appointment")}
          >
              <MdOutlineAttachEmail />
              Your Appointments
          </Link>
          <Link href="/professor/profiles"
            className={HeaderIconClassName("professor")}
          >
            <VscAccount />Manage Your Profile
          </Link>
          <div className='flex-1 text-right'>
          </div>
        </div>

        <AccountOptionPanel />
      </nav>
    </header>
  );
}