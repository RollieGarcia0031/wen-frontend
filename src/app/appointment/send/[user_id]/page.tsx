"use client"

import fetchBackend from "@/lib/fetchBackend";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSendAppointment } from "@/context/SendAppointment";

export default function SendAppointment(){
  
  const { user_id } = useParams();

  const { setUserInfo } = useSendAppointment();

  useEffect(()=>{

    const fetchUserInfo = async () => {

      const reqBody = {
        professor_user_id: user_id
      }

      const response = await fetchBackend("search/professor/user", {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(reqBody)
      });

      if (!response.ok) return;

      const {data} = await response.json() as search_professor_user_response;

      if (data.length > 1) return; // make sure only one user exists

      setUserInfo(data[0]);
    }

    fetchUserInfo();
  }, []);

  return (
    <div>
      Hello
    </div>
  );

}
