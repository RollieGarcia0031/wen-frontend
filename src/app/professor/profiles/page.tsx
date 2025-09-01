"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBackend } from '@/lib/api';
import { ProfessorProfileRequest, } from '@/lib/requests';
import { ApiResponse } from "@/lib/response";

export default function Profiles(){
  useEffect(()=>{
    const sessionRole = sessionStorage.getItem("role");
    if(sessionRole !== "professor") {
      alert("Your are not allowed here!");
      window.location.href = "/"
    };
  },[])

  const [year, setYear] = useState<number>(0);
  const [department, setDepartment] = useState<string>("");

  return(
    <div>
      <Link href="/" >Back</Link>
      <h1>Profiles</h1>

      <form onSubmit={e=>addProfile(e)}>
        <p>Add your Profile</p>
        <div className="flex flex-row gap-4">
          <FormInput type="number" label="Year" value={year.toString()} onChange={(e) => setYear(parseInt(e.target.value))} />
          <FormInput type="text" label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </div>

        <button type="submit">Add</button>
      </form>
    </div>
  );

  async function addProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = JSON.stringify({year, department});
    const headers = new Headers({"Content-Type": "application/json"});
    try{
      const response: ApiResponse = await fetchBackend("professor/profile", "POST", body, headers);

      if(response.success) {
        alert(response.message);
      }

    } catch(err){
      console.error(err);
    }
  }
}

interface FormInputProps {
  type: string,
  label: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function FormInput({type, label, value, onChange}: FormInputProps) {
  return (
    <label className="flex flex-row gap-2 items-center justify-center">
      {label}:
      <input type={type}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  );
}