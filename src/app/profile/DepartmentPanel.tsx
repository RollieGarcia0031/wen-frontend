"use client";

import fetchBackend from "@/lib/fetchBackend";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DepartmentPanel(){

  /**
   * The department that the user has joined
   */
  const [ joinedDepartment, setJoinedDepartment ] = useState<department_list_all_response_item[]>();

  useEffect(()=>{
    fetchJoinedDepartment();
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
            <DepartmentCard key={index} item={item} />
          )}
        </div>
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
}

function DepartmentCard({item}:{
  item: department_list_all_response_item
}){

  return (
    <div
      className="card2"
    >
      <p
        className="text-lg font-bold"
      >
        {item.name}
      </p>
      <p>
        {item.code}
      </p>
    </div>
  );
}