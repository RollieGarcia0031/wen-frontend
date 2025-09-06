import {useState, useRef, useEffect} from 'react';
import { fetchBackend } from '@/lib/api';
import { SearchProfessorResponse, SearchProfessorResponseDataItem } from '@/lib/response';
import { ProcessProfData, newProfItem } from '@/lib/professorProcessor';
import { useRouter } from 'next/navigation';

interface appointmentData {
  student_id: number,
  professor_id: number,
  status: string,
  name: string,
  day_of_week: number,
  start_time: string,
  end_time: string
}

// Appointments panel rendered for students
export default function SentAppointments(){
  const [nameInput, setNameInput] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [professors, setProfessors] = useState<SearchProfessorResponseDataItem[]>([]);

  const [sentAppointments, setSentAppointments] = useState<appointmentData[]>([]);

  useEffect(()=>{
    const fetchAppointments = async () => {
      const response = await fetchBackend('appointment/list', 'GET');

      if(!response.success || !response?.data || !response?.data?.appointments) return;
      const {appointments} = response.data;
      console.log(appointments)
      setSentAppointments(appointments);

    }

    fetchAppointments().catch(console.error);

  },[]);
  return (
  <>
    <div>
      <button  onClick={() => dialogRef.current?.show()}>New</button>  
      <h1>Sent Appointments</h1>

      <div>
        {sentAppointments?.map((appointment, index) =>
          <AppointmentCard
            key={index} 
            appointment={appointment}
          />)
        }
      </div>

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

function AppointmentCard({appointment}: {appointment: appointmentData}){
  const { name, day_of_week, start_time, end_time, status } = appointment;
  
  return(
    <div
      className='border-gray-500 border-2 border-solid rounded-md p-4 w-full m-4'
    >
      <div
        className='flex flex-row justify-start gap-6'
      >
        <p>{name}</p> <p>{status}</p>
      </div>
      <div 
        className='flex flex-row justify-between'
      >
        <p>{day_of_week}</p>
        <p>{start_time}</p>
        <p>{end_time}</p>
      </div>
    </div>
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
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(-1);

  return (
    <>
      <div className='border-gray-500 border-2 border-solid m-4 w-[100%] rounded-md
        flex-1 p-4
      '>
        {
          professors?.length !== 0 &&
          Object.values(processProfessorList).map((professor: newProfItem, index: number) => (
            <SearchResultContainer
              key={index}
              index={index}
              professor={professor.data}
              selectedSendButton={selectedButtonIndex}
              setSelectedButtonIndex={setSelectedButtonIndex}
            />
          ))
        }

        {professors?.length === 0 && <h1>Search Result</h1>}
      </div>
    </>
  );
}

/**
 * boxes holding the individual professor information 
 */
function SearchResultContainer({professor, selectedSendButton, index, setSelectedButtonIndex}:{
  professor: SearchProfessorResponseDataItem[],
  index: number,
  selectedSendButton: number,
  setSelectedButtonIndex: React.Dispatch<React.SetStateAction<number>>
}){
  const { name } = professor[0];

  const departments = professor.map((prof) => prof.department);
  const years = professor.map((prof) => prof.year);
  const department = Array.from(new Set(departments)).join(", ");

  const isSelectedToSend = selectedSendButton === index;

  const SendButtonHandler = async () =>{
    if(!isSelectedToSend) return setSelectedButtonIndex(index);
    setSelectedButtonIndex(-1);
  }

  return (
    <div className='border-gray-500 border-2 border-solid w-[100%] rounded-md py-2 px-4
      flex flex-row'
    >
      <div className='flex-1'>
        <p className='font-bold'>{name}</p>
        <div className='flex flex-row gap-4'>
          <p className='text-xs'>department: {department}</p>
        </div>
      </div>

      <button onClick={SendButtonHandler}>
        Send
      </button>

      { isSelectedToSend && <SendConfirDialog/> }

    </div>
  );

  function SendConfirDialog(){
    const router = useRouter();
    const { user_id } = professor[0]

    return (
      <div
        className='border-gray-500 border-2 border-solid rounded-md absolute right-0
          w-[10rem] p-2
          bg-white text-black
          flex flex-row justify-evenly gap-2'
      >
        <button className='bg-green-500 py-1 px-2 rounded-md'
          onClick={()=>{
            setSelectedButtonIndex(-1);
            router.push(`/appointment/send/${user_id}`);
          }}
        >
          Confirm
        </button>
        <button className='bg-red-500 py-1 px-2 rounded-md'
          onClick={()=>setSelectedButtonIndex(-1)}
        >
          Cancel
        </button>
      </div>
    );
  }
}
