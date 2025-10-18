import fetchBackend from "@/lib/fetchBackend";
import { useRef } from "react";
import { IoMdAddCircleOutline, IoMdCloseCircleOutline, IoMdCreate } from "react-icons/io";

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
  return (
    <dialog ref={ref} className="w-[30rem]">
      <div className="flex-cr space-y-4">
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

        <div className="card2 p-4">
          <form
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
        </div>
      </div>
    </dialog>
  );

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

      form.reset();
    } else {
      alert(json.message);
    };


  }
}