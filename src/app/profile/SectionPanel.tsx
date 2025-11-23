"use client";

import { useAuth } from "@/context/AuthContext";
import SectionPanelContextProvider, { useSectionPanel } from "@/context/SectionPanelContext";
import fetchBackend from "@/lib/fetchBackend";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Main(){
  return (
    <SectionPanelContextProvider>
      <SectionPanel/>
    </SectionPanelContextProvider>
  );
}

export function SectionPanel(){
  const { user } = useAuth();

  const {
    temporarySections,
    setTemporarySections,
    ownedSections,
    refreshOwnedSections
  } = useSectionPanel();

  useEffect(()=>{
    refreshOwnedSections();
  }, []);

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

        {ownedSections.map((item, index) => (
          <SectionCard key={index} item={item}/>
        ))}
      </div>

      <div
        className="my-2 space-x-2"
      >
        <button
          onClick={handleAddSection}
          className="bg-white text-black px-2 py-1 rounded-md"
        >
          Add section
        </button>

        {
          temporarySections.length > 0 &&
          <button
            className="bg-white text-black px-2 py-1 rounded-md"
            onClick={()=>setTemporarySections([])}
          >
            Reset
          </button>
        }
      </div>

      {
        temporarySections.length > 0 &&
        <button
          onClick={handleSave}
          className="bg-secondary text-black px-2 py-1 rounded-md"
        >
          Save
        </button>
      }
    </div>
  );

  function handleAddSection(){
    setTemporarySections(prev => [...prev, -1]);
  }

  async function handleSave(){

    try{
      const response = await fetchBackend("section/enroll/all", {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ section_ids: temporarySections })
      });

      const { success, message } = await response.json() as common_response;

      if (!response.ok || !success)
        throw new Error(message || "Unkown error occured");

      toast.success(message);

    }catch(error){
      if (error instanceof Error)
        toast.error(error.message);
    } finally {
      refreshOwnedSections();
      setTemporarySections([]);
    }
  }
}

/**
 * Display a card for a temporary section
 * these sections can be removed ore added later
 * when the user desires to save it in database
 */
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
      className="grid grid-cols-[1fr_1fr_auto]
        gap-x-2 my-2"
    >
      <select
        className="py-1"
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

/**
 * Displays the card of section that
 * the user is currently belonged to
 */
function SectionCard({item}:{
  item: section_list_all_response_item
}){
  const {
    course_code,
    course_name,
    sections
  } = item;

  return (
    <div>
      <p>
        {course_code} - {course_name}
      </p>
      {sections.map((item, index) => (
        <p
          key={index}
        >
          {item.section_code} - {item.year_level}
        </p>
      ))}
    </div>
  );
}