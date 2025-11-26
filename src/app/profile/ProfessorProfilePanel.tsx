"use client"

import { useDirtyForm } from "@/lib/useDirtyForm";


export default function ProfessorProfilePanel(){

  const {} = useDirtyForm({});
  
  return (
    <div className="card2">
      <div>
        <p className="text-xl font-semibold">
          Professor&apos;s Profile
        </p>

        <p className="text-sm">
          Edit your personal information that will be visible to students
        </p>
      </div>

      <form className="mt-8 flex-cl gap-2">
        <label>
          First Name:
          <input type="text" name="first_name" />
        </label>

        <label>
          Last Name:
          <input type="text" name="last_name" />
        </label>

        <label>
          Middle Name:
          <input type="text" name="middle_name" />
        </label>

        <label>
          Birthday:
          <input type="date" name="birthday"/>
        </label>

        <label>
          Gender:
          <select>
            <option>Male</option>
            <option>Female</option>
          </select>
        </label>

        <label className="w-full">
          Bio:<br/>
          <textarea className="border-highlight-muted border-[1px] rounded-md w-full focus:outline-none p-4">

          </textarea>
        </label>

        <label>
          Cellphone Number: <br/>
          <input type="text" name="cellphone_number"/>
        </label>
      </form>
    </div>
  );
}
