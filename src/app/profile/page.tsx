"use client";

import ProfessorPage from "./ProfessorPage";
import StudentPage from "./StudentPage";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const sessionRole = sessionStorage.getItem("role");

    if (sessionRole) {
      setRole(sessionRole);
    }
  }, []);

  return (
    <>
    { role === "professor" && <ProfessorPage /> }
    { role === "student" && <StudentPage /> }
    { role === null && <div>loading</div> }
    </>
  );
}