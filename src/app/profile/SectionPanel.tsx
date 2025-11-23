"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function SectionPanel(){
  const { user } = useAuth();

  const [ sections, setSections ] = useState<section_list_all_response_item[]>([]);
  const [ ownedSections, setOwnedSections ] = useState<section_list_all_response_item[]>([]);
  const [ temporarySections, setTemporarySections ] = useState<section_list_all_response_item[]>([]);

  return (
    <div className="card2">
      <div>
        <p className="text-lg font-bold">Section</p>
        <p>
          {user?.role === 'professor' &&
          "The sections that you are currently teaching."
          }
          {
            user?.role === 'student' &&
            "The sections that you are currently enrolled in."
          }
        </p>
      </div>

      {/* main container of courses*/}
      <div>

      </div>

      <button
        onClick={handleAddSection}
        className="bg-secondary text-black px-2 py-1 rounded-md"
      >
        Add section
      </button>
    </div>
  );

  function handleAddSection(){
    temporarySections.push({
      course_code: '',
      course_name: '',
      sections: []
    });
  }
}

function TemporaryCard(){

}