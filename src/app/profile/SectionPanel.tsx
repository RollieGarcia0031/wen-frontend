// TODO: fix adding new section, currently using -1 as default section id
// int the temporary card

"use client";

import { useAuth } from "@/context/AuthContext";
import SectionPanelContextProvider, { useSectionPanel } from "@/context/SectionPanelContext";
import fetchBackend from "@/lib/fetchBackend";
import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineRemoveCircleOutline, MdOutlineSaveAs } from "react-icons/md";
import { VscDiscard } from "react-icons/vsc";
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
      <div
        className="mt-8 space-y-4"
      >
        {ownedSections.map((item, index) => (
          <SectionCard key={index} item={item}/>
        ))}
      </div>

      <div
        className="my-2 space-x-2"
      >
        <button
          onClick={handleAddSection}
          className="bg-white text-black px-2 py-1 rounded-md
          mt-8 f flex-rc gap-1"
        >
          <IoIosAddCircleOutline className="fill-black"/>
          Add section
        </button>

        <div className="mt-4">
          {temporarySections.map((item, index) => (
            <TemporaryCard key={index} index={index}/>
          ))}
        </div>

        { temporarySections.length > 0 &&
          <div className="space-x-2 flex-rl mt-4">
            <button
              onClick={handleSave}
              className="bg-white text-black px-2 py-1 rounded-md
              flex-rc gap-1"
            >
              <MdOutlineSaveAs className="text-lg fill-black"/>
              Save
            </button>

            <button
              className="flex-rc bg-white text-black px-2 py-1 rounded-md"
              onClick={()=>setTemporarySections([])}
            >
              <VscDiscard className="fill-black"/>
              Discard Changes
            </button>
          </div>        
        }
      </div>

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
          className="bg-red-400 px-1 aspect-square rounded-xl"
          onClick={handleDelete}
        >
          <MdOutlineRemoveCircleOutline className="fill-black text-lg"/>
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

  const { refreshOwnedSections } = useSectionPanel();

  return (
    <div
      className="card p-4"
    >
      <p
        className="font-semibold"
      >
        {course_code} - {course_name}
      </p>
      <div>

      { //render the sections on each course
        sections.map((item, index) => (
        <div
          className="grid grid-cols-[1fr_auto]
            items-end
            gap-x-2 my-2 border-b-[1px] border-white" 
          key={index}
        >
          <p>
            {item.section_code} - {item.year_level}
          </p>

          <button
            className="bg-red-700 py-1 px-2 rounded-md mb-1 text-sm"
            onClick={()=>handleRemoveSection(item.section_id)}
          >
            Remove
          </button>
        </div>
      ))}

      </div>
    </div>
  );

  async function handleRemoveSection(section_id: number){
    const body = { section_id };

    try{
      const response = await fetchBackend("section/unenroll", {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(body)
      });

      const { message, success } = await response.json() as common_response;

      if (!response.ok || !success)
        throw new Error(message || "Unknown error occured");

      toast.success(message);
      refreshOwnedSections();
    } catch (error){
      if (error instanceof Error)
        toast.error(error.message);
    }
  }
}