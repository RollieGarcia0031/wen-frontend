"use client";

import { useAuth } from "@/context/AuthContext";
import SectionPanelContextProvider, { useSectionPanel } from "@/context/SectionPanelContext";
import React, { useEffect, useState } from "react";

export default function Main(){
  return (
    <SectionPanelContextProvider>
      <SectionPanel/>
    </SectionPanelContextProvider>
  );
}

export function SectionPanel(){
  const { user } = useAuth();

  const { temporarySections, setTemporarySections } = useSectionPanel();
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
        {temporarySections.map((item, index) => (
          <TemporaryCard key={index} index={index}/>
        ))}
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
    setTemporarySections(prev => [...prev, -1]);
  }
}

function TemporaryCard({index}:{
  index: number
}){

  const { sections, setTemporarySections, temporarySections } = useSectionPanel();
  const [ selectedCourseId, setSelectedCourseId ] = useState(sections[0].course_id);

  // get the sections that match the selected course
  const matchingSections = sections.filter(item => item.course_id === selectedCourseId);

  // get the sections, that are not haven't been used
  const availableSections = matchingSections[0]
    ?.sections.filter(item =>
      !temporarySections.includes(item.section_id)
    );  

  useEffect(()=>{
    console.log('selected', temporarySections);
  }, [temporarySections]);

  return (
    <div
      className="grid grid-cols-[auto_auto_1fr]"
    >
      <select
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(Number(e.target.value))}
      >
        {sections.map((item, index) => (
          <option
            key={index}
            value={item.course_id}
          >
            {item.course_name}
          </option>
        ))}
      </select>
      
      {
        matchingSections.length > 0 &&
        <select
          value={temporarySections[index]}
          onChange={e=>handleSelectSectionId(e)}
        >
          {matchingSections[0].sections.map((item, index) => (
            <option
              key={index}
              value={item.section_id}
            >
              {item.section_code} - {item.year_level}
            </option>
          ))}
        </select>
      }
        
      <div className="flex-rr">
        <button
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>    
  );

  function handleSelectSectionId(event: React.SyntheticEvent<HTMLSelectElement>){    
    const newSections = [...temporarySections];
    newSections[index] = Number(event.currentTarget.value);
    setTemporarySections(newSections);
  }
  function handleDelete(){
    console.log('delete')
    // remove the temporary list in UI
    setTemporarySections(list => [
      ...list.slice(0, index),
      ...list.slice(index + 1)
    ]);
  }
        
}