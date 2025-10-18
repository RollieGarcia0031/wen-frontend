import { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import CustomCourseDialog from "./CustomCourseDialog";
import { BiCollapseVertical } from "react-icons/bi";
import fetchBackend from "@/lib/fetchBackend";


export default function CoursePanel(){
  const customCourseDialogRef = useRef<HTMLDialogElement>(null);

  const [ courseList, setCourseList ] = useState<courseListItem[]>([]);
  const [ coursePickerIsOpen, setCoursePickerIsOpen ] = useState<boolean>(false);

  useEffect(()=>{
    const fetchCourses = async ()=>{
      const response = await fetchBackend("course/list", {
        method: "GET",
        headers: { 'Content-type': 'application/json' }
      });

      if (response.ok){
        const json = await response.json() as course_list_response;

        setCourseList(json.data);
      }
    }

    fetchCourses();
  }, []);

  return (
    <>
    <div className="card2 space-y-4">
      <div className="flex-rl gap-2 items-center">
        <button className="svg-btn-sm common-button rounded-full aspect-square"
          title="You can add your own course if not listed in the options"
          onClick={()=>customCourseDialogRef.current?.showModal()}
        >
          <IoMdSettings/>
        </button>
        <h3>Courses</h3>
      </div>

      <div className="[&>*]:bg-background-medium [&>*]:rounded-md">
        <label className="flex-rl gap-2 mb-4 p-2">
          Pick
          <button onClick={()=>setCoursePickerIsOpen(x=>!x)}>
            <BiCollapseVertical/>  
          </button>
        </label>
        <div className={`duration-150 [&>*]:px-4
          ${ coursePickerIsOpen?
            'max-h-50 overflow-y-auto'
            :'max-h-0 overflow-y-hidden'
          }
          `}>
          
            <div className="grid grid-cols-[6rem_auto] space-x-7 rounded-none
              sticky top-0 bg-background-medium py-2"
            >
              <p>Name</p>
              <p>Description</p>
            </div>
            {courseList.map(course =>
              <button className="grid grid-cols-[6rem_auto] space-x-7
                hover:bg-background-light justify-items-start w-full"
                key={course.id}
              >
                <p>{course.name}</p>
                <p>{course.description}</p>
              </button>
            )}
        </div>
      </div>
    </div>
    <CustomCourseDialog ref={customCourseDialogRef}/>
    </>
  );
}