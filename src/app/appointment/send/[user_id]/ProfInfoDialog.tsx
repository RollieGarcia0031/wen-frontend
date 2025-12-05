"use client"

export default function ProfInfoDialog({ref, info}:{
  ref: React.RefObject<HTMLDialogElement | null>,
  info: info_professor_response_item
}){

  const {
    bio,
    department_code,
    department_name,
    first_name,
    last_name,
    middle_name,
    sections
  } = info;

  return (
    <dialog ref={ref}>
      <div className="grid grid-rows-[auto_1fr] w-[30rem] h-[30rem] overflow-y-auto">

        <div className="flex-rr">
          <button
            onClick={()=>ref.current?.close()}
          >
            Close
          </button>
        </div>

        <div>
          <p className="text-2xl">
            {(!last_name && !first_name && !middle_name) && "Professor"}
            {first_name} {middle_name} {last_name}
          </p>

          <p className="text-sm">
            {department_name} - <span className="italic">({department_code}) </span>
          </p>

          <div className="mt-8">
            <p>
              Description:
            </p>
            <p>
              {bio}
            </p>
          </div>

          <div className="mt-4">
            Sections:
            <div
              className="ml-4"
            >
              {sections?.map((item, index) => (
                <div
                  key={index} 
                  className="grid grid-cols-[auto_1fr] gap-4"
                >
                  <p>
                    {item.course_code}
                  </p>

                  <p>
                    {item.section_code} - {item.year_level}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </dialog>
  );
}
