"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBackend } from '@/lib/api';
import { ApiResponse, SearchAvailabilityResponseDataItem } from "@/lib/response";
import { IoIosRemoveCircleOutline } from "react-icons/io";

interface ProfessorProfile {
  id: number
  department: string;
  year: number;
}

export default function Profiles(){
  //profiles and availability that will render
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

    const fetchAvailabilities = async () =>  {
      try{
        const availabilities = await fetchBackend("professor/availability", "GET");

        if(!availabilities.data){return;}
        setAvailabilities(x=>availabilities.data);
      } catch (err){
        console.error(err)
      }
    }
    
    fetchAvailabilities();

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

        <div className="border-gray-500 border-2 border-solid m-4 w-[full] rounded-md p-4
          flex flex-col gap-2">
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
          {profiles?.map((profile, index) =>
            <ProfileCard key={index}
              profile={profile}
              setProfiles={setProfiles}
              index={index}
              profile_id={profile.id}
            />
          )}
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
        if(!response.data){return;}
        const new_id: number = response.data['id'];

        setProfiles(x=>{
          const newProfile: ProfessorProfile = { department, year, id: new_id };
          return [...x, newProfile];
        });
        alert(response.message);
      }

    } catch(err){
      console.error(err);
    }
  }
}

//container for each profile
function ProfileCard({profile, setProfiles, index, profile_id}:{
  profile: ProfessorProfile,
  setProfiles: React.Dispatch<React.SetStateAction<ProfessorProfile[]>>,
  index: number,
  profile_id: number
}) {
  return (
    <div
      className="flex flex-row
      border-b-highlight-muted border-b-[1px] border-b-solid
      sm:pb-2"
    >
      <div className="flex flex-row gap-4 flex-1 justify-start
        h-full"
      >
        <p>Year: {profile.year}</p>
        <p>Department: {profile.department}</p>
      </div>

      <div>
        <button
          type='button'
          onClick={removeProfile}
        >
          <IoIosRemoveCircleOutline className="sm:text-2xl fill-red-600" />
        </button>
      </div>
    </div>
  );

  async function removeProfile(){
    const body = {id : profile_id};
    const header = {"Content-Type": 'application/json'}

    const res = await fetchBackend(
      "professor/profile",
      "DELETE",
      JSON.stringify(body),
      header
    );
    if(res.success){
      setProfiles(x => x.filter((_, i) => i !== index));
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
    <div
      className="w-full flex-row-center"
    >
      <form
        className="flex flex-col gap-4 border-gray-500 border-2 border-solid rounded-md p-4 m-4
        sm:w-[40rem]"
        onSubmit={e=>handleSubmit(e)}
      >
        <p 
          className="font-bold text-center text-3xl my-6"
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

        <div className="flex flex-col gap-2">
          {availabilities?.map((availability, index) =>
            <AvailabilityCard
              key={index}
              availability={availability}
              setAvailabilities={setAvailabilities}
            />
          )}
        </div>
      </form>
    </div>
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

        setAvailabilities(x => {
          const id = response?.data?.id;
          if(id === undefined) return x;
          const newAvailability: SearchAvailabilityResponseDataItem = {
            day_of_week: day,
            start_time,
            end_time,
            id
          };

          return [...x, newAvailability];

        });
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


function AvailabilityCard({availability, setAvailabilities}:{
  availability: SearchAvailabilityResponseDataItem,
  setAvailabilities: React.Dispatch<React.SetStateAction<SearchAvailabilityResponseDataItem[]>>
}){
  const { day_of_week, start_time, end_time, id } = availability;

  return (
    <div className="w-full">
      <div className="flex flex-row w-full justify-between
        border-b-highlight-muted border-b-[1px] border-b-solid
        sm:mt-2"
      >
        <p
          className="font-bold text-2xl"
        >
          {day_of_week}
        </p>

        <div>
          <button
            type='button'
            onClick={handleRemove}
            className="flex-1"
          >
            <IoIosRemoveCircleOutline
              className="sm:text-2xl fill-red-600"
            />
          </button>
        </div>

      </div>
      <div
        className="flex flex-row gap-4"
      >
        <p>{start_time.substring(0, 5)}</p>
        <p>{end_time.substring(0, 5)}</p>
      </div>
    </div>
  );

  async function handleRemove(){
    
    try{
      const body = {id};
      const response = await fetchBackend(`professor/availability`, "DELETE", JSON.stringify(body));

      if(response.success && response.data.id === id) {
        setAvailabilities(x => x.filter(availability => availability.id !== id));
        return;
      }
      
      alert(response.message);

    } catch (err) {
      console.error(err);
    }
    
  }
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