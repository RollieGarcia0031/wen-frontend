import { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import CustomCourseDialog from "./CustomCourseDialog";
import { BiCollapseVertical } from "react-icons/bi";
import fetchBackend from "@/lib/fetchBackend";
import { MdOutlineAdd } from "react-icons/md";


export default function CoursePanel(){
  const customCourseDialogRef = useRef<HTMLDialogElement>(null);

  const [ courseList, setCourseList ] = useState<courseListItem[]>([]);
  const [ coursePickerIsOpen, setCoursePickerIsOpen ] = useState<boolean>(false);
  const [ selectedCourseIndex, setSelectedCourseIndex ] = useState<number>(-99);
  const selectedCourse = courseList[selectedCourseIndex];

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

      {/* shows the available course with option to use/add it */}
      <div className="[&>*]:bg-background-medium [&>*]:rounded-md">
        {/* contains input for adding a course */}
        <form onSubmit={handleAddCourse}
          className="flex-rl items-center mb-2 px-4 py-2"
        >
          {/* trigger button for picking a course */}
          <label className="flex-rl gap-2 min-w-[7rem]
            border-r-highlight-muted border-r-[1px] border-r-solid"
          >
            <button onClick={()=>setCoursePickerIsOpen(x=>!x)} type='button'
              className="flex-rl items-center gap-4"  
            >
              <BiCollapseVertical/>
              <p>{selectedCourse?.name}</p>
            </button>
          </label>

          <label className="px-5 flex-1">
            Year:
            <select name="year">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
          {/* button for adding/using an available course */}
          <button type='submit'>
            <MdOutlineAdd/>
          </button>
        </form>
        <div className={`duration-150 [&>*]:px-4 space-y-1
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
            {courseList.map((course, index) =>
              <button className={`grid grid-cols-[6rem_auto] space-x-7
                hover:bg-background-light justify-items-start w-full
                ${selectedCourseIndex === index? 'bg-primary':''}
                `}
                key={course.id}
                onClick={()=>setSelectedCourseIndex(index)}
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

  /**
   * Used to assign the selected course to the logged user
   */
  async function handleAddCourse(e: React.SyntheticEvent<HTMLFormElement>){
    e.preventDefault();
    if(!selectedCourse)return;

    const formData =  new FormData(e.currentTarget);
    formData.append('course_id', `${selectedCourse.id}`);

    const data = Object.fromEntries(formData);

    console.log(data);

    const response = await fetchBackend("course/use",{
      method: "POST",
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok){
      setSelectedCourseIndex(-99);
    } else {
      const json = await response.json() as common_response;
      alert(json.message);
    }
  }
}