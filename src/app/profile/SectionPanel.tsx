"use client"

import { useAuth } from "@/context/AuthContext";
import SectionPanelContextProvider from "@/context/SectionPanelContext";
import { TemporarySectionItem, useSectionPanel } from "@/context/SectionPanelContext";
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
    sections,
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
            <TemporaryCard key={index} index={index} item={item}/>
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
    setTemporarySections(prev => [...prev, { courseId: 0, sectionId: 0 }]);
  }

  async function handleSave(){

    try{
      const sectionsToEnroll = temporarySections.filter(item => item.sectionId !== 0);

      if (sectionsToEnroll.length === 0) {
        toast.info("No sections selected to save.");
        return;
      }

      // Perform validation for each selected temporary section
      for (const tempItem of sectionsToEnroll) {
        const correspondingCourse = sections.find(
          (course) => course.course_id === tempItem.courseId
        );

        if (!correspondingCourse) {
          throw new Error(`Course with ID ${tempItem.courseId} not found for selected section.`);
        }

        const sectionExistsInCourse = correspondingCourse.sections.some(
          (section) => section.section_id === tempItem.sectionId
        );

        if (!sectionExistsInCourse) {
          throw new Error(
            `Selected section ID ${tempItem.sectionId} does not belong to course ID ${tempItem.courseId}.`
          );
        }
      }

      const section_ids = sectionsToEnroll.map(item => item.sectionId);

      const response = await fetchBackend("section/enroll/all", {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ section_ids: section_ids })
      });

      const { success, message } = await response.json() as common_response;

      if (!response.ok || !success)
        throw new Error(message || "Unkown error occured");

      toast.success(message);

    }catch(error){
      if (error instanceof Error)
        toast.error(error.message);
      else
        toast.error("An unexpected error occurred during save.");
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
function TemporaryCard({index, item}:{
  index: number,
  item: TemporarySectionItem
}){

  const { sections, setTemporarySections, temporarySections, ownedSections } = useSectionPanel();
  const [ selectedCourseId, setSelectedCourseId ] = useState(item.courseId);

  // get the sections that match the selected course
  const matchingSections = sections.filter(s_item => s_item.course_id === selectedCourseId);
  // get the sections, that are not haven't been used
  const availableSections = matchingSections[0]?.sections.filter(s_item => {
    const ownedIds = ownedSections.map(o_item => o_item.sections.map(o_sec => o_sec.section_id)).flat();
    // Exclude the current item's sectionId from the temporarySectionIds check
    const otherTemporarySectionIds = temporarySections
                                      .filter((_, i) => i !== index)
                                      .map(t_item => t_item.sectionId);
    return !ownedIds.includes(s_item.section_id) && !otherTemporarySectionIds.includes(s_item.section_id);
  });

  useEffect(()=>{
    // Update the item's courseId when selectedCourseId changes
    setTemporarySections(prev => prev.map((t_item, i) =>
      i === index ? { ...t_item, courseId: selectedCourseId, sectionId: 0 } : t_item
    ));
  }, [selectedCourseId]);


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
        <option value={0}>Select course</option>
        {sections.map((s_item, s_index) => (
          <option
            key={s_index}
            value={s_item.course_id}
          >
            {s_item.course_name}
          </option>
        ))}
      </select>
      
      {
        availableSections && availableSections.length > 0 && selectedCourseId !== 0 ?
        <select
          value={item.sectionId}
          onChange={e=>handleSelectSectionId(e)}
        >
          <option value={0}>Select section</option>
          {availableSections.map((s_item, s_index) => (
            <option
              key={s_index}
              value={s_item.section_id}
            >
              {s_item.section_code} - {s_item.year_level}
            </option>
          ))}
        </select>
        :
        <select
          value={0}
          disabled
        >
          <option value={0}>No sections available</option>
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
    const newSectionId = Number(event.currentTarget.value);
    setTemporarySections(prev => prev.map((t_item, i) =>
      i === index ? { ...t_item, sectionId: newSectionId } : t_item
    ));
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
