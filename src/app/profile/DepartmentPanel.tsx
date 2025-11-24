"use client";

import fetchBackend from "@/lib/fetchBackend";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DepartmentPanel(){

  /**
   * The department that the user has joined
   */
  const [ joinedDepartment, setJoinedDepartment ] = useState<department_list_all_response_item[]>();
  const [ allDepartments, setAllDepartments ] = useState<department_list_all_response_item[]>();

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
          className="bg-white text-black py-1 px-3 rounded-md mt-4"
        >
          Join a department
        </button>
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