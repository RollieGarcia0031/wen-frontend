"use client"

import fetchBackend from "@/lib/fetchBackend";
import { useDirtyForm } from "@/lib/useDirtyForm";
import { useEffect } from "react";
import { toast } from "react-toastify";


const updateProfessorInfo = async (body:info_update_professor_request) => {
  try {
    const response = await fetchBackend("info/update/professor",{
      method: "POST",
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(body)
    });

    const json = await response.json() as info_update_professor_response;
    const { success, message } = json;

    if (!success || !response.ok)
      throw new Error(message || "Unexpected Error Occured!");

    return success;
  } catch (e) {
    if (e instanceof Error) toast.error(e.message);
  }
}

export default function ProfessorProfilePanel(){

  const { values, isDirty, onChange, resetForm, dirtyFields, setInitial } = useDirtyForm<info_update_professor_request>({
    "first_name": "",
    "last_name":"",
    "middle_name": "",
    "bio": "",
    "cellphone_number": "",
    "birthday": "",
    "gender": 0 
  });

  useEffect(()=>{
    fetchBackend("info/professor", {
      method: "GET",
      headers: { 'Content-Type' : 'application/json' }
    }).then(response => {
      return response.json();
    }).then( (json) => {

      const { data, success } = json as common_response;
      if (success) {
        const normalized = Object.fromEntries(
          Object.entries(data).map(([key, val]) => [key, val ?? ""])
        ) as info_update_professor_request;
        setInitial(normalized);
      }

    }).catch(error=>{
      if (error instanceof Error)
        toast.error(error.message);
    })
  }, []);

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
          <input type="text" name="first_name" value={values.first_name} onChange={onChange} />
        </label>

        <label>
          Last Name:
          <input type="text" name="last_name" value={values.last_name} onChange={onChange}/>
        </label>

        <label>
          Middle Name:
          <input type="text" name="middle_name" value={values.middle_name} onChange={onChange}/>
        </label>

        <label>
          Birthday:
          <input type="date" name="birthday" value={values.birthday} onChange={onChange}/>
        </label>

        <label>
          Gender:
          <select
            value={values.gender} onChange={onChange} name="gender"
          >
            <option value="0">Choose a gender</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
        </label>

        <label>
          Cellphone Number: <br/>
          <input type="text" name="cellphone_number" value={values.cellphone_number} onChange={onChange}/>
        </label>

        <label className="w-full">
          Bio:<br/>
          <textarea
            value={values.bio} onChange={onChange} name="bio"
            className="border-highlight-muted border-[1px] rounded-md w-full focus:outline-none p-2"
          >
          </textarea>
        </label>

        <button
          disabled={!isDirty} onClick={handleSave}
          className="bg-white text-black py-1 px-2 rounded-md disabled:opacity-60
          duration-200"
          type="button"
        >
          Save Changes
        </button>
      </form>
    </div>
  );

  async function handleSave(){
    try {
      const response = await fetchBackend("info/update/professor",{
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(dirtyFields)
      });

      const { message, success } = await response.json() as info_update_professor_response;

      if (!success || !response.ok)
        throw new Error(message || "Cannot update at this moment");

      setInitial({...values, ...dirtyFields});

    } catch (e){
      if (e instanceof Error)
        toast.error(e.message);
    }
  }
}
