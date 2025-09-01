"use client"

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Home() {
  const { role } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const sessionRole = sessionStorage.getItem("role");
    const sessionName = sessionStorage.getItem("name");

    if(sessionRole && sessionName) return;
    router.push("/login");
  }, [role]);

  return (
    <div>
      <Header />
      <h1>Welcome!</h1>

    </div>
  );
}
