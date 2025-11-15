import { useEffect, useRef, useState } from "react";
import { IoMdRemoveCircle, IoMdSettings } from "react-icons/io";
import CustomCourseDialog from "./CustomCourseDialog";
import { BiCollapseVertical } from "react-icons/bi";
import fetchBackend from "@/lib/fetchBackend";
import { MdOutlineAdd } from "react-icons/md";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useProfileContext } from "@/context/ProfileContext";


export default function CoursePanel(){
  const customCourseDialogRef = useRef<HTMLDialogElement>(null);

  /** the array of courses created by other users, serving as option for users to enroll */
  const [ courseChoices, setCourseChoices ] = useState<courseListItem[]>([]);
  
  /**
  * state of the coursePicker, a panel below the course
  * & year input, that can be collapsed
  */
  const [ coursePickerIsOpen, setCoursePickerIsOpen ] = useState<boolean>(false);

  /**
   * the index of the course in the courseList hook, it will be used to assign
   * which course to delete or which course can be operated specifically
   */
  const [ selectedCourseIndex, setSelectedCourseIndex ] = useState<number>(-99);
  const selectedCourse = courseChoices[selectedCourseIndex];

  const { courseList, setCourseList } = useProfileContext();

  useEffect(()=>{
    /**
     * Fetch the list of the available courses to be enrolled
     */
    const fetchCourses = async (): Promise<void>=>
    {
      const response = await fetchBackend("course/list", {
        method: "GET",
        headers: { 'Content-type': 'application/json' }
      });

      if (response.ok){
        const json = await response.json() as course_list_response;

        setCourseChoices(json.data);
      }
    }

    fetchCourses();

    /**
     * retrieves the class where the logged user is enrolled/teaching
     */
    const fetchOwnedCourses = async ():Promise<void> =>
    {
      const response = await fetchBackend("course/assigned", {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
      });

      if (response.ok){
        const { data } = await response.json() as course_assigned_response;
        setCourseList(data);
      }
    }

    fetchOwnedCourses();
  }, []);

  return (
    <>
    <div className="card2 space-y-4">
      {/* header part of the courses panel */}
      <div className="flex-rl gap-2 items-center">
        <button className="svg-btn-sm common-button rounded-full aspect-square"
          title="You can add your own course if not listed in the options"
          onClick={()=>customCourseDialogRef.current?.showModal()}
        >
          <IoMdSettings/>
        </button>
        <h3>Courses</h3>
      </div>

      {/*This contains the list of courses that the user is enrolled/teaching*/}
      <div className="bg-background-medium px-4 py-2 rounded-md
        [&>*]:grid [&>*]:grid-cols-[3rem_6rem_auto_3rem] grid-rows-1
        "
      >
        {/* The headings of the table */}
        <div>
          <p>Year</p>
          <p>Name</p>
          <p>Desc</p>
          <p></p>
        </div>

        <AnimatePresence>
          {/* The cells of table containing the course list */}
          {courseList.map(course =>
            <motion.div key={course.id}
              initial={{ opacity: 0, height: 'auto', marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 0, translateX:0 }}
              exit={{ opacity: 0, height: 'auto', marginBottom: 0, translateX: -40 }}
              transition={{ duration: 0.2}}
              className="my-4"
            >
              <p>{course.year}</p>
              <p>{course.name}</p>
              <p>{course.description}</p>
              <button
                onClick={()=>handleRemoveCourse(course.id)}
              ><IoMdRemoveCircle/></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* shows the available course with option to use/add it */}
      <div className="[&>*]:bg-background-medium [&>*]:rounded-md">
        {/* contains input for adding a course */}
        <form onSubmit={handleAddCourse}
          className="flex-rl items-center mb-2 px-4 py-2"
        >
          {/*
          * trigger button for picking a courses 
          * collapse/uncollapse the list containing the available courses
          */}
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
          
          {/* Takes user input as year (1,2,3,4) */}
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

        {/* list containing the available courses to enroll */}
        <div className={`duration-150 [&>*]:px-4
          ${ coursePickerIsOpen?
            'max-h-50 overflow-y-auto'
            :'max-h-0 overflow-y-hidden'
          }
          `}>
         
            {/* table headers of course list container */}
            <div className="grid grid-cols-[6rem_auto] space-x-7 rounded-none
              sticky top-0 bg-background-medium py-2"
            >
              <p>Name</p>
              <p>Description</p>
            </div>

            <AnimatePresence>
              {/* table cell containing all available courses */}
              {courseChoices.map((course, index) =>
                <motion.button
                  className={`grid grid-cols-[6rem_auto] space-x-7
                    hover:bg-background-light justify-items-start w-full
                    py-1
                    ${selectedCourseIndex === index? 'bg-primary':''}
                  `}
                  key={course.id}
                  onClick={()=>setSelectedCourseIndex(index)}
                  initial={{ opacity: 0, height: 'auto', marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                  exit={{ opacity: 0, height: 'auto', marginBottom: 0 }}
                  transition={{ duration: 0.3}}
                >

                  <p>{course.name}</p>
                  <p>{course.description}</p>

                </motion.button>
              )}
            </AnimatePresence>
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
    if(!selectedCourse) return toast.warn('Select a course first');

    // use the data from the input
    const formData =  new FormData(e.currentTarget);

    // append the dynamic input from the course list table
    formData.append('course_id', `${selectedCourse.id}`);
    const data = Object.fromEntries(formData);

    const response = await fetchBackend("course/use",{
      method: "POST",
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok){
      // make sure to reset/remove the selected course for next use
      setSelectedCourseIndex(-99);

      // extract the new id
      const { data: { new_id } } = await response.json() as course_use_response;

      // construct a new course, to update the hook
      const newOwnedCourse: course_assigned_item = {
        id: new_id,
        description: selectedCourse.description,
        name: selectedCourse.name,
        year: parseInt(data['year'] as string)
      };

      setCourseList(x => [...x, newOwnedCourse]);
    } else {
      const json = await response.json() as common_response;
      alert(json.message);
    }
  }

  /**
   * Used to remove a course a course in the database and update the UI
   * @param courseId the id of the course to be remove from user_class
   */
  async function handleRemoveCourse(courseId: number):Promise<void>{
    // remove from the database
    const response = await fetchBackend("course/unuse", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({course_id: courseId})
    });

    // handle error if no rows are deleted
    if (!response.ok || response.status === 400){
      const {message} = await response.json() as common_response;
      alert(message);
      return;
    }

    const {success} = await response.json() as common_response;
    if (success){
      // remove from the ui list
      setCourseList(x => x.filter(course => course.id !== courseId));
    }
  }
}
