"use client";

import fetchBackend from "@/lib/fetchBackend";
import { availableMemory } from "process";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { VscDiscard } from "react-icons/vsc";
import { toast } from "react-toastify";

export default function DepartmentPanel(){

  /**
   * The department that the user has joined
   */
  const [ joinedDepartment, setJoinedDepartment ] = useState<department_list_all_response_item[]>([]);
  const [ allDepartments, setAllDepartments ] = useState<department_list_all_response_item[]>([]);
  /**
   * Ids of the departments to be added
   */
  const [ temporaryDepartments, setTemporaryDepartments ] = useState<number[]>([]);

  useEffect(()=>{
    fetchJoinedDepartment();
    fetchAllDepartments();
  },[]);

  return (
    <div
      className="card2"
    >

      <div>
        <p
          className="text-lg font-bold"
        >
          Department
        </p>
        <p>
          The department that you belong
        </p>

        <div>
          {joinedDepartment?.map((item, index) =>
            <DepartmentCard key={index} item={item}
              refreshJoinedDepartment={fetchJoinedDepartment}
            />
          )}
        </div>

        <button
          onClick={()=>setTemporaryDepartments(x=>[...x, 1])}
          className="bg-white text-black py-1 px-3 rounded-md mt-8
          disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={temporaryDepartments.length > allDepartments.length-1}
        >
          Join a department
        </button>

        {/* Shows the departments that you can join */}
        <div
          className="mt-4 px-10"
        >
          {
            temporaryDepartments.map((id, index)=>
              <TemporaryDepartmentCard key={index} index={index}
                allDepartments={allDepartments}
                setTemporaryDepartments={setTemporaryDepartments}
                temporaryDepartments={temporaryDepartments}
              />
            )
          }
        </div>

        { temporaryDepartments.length > 0 &&
          <div
            className="flex-rl gap-2 mt-4
            [&_button]:flex [&_button]:flex-row [&_button]:px-3 [&_button]:py-1 [&_button]:rounded-md"
          >
            <button
              onClick={handleSave}
              className="bg-white text-black rounded-md"
            >
              Save
            </button>

            <button
              onClick={()=>setTemporaryDepartments([])}
              className="bg-white text-black"
            >
              <VscDiscard className="text-xl fill-black" />
              Discard
            </button>
          </div>
        }

      </div>
    </div>
  );

  async function fetchJoinedDepartment(){
    try {
      const response = await fetchBackend("department/list/joined",{
        method: "GET",
        headers: { 'Content-Type' : 'application/json' }
      });

      const { data, message, success } = await response.json() as department_list_joined_response;

      if (!response.ok || !success)
        throw new Error(message || "Failed to fetch joined department");

      setJoinedDepartment(data);
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    }
  }

  async function fetchAllDepartments(){
    try {
      const response = await fetchBackend("department/list/all",{
        method: "GET",
        headers: { 'Content-Type' : 'application/json' }
      });

      const { data, message, success } = await response.json() as department_list_all_response; 

      if (!response.ok || !success)
        throw new Error(message || "Failed to fetch all departments");

      setAllDepartments(data);
  } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    }
  }

  async function handleSave(){
    try {
      const response = await fetchBackend("department/join/multi",{
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ department_ids: temporaryDepartments })
      });

      const { message, success } = await response.json() as common_response;

      if (!response.ok || !success)
        throw new Error(message || "Failed to join department");

      toast.success(message);
      fetchJoinedDepartment();
      setTemporaryDepartments([]);
    } catch (error){
    if (error instanceof Error)
      toast.error(error.message);
    }
  }
}

function DepartmentCard({item, refreshJoinedDepartment}:{
  item: department_list_all_response_item,
  refreshJoinedDepartment: () => void
}){

  const { code, id, name } = item;

  return (
    <div
      className="card2 grid grid-cols-3 items-center"
    >
      <p
        className="text-lg font-bold"
      >
        {name}
      </p>
      <p>
        {code}
      </p>

      <button
        onClick={handleLeave}
        className="bg-red-700 rounded-md"
      >
        Leave
      </button>
    </div>
  );

  async function handleLeave(){
    try {
      const response = await fetchBackend("department/leave",{
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ department_id: id })
      });

      const { message, success } = await response.json() as common_response;

      if (!response.ok || !success)
        throw new Error(message || "Failed to leave department");

      toast.success(message);

    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    } finally {
      refreshJoinedDepartment();
    }
  }
}

function TemporaryDepartmentCard({index, allDepartments, setTemporaryDepartments, temporaryDepartments}:{
  index: number,
  allDepartments: department_list_all_response_item[],
  setTemporaryDepartments: Dispatch<SetStateAction<number[]>>,
  temporaryDepartments: number[]
}){
  return (
    <div
      className="my-2 grid grid-cols-[1fr_auto] items-center justify-center gap-5"
    >
      <select
        value={temporaryDepartments[index]}
        onChange={e => handleChange(e)}
      >
        {
          allDepartments.map((item, index)=>
            <option key={index} value={item.id}>
              {`${item.code}   -   ${item.name}`}
            </option>
          )
        }
      </select>

      <button
        onClick={handleRemove}
      >
        <IoRemoveCircleOutline className="text-xl" />
      </button>
    </div>
  );

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>){
    setTemporaryDepartments(prev => {
      const newTemporaryDepartments = [...prev];
      newTemporaryDepartments[index] = Number(event.target.value);
      return newTemporaryDepartments;
    });
  }

  function handleRemove(){
    setTemporaryDepartments(prev => prev.filter((_, i) => i !== index));
  }
}