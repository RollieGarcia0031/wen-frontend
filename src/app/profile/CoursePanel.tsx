import { useAuth } from "@/context/AuthContext";
import fetchBackend from "@/lib/fetchBackend";
import { useEffect, useRef, useState } from "react";
import { IoMdAddCircleOutline, IoMdCloseCircleOutline, IoMdCreate } from "react-icons/io";
import { MdDeleteForever, MdOutlineCancel, MdOutlineCheck, MdOutlineDeleteOutline } from "react-icons/md";

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
          <IoMdAddCircleOutline/>
        </button>
        <h3>Courses</h3>
      </div>
    </div>
    <CustomCourseDialog ref={customCourseDialogRef}/>
    </>
  );
}

function CustomCourseDialog({ref}:{
  ref: React.RefObject<HTMLDialogElement | null>
}){

  /** Used to render the courses */
  const [courseList, setCourseList] = useState<SelfCourseItem[]>([]);
  /** Used to render a confirmation pop up before deleting a course */
  const [selectedCourseId, setSelectedCourseId] = useState<number>(-1);

  useEffect(()=>{
    const fetchCourses = async ()=>{
      const response = await fetchBackend("course/list/self",{
        method: "GET",
        headers: {"Content-Type": 'application/json'}
      });

      const json = await response.json() as course_list_self_response;

      if (response.ok) setCourseList(json.data);
    }

    fetchCourses();
  }, []);

  return (
    <dialog ref={ref} className="w-[40rem] open:h-[70dvh] rounded-2xl
      overflow-x-hidden"
    >
      <div className="flex-cr space-y-4 px-10">
        {/* close button */}
        <div className="flex-rr">
          <button className="svg-btn-sm *:fill-red-600"
            onClick={()=>ref.current?.close()}
          >
            <IoMdCloseCircleOutline />
          </button>
        </div>

        <p className="text-center text-xl">
          Create New Course
        </p>

      {/* form for adding a new course */}
        <form
          className="card2 py-4 px-8"
          onSubmit={addCourse}
        >
          <div className="flex-cl gap-2">
            <div className="flex-rl">
              <label className="flex-1">
                Course Name
              </label>
                <button type='submit'>
                  <IoMdCreate/>
                </button>
            </div>

            <div className="flex-rc gap-2">
              <div className="space-y-2">
                <input type='text' name="name" placeholder="Ex: CpE" required/>
                <input type='text' name="description" placeholder="Ex: Computer Engineering" required/>
              </div>
            </div>
          </div>
        </form>

      {/* contains the list of the created course by the user */}
        <div className="card2 px-8 py-4">
          <p>Your Courses Created</p>

          <div className="py-4 px-6 bg-background-medium flex-cc gap-4 rounded-md
            mt-4"
          >
          {
            courseList?.map(course =>
              <div className="flex-rc" key={course.id}>
                <div className="relative
                  grid grid-cols-[max-content_auto] grid-flow-row
                  space-x-4 border-b-highlight-muted border-b-[1px] border-b-solid
                  pb-2 px-4"
                >
                  <p>Name: </p> <p>{course.name}</p>
                  <p className="text-sm">Description:</p>
                  <p className="text-sm">{course.description}</p>
                </div>
                <span>
                  {
                    selectedCourseId === course.id && 
                    <div className="absolute translate-x-[-8rem] max-w-[8rem] flex-cc
                    card2 p-2
                    ">
                      <p>Are you sure?</p>
                      <div className="flex flex-row items-center justify-around
                        mt-2
                        [&_button]:hover:bg-background-medium [&_button]:p-1 [&_button]:rounded-full"
                      >
                        <button className="svg-btn-sm" onClick={deleteCourse}>
                          <MdOutlineCheck className="fill-green-600"/>
                        </button>

                        <button className="svg-btn-sm" onClick={()=>setSelectedCourseId(-1)}>
                          <MdOutlineCancel className="fill-red-600"/>
                        </button>
                      </div>
                    </div>
                  }
                  <button className="svg-btn-sm" onClick={()=>setSelectedCourseId(course.id)}>
                    <MdOutlineDeleteOutline className="fill-red-700"/>
                  </button>
                </span>
              </div>
            )
          }
          </div>
        </div>
      </div>
    </dialog>
  );

  /**
   * Adds a new course, which will be registered as created by the
   * logged user regardless of user's role
   * @param e 
   */
  async function addCourse(e: React.SyntheticEvent<HTMLFormElement>){
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);
  
    const response = await fetchBackend("course/create", {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });

    const json = await response.json() as course_create_response;

    if (response.ok && json.success) {
      const newId = json.data.id;

      const newCourse: SelfCourseItem = {
        id: newId,
        description: `${data.description}`,
        name: `${data.name}`
      }

      setCourseList(x => [...x, newCourse]);

      form.reset();
    } else {
      alert(json.message);
    };
  }

  /**
   *  Deletes the course based on the selected Id hook
   */
  async function deleteCourse(){
    if(selectedCourseId === -1)return;

    const response = await fetchBackend("course/delete", {
      method: "DELETE",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: selectedCourseId})
    });

    if (response.ok){
      setCourseList(list => list.filter( course => course.id !== selectedCourseId ));
    }
  }
}