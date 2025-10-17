"use client"

import { useState, useEffect } from "react";
import { MdLogout, MdSettings } from "react-icons/md";

import fetchBackend from "@/lib/fetchBackend";
import Link from "next/link";

export default function ProfileMiniPanel(){
  const [user, setUser] = useState<User | null>(null);

  useEffect(()=>{
    const getUser = async ()=>{
      const userResponse = await fetchBackend('auth/profile', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (userResponse.ok){
        const userJson = await userResponse.json() as auth_profile_response;

        const newUserData = userJson.data;
        setUser(newUserData);
      }
    };

    getUser();

  }, []);

  return (
    <div className="absolute mt-4 right-5 card2 rounded-sm
      flex-cl p-4
      [&>*]:border-b-highlight-muted [&>*]:border-b-[1px] [&>*]:border-b-solid
      [&>*]:py-1 [&>*]:w-full
      [&>*]:flex [&>*]:flex-items-end [&>*]:gap-2
      [&_*]:pl-1
      min-w-[8rem] [&_svg]:text-2xl
    ">
      <p className="mb-2">{user?.name}</p>

      <Link href="/login">
        <MdSettings/>
        Profile
      </Link>

      <Link href='/login'>
        <MdLogout/>
        Logout
      </Link>
    </div>
  )
}