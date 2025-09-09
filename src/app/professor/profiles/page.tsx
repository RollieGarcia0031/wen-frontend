"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBackend } from '@/lib/api';
import { ApiResponse, SearchAvailabilityResponseDataItem } from "@/lib/response";

interface ProfessorProfile {
  department: string;
  year: number;
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
    <div
      className="flex-row-center gap-4 max-w-full"
    >
      <form onSubmit={e=>addProfile(e)}
        className="flex flex-col border-gray-500 border-2 border-solid rounded-md
          p-4 m-4 gap-4 sm:w-[40rem]"
      >
        <p
          className="font-bold text-center text-3xl
          sm:my-4"
        >
          Your Profiles
        </p>

        <div
          className="grid grid-cols-[7rem_auto] justify-center items-start
          sm:gap-2"
        >
          <FormInput type="number" label="Year" value={year.toString()} onChange={(e) => setYear(parseInt(e.target.value))} />
          <FormInput type="text" label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </div>

        <div className="flex-row-center">
          <button type="submit"
            className="border-primary border-2 border-solid rounded-md bg-primary text-white hover:bg-primary-hover hover:text-black duration-150
              sm:px-10 sm:py-1"
          >
            Add
          </button>
        </div>

        <div className="border-gray-500 border-2 border-solid m-4 w-[full] rounded-md p-4">
          {profiles?.length === 0 && (
            <div className="text-center">
              <p>No Profiles</p>
              <p
                className="text-sm text-text-muted
                sm:mt-5 sm:mb-3"
              >
                You can add a new profile by filling the form, and clicking "Add"
              </p>
            </div>)}
          {profiles?.map((profile, index) => <ProfileCard key={index} profile={profile} />)}
        </div>
      </form>
    </div>
  );

  //handler function for adding user profile
  async function addProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = JSON.stringify({year, department});
    const headers = new Headers({"Content-Type": "application/json"});
    try{
      const response: ApiResponse = await fetchBackend("professor/profile", "POST", body, headers);

      if(response.success) {
        setYear(0);
        setDepartment("");
        setProfiles(x=>{
          const newProfile: ProfessorProfile = { department, year};
          return [...x, newProfile];
        });
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
  type day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  const [day, setDay] = useState<day>("Monday");
  const [start_time, setStartTime] = useState<string>("");
  const [end_time, setEndTime] = useState<string>("");

  return (
    <form
      className="flex flex-col gap-4 border-gray-500 border-2 border-solid rounded-md p-4 m-4"
      onSubmit={e=>handleSubmit(e)}
    >
      <p 
        className="font-bold text-center text-3xl"
      >
        Availabilities
      </p>

      <div className="flex flex-row gap-4">
        <select value={day} onChange={(e) => setDay(e.target.value as day)}>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <FormInput type="time" label="Start Time" value={start_time} onChange={(e) => setStartTime(e.target.value)} />
        <FormInput type="time" label="End Time" value={end_time} onChange={(e) => setEndTime(e.target.value)} />

        <button type="submit">Add</button>
      </div>

    </form>
  );

  //  handler function for adding availability of professor
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const body = {
      day,
      start: `${start_time}:00`,
      end: `${end_time}:00`
    };

    const headers = new Headers({"Content-Type": "application/json"});

    try {
      const response = await fetchBackend("professor/availability", "POST", JSON.stringify(body), headers);

      if(response.success && response.data) {
        setDay("Monday");
        setStartTime("");
        setEndTime("");

        setAvailabilities(x => [...x, response.data]);
      }
      alert(response.message);
    } catch (error) {
      console.error(error);
      if(error instanceof Error){
        alert(error.message);
      }
    }
  }
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
    <>
    <label className="font-semibold">
      {label}:
    </label>
    <input type={type}
      value={value}
      onChange={onChange}
      required
    />
    </>
  );
}