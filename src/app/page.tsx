"use client"

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Home() {
  return (
    <div>
      <Header />
      <h1>Welcome!</h1>

    </div>
  );
}

function Header(){
  const AuthContext = useAuthContext();
  const { role, userName } = useAuthContext();

  useEffect(()=>{
    console.log({userName, role});
  }, [])

  return (
    <header>
      <nav>
        <ul className="flex gap-4 flex-row">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/appointment">Appointments</Link></li>
        </ul>
      </nav>
    </header>
  );
}
