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

  const rolesHeader = {
    professor: <ProfessorHeader/>,
    student: <StudentHeader/>,
    default: null
  }

  return (
    <header>
      {rolesHeader[role]}
    </header>
  );
}

function StudentHeader(){
  const pathname = usePathname().split("/");
  const basePath = pathname[1];

  /** checks the basepath of the url, if matched to the anchor href, it toggles primary color */
  const HeaderIconAnchorDesign = (requiredPath: string) =>{
    return `${basePath === requiredPath ? "bg-primary" : ""}`;
  }

  return (
    <header
      className="flex flex-row justify-center items-center h-full p-2
      border-b-2 border-b-primary"
    >
      <h1 className="sm:text-3xl">
        Wen
      </h1>
      {/* this navbar holds the whole header elements */}
      <nav className="flex flex-row flex-1
        [&_svg]:text-2xl [&_svg]:cursor-pointer [&_a]:duration-200
        sm:[&_a]:rounded-xl sm:mt-2">
        {/* contains the main options in the header, home button and send apt button */}
        <div
          className="flex gap-4 flex-row flex-1
          justify-center items-center
          *:flex-row *:flex *:justify-center *:items-center *:gap-2
          sm:[&_a]:p-2"
        >
          <Link href="/"
            className={
              HeaderIconAnchorDesign("")
            }
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
    <div className='flex flex-row justify-end items-center'>
      <div
        className='overflow-hidden'
      >
        <button className="flex-row-center gap-2"
          onClick={()=>setIsOpened(x=>!x)}
        >
          <VscAccount />
          <p className="sm:text-xl">{userName}</p>
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
              <Link href='/profile'><VscAccount className="text-sm"/>My Profile</Link>
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
        className="flex flex-row justify-center items-center h-full
          sm:px-4 sm:py-2 sm:mt-3
          [&_a]:flex-row [&_a]:flex [&_a]:justify-center [&_a]:items-center [&_a]:gap-2
          sm:[&_a]:p-2"
      >
        <h1 className="sm:text-3xl">
          Wen
        </h1>
        {/* holds the primary buttons in the header */}
        <div 
          className="flex-1 flex-row-center
            sm:gap-4
            [&_svg]:text-2xl [&_svg]:cursor-pointer"
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
          <Link href="/profile"
            className={HeaderIconClassName("profile")}
          >
            <VscAccount />Manage Your Profile
          </Link>
        </div>

        <AccountOptionPanel />
      </nav>
    </header>
  );
}