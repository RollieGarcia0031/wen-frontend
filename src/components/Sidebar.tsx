"use client"

import { HiOutlineHome } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar(){
  const path = usePathname();
  
  if (path.includes("/login")){
    return <span> </span>; 
  }

  return (
    <div
      className="flex-rt
        py-4
        [&_svg]:text-2xl
        [&_button]:bg-black [&_button]:p-3 [&_button]:rounded-full
        border-r-highlight-muted border-r-[1px]
        h-[100dvh]"
    >
      <button>
        <Link href="/">
          <HiOutlineHome/>
        </Link>
      </button>
    </div>
  );
}
