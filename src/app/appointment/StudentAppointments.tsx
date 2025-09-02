import {useState, useRef} from 'react';
import { fetchBackend } from '@/lib/api';
import { SearchProfessorResponse, SearchProfessorResponseDataItem } from '@/lib/response';
import { ProcessProfData, newProfItem } from '@/lib/professorProcessor';
// Appointments panel rendered for students
export default function SentAppointments(){
  const [nameInput, setNameInput] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [professors, setProfessors] = useState<SearchProfessorResponseDataItem[]>([]);

  return (
  <>
  <div>
    <button  onClick={() => dialogRef.current?.showModal()}>New</button>  
    <h1>Sent Appointments</h1>
  </div>
  <NewAppointmentDialog
    nameInput={nameInput}
    setNameInput={setNameInput}
    dialogRef={dialogRef}
    setProfessors={setProfessors}
    professors={professors}
  />
  </>
  );

}

// dialog pop up for adding a new appointment and searching for professors
function NewAppointmentDialog({nameInput, setNameInput, dialogRef, setProfessors, professors}:{
  nameInput: string,
  setNameInput: React.Dispatch<React.SetStateAction<string>>,
  dialogRef: React.RefObject<HTMLDialogElement | null>  ,
  setProfessors: React.Dispatch<React.SetStateAction<SearchProfessorResponseDataItem[]>>,
  professors: SearchProfessorResponseDataItem[],
  }){
  return(
    <dialog ref={dialogRef} onSubmit={(e) => e.preventDefault()}
      className='open:sm:w-[30rem]  open:sm:h-[80dvh] open:w-full
        open:flex open:flex-col open:justify-center open:items-center'
    >
      <div className='flex flex-row justify-end align-top items-end w-full'>
        <button onClick={() => dialogRef.current?.close()}>❌</button>
      </div>
      <div className='flex-1 w-full flex flex-col justify-center items-center'>
        <h1>New Appointment</h1>
        <SearchPanel 
          nameInput={nameInput}
          setNameInput={setNameInput}
          setProfessors={setProfessors}
        />
        <SearchResult professors={professors}/>
      </div>
    </dialog>

  );
}

/**
 * search panel of user student, where the user can search for professors
 * TODO: add more search options
 */
function SearchPanel({nameInput, setNameInput, setProfessors}: {
  nameInput: string,
  setNameInput: React.Dispatch<React.SetStateAction<string>>,
  setProfessors: React.Dispatch<React.SetStateAction<SearchProfessorResponseDataItem[]>>,
}){
  return (
    <div className='w-full flex flex-row justify-center items-center gap-2'
    >
      <label>
        🔎: 
        <input type='text' className='ml-2'
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value) }
        />
      </label>
      <div className='flex-1'>
        other options...
      </div>
      <button type='button' onClick={e=>search(e)}>Search</button>
    </div>
  );

  // search function handling
  async function search(e: any){
    e.preventDefault();
    
    const body = JSON.stringify({name: nameInput});
    
    const response: SearchProfessorResponse = await fetchBackend("search/professor", "POST", body);
    
    console.log(response);
    if(response.success){
      const { data } = response;
      if(data){
        return setProfessors(data);
      }
    }
  }
}

/**
 * the box that shows the search result of user student
 */
function SearchResult({professors}: {professors: SearchProfessorResponseDataItem[]}){
  const processProfessorList = ProcessProfData(professors);

  return (
    <div className='border-gray-500 border-2 border-solid m-4 w-[100%] rounded-md
      flex-1 p-4
    '>
      {
        professors?.length !== 0 &&
        Object.values(processProfessorList).map((professor: newProfItem) => (
          <SearchResultContainer key={professor.name} professor={professor.data}/>
        ))
      }

      {professors?.length === 0 && <h1>Search Result</h1>}
    </div>
  );
}

/**
 * boxes holding the individual professor information 
 */
function SearchResultContainer({professor}:{
  professor: SearchProfessorResponseDataItem[]
}){
  const { name } = professor[0];
  console.log(professor);

  const departments = professor.map((prof) => prof.department);
  const years = professor.map((prof) => prof.year);
  const department = Array.from(new Set(departments)).join(", ");

  return (
    <div className='border-gray-500 border-2 border-solid w-[100%] rounded-md py-2 px-4'>
      <p className='font-bold'>{name}</p>
      <div className='flex flex-row gap-4'>
        <p className='text-xs'>department: {department}</p>
      </div>
    </div>
  );
}
