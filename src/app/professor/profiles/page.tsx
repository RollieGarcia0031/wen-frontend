"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBackend } from '@/lib/api';
import { ApiResponse, SearchAvailabilityResponseDataItem } from "@/lib/response";

interface ProfessorProfile {
  department: string;
  year: 1 | 2 | 3 | 4;
}

export default function Profiles(){
  const [profiles, setProfiles] = useState<ProfessorProfile[]>([]);
  const [availabilities, setAvailabilities] = useState<SearchAvailabilityResponseDataItem[]>([]);

  useEffect(()=>{
    const sessionRole = sessionStorage.getItem("role");

    if(sessionRole !== "professor") {
      alert("Your are not allowed here!");
      window.location.href = "/"
    };

    const fetchProfiles = async () =>  {
      try{
        const profiles = await fetchBackend("professor/profile", "GET");
        setProfiles(profiles.data);
      } catch (err){
        console.error(err)
      }
    }
    
    fetchProfiles();

  },[])

  return(
    <div>
      <Link href="/" >Back</Link>
      <h1>Profiles</h1>

      <ProfileContainer
        profiles={profiles}
        setProfiles={setProfiles}
      />

      <AvailabilityPanel
        availabilities={availabilities}
        setAvailabilities={setAvailabilities}
      />
    </div>
  );
}

//panel container profiles
function ProfileContainer({profiles, setProfiles}:{
  profiles: ProfessorProfile[],
  setProfiles: React.Dispatch<React.SetStateAction<ProfessorProfile[]>>
}){

  const [year, setYear] = useState<number>(0);
  const [department, setDepartment] = useState<string>("");

  return (
    <form onSubmit={e=>addProfile(e)}
      className="flex flex-col gap-4 border-gray-500 border-2 border-solid rounded-md p-4 m-4"
    >
      <p
        className="font-bold text-center text-3xl"
      >
        YOUR PROFILES
      </p>

      <p>Add your Profile</p>
      
      <div className="flex flex-row gap-4">
        <FormInput type="number" label="Year" value={year.toString()} onChange={(e) => setYear(parseInt(e.target.value))} />
        <FormInput type="text" label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
      </div>

      <button type="submit">Add</button>

      <div className="border-gray-500 border-2 border-solid m-4 w-[full] rounded-md p-4">
        <div>Your Profiles </div>
        {profiles?.map((profile, index) => <ProfileCard key={index} profile={profile} />)}
      </div>
    </form>
  );

  //handler function for adding user profile
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

function AvailabilityPanel({availabilities, setAvailabilities}:{
  availabilities: SearchAvailabilityResponseDataItem[],
  setAvailabilities: React.Dispatch<React.SetStateAction<SearchAvailabilityResponseDataItem[]>>
}){
  return (
    <form
      className="flex flex-col gap-4 border-gray-500 border-2 border-solid rounded-md p-4 m-4"
    >
      Availability
    </form>
  );
}

//container for each profile
function ProfileCard({profile}:{profile: ProfessorProfile}) {
  return (
    <div className="flex flex-row gap-4">
      <div>Year: {profile.year}</div>
      <div>Department: {profile.department}</div>
    </div>
  );
}




//input form
function FormInput({type, label, value, onChange}: {
  type: string,
  label: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
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