"use client"

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, use } from "react";

export default function Header(){
  const { role } = useAuthContext();

  useEffect(() => {
    console.log(role)
  }, [role]);

  return (
    <header>
      {role === "professor" ? <ProfessorHeader /> : <StudentHeader />}
    </header>
  );
}

function StudentHeader(){
  return (
    <header>
      <nav>
        <div className="flex gap-4 flex-row">
          <Link href="/">Home</Link>
          <Link href="/appointment">Send Appointments</Link>
          <div className='flex-1 text-right'>
            <Link href="/login">Login</Link>
          </div>
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