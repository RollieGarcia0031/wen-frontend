"use client"

import fetchBackend from "@/lib/fetchBackend";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSendAppointment, SendAppointmentContextProvider } from "@/context/SendAppointment";

export default function Main () {
  return (
    <SendAppointmentContextProvider>
      <SendAppointment />
    </SendAppointmentContextProvider>
  );
}

export function SendAppointment(){
  
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
      <SendAptHeader />
    </div>
  );

}

function SendAptHeader(){
  const { userInfo } = useSendAppointment();

  return (
    <div
      className=""
    >
      <p> {userInfo.name} </p>

    </div>
  );
}
