"use client"

export default function ProfInfoDialog({ref}:{
  ref: React.RefObject<HTMLDialogElement | null>
}){

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
            Proferssor_name
          </p>

          <p>
            Department_name
          </p>

          <div className="mt-8">
            <p>
              Description:
            </p>
            <p>
              None
            </p>
          </div>

          <div className="mt-4">
            Sections:
          </div>
        </div>

      </div>
    </dialog>
  );
}
