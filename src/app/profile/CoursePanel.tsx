import { useRef } from "react";
import { IoMdAddCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";

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
    <dialog ref={ref}>
      <div className="flex-rr">
        <button className="svg-btn-sm">
          <IoMdCloseCircleOutline />
        </button>
      </div>
      <h3>create new course</h3>
    </dialog>
  )
}