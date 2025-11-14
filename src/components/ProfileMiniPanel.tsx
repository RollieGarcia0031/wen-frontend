"use client"

import { useState, useEffect, RefObject } from "react";
import { MdLogout, MdSettings } from "react-icons/md";

import fetchBackend from "@/lib/fetchBackend";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ProfileMiniPanel({ref}:{
  ref: RefObject<HTMLDivElement | null>
}){
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

  const router = useRouter();

  return (
    <div
      ref={ref}
      className="absolute mt-4 right-5 card2 rounded-sm
      flex-cl p-4
      [&>*]:border-b-highlight-muted [&>*]:border-b-[1px] [&>*]:border-b-solid
      [&>*]:py-1 [&>*]:w-full
      [&>*]:flex [&>*]:flex-items-end [&>*]:gap-2
      [&_*]:pl-1
      min-w-[8rem] [&_svg]:text-2xl
      animate-fade-in
    ">
      <p className="mb-2">{user?.name}</p>

      <Link href="/profile">
        <MdSettings/>
        Profile
      </Link>

      <Link href='/' onClick={handleLogout}>
        <MdLogout/>
        Logout
      </Link>
    </div>
  );

  async function handleLogout(e: React.MouseEvent<HTMLAnchorElement>){
    e.preventDefault();

    const response = await fetchBackend('auth/logout', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok){
      toast.info('User has logged out');
      router.push('/login');
    } else {
      toast.error('Error logging out');
    }
  }
}
