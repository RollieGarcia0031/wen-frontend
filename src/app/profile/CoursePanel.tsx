import { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import CustomCourseDialog from "./CustomCourseDialog";


export default function CoursePanel(){
  const customCourseDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
    <div className="card2">
      <div className="flex-rl gap-2 items-center">
        <button className="svg-btn-sm common-button rounded-full aspect-square"
          title="You can add your own course if not listed in the options"
          onClick={()=>customCourseDialogRef.current?.showModal()}
        >
          <IoMdSettings/>
        </button>
        <h3>Courses</h3>
      </div>
    </div>
    <CustomCourseDialog ref={customCourseDialogRef}/>
    </>
  );
}