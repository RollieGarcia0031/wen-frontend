"use client"

import fetchBackend from "@/lib/fetchBackend";
import { useDirtyForm } from "@/lib/useDirtyForm";
import { useEffect, useRef } from "react";
import { IoMdSave } from "react-icons/io";
import { IoSaveOutline } from "react-icons/io5";
import { VscDiscard } from "react-icons/vsc";
import { toast } from "react-toastify";

export default function StudentInfoPanel(){

  const { dirtyFields, isDirty, onChange, resetForm, setInitial, values } = useDirtyForm<info_student_response_item>({
    birthday: "",
    first_name: "",
    last_name: "",
    middle_name: ""
  });

  const isLoading = useRef(false);
  const isSaving = useRef(false);

  useEffect(()=>{
    fetchStudentInfo();
  }, []);

  return (
    <div className="card2">
      <div>
        <p className="text-xl font-semibold">
          Student Profile
        </p>

        <p className="text-sm">
          Edit you information as a student
        </p>
      </div>

      <form className="mt-8 flex flex-col gap-2">
        <label>
          First Name
          <input type="text" name="first_name" value={values.first_name || ""} onChange={onChange}/>
        </label>

        <label>
          Last Name
          <input type="text" name="last_name" value={values.last_name || ""} onChange={onChange}/>
        </label>

        <label>
          Middle Name
          <input type="text" name="middle_name" value={values.middle_name || ""} onChange={onChange}/>
        </label>

        <label>
          Birthday
          <input type="date" name="birthday" value={values.birthday || ""} onChange={onChange}/>
        </label>

        <div className="*:bg-white *:text-black *:px-2 *:py-1 *:rounded-md
          *:flex-cc *:disabled:opacity-50
          [&>button]:flex [&>button]:flex-row [&>button]:flex-justify-center [&>button]:items-center
          flex-rl gap-2 mt-8 duration-250"
        >
          <button type="button" onClick={handleSave}
            disabled={!isDirty || isSaving.current}
          >
            <IoMdSave className="fill-black text-lg"/>
            Save
          </button>

          <button type="button"
            disabled={!isDirty} onClick={resetForm}
          >
            <VscDiscard className="fill-black text-lg"/>
            Discard
          </button>
        </div>
      </form>
    </div>
  );

  async function fetchStudentInfo(){
    if (isLoading.current) return;

    isLoading.current = true;
    try {
      const response = await fetchBackend("info/student", {
        method: "GET",
        headers: { 'Content-Type' : 'application/json' }
      });

      const { data, message, success } = await response.json() as info_student_response;

      if (response.status === 404) throw new Error("Student data not found");

      if (!response.ok || !success)
        throw new Error(message || "Failed to fetch student information");

      setInitial(data);

    } catch (error){
      if (error instanceof Error)
        toast.error(error.message);
    } finally {
      isLoading.current = false;
    }
  }

  async function handleSave(){
    if (isSaving.current) return;

    isSaving.current = true;
    try {
      const response = await fetchBackend("info/update/student",{
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(dirtyFields)
      });

      const { message, success } = await response.json() as common_response;

      if (!response.ok || !success)
        throw new Error(message || "Cannot update at this moment");

      setInitial({...values, ...dirtyFields});

    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    } finally {
      isSaving.current = false;
    }
  }
}
