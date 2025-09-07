import {useState, useRef, useEffect, use, ReactElement} from 'react';
import { fetchBackend } from '@/lib/api';
import { SearchProfessorResponse, SearchProfessorResponseDataItem } from '@/lib/response';
import { ProcessProfData, newProfItem } from '@/lib/professorProcessor';
import { useRouter } from 'next/navigation';
import { useStudentAppointmentContext } from '@/context/StudentAppointmentContext';
import { appointmentData } from '@/context/ProffesorAppointMentContext';
import { MdOutlineCreate } from "react-icons/md";
import { IoIosCloseCircleOutline, IoIosSearch } from "react-icons/io";
import { MdOutlinePending, MdCheckCircleOutline, MdOutlineDelete } from "react-icons/md";
import { IconType } from 'react-icons';


// Appointments panel rendered for students
export default function SentAppointments(){
  const {
    setSentAppointments,
    sentAppointments,
    dialogRef
  } = useStudentAppointmentContext();

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
    <div
      className='w-full flex flex-col justify-center items-center'
    >
      <div
        className='sm:p-4 sm:w-[35rem]'
      >
        <button  onClick={() => dialogRef?.current?.showModal()}
          className='flex-row-center gap-1 bg-secondary
            px-2 py-1 rounded-md'  
        >
          <MdOutlineCreate/>New
        </button>  
        <div
          className='mt-4 '
        >
          <h1
            className='text-2xl font-bold text-text-muted'  
          >
            Sent Appointments
          </h1>

          <div>
            {sentAppointments?.map((appointment, index) =>
              <AppointmentCard
                key={index} 
                appointment={appointment}
                index={index}
              />)
            }
          </div>
        </div>

      </div>
    </div>
    <NewAppointmentDialog/>
  </>
  );

}

function AppointmentCardIcon({status}:
  {status: undefined | string}
){
  status = status? status : 'pending';

  type CardIcon = {
    [key: string]: ReactElement
  }

  const icon: CardIcon = {
    pending: (<MdOutlinePending
      className='text-3xl fill-text-muted'
    />),
    confirmed: (<MdCheckCircleOutline
      className='text-3xl rounded-full fill-green-500'
    />)
  }

  return icon[status] || icon['pending'];
}

function AppointmentCard({appointment, index}:{
  appointment: appointmentData,
  index: number,
}){
  const { name, day_of_week, start_time, end_time, appointment_id, status } = appointment;
  const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const {setSentAppointments} = useStudentAppointmentContext();

  useEffect(()=>{
    if(isDeleting) deleteDialogRef.current?.showModal();
  }, [isDeleting]);

  return(
    <div className='w-full flex flex-row'>
      <div className='flex-row-center'>
        <AppointmentCardIcon status={status}/>
      </div>
      <div
        className='
        flex flex-row gap-3 w-full
        border-gray-500 border-2 border-solid rounded-md p-3 m-4'
      >

        <div className='flex-1 flex flex-col'>
          <div
            className='flex flex-row justify-start gap-6 flex-1'
          >
            <p className='font-bold'>
              {name}
            </p>
            <p
              className='italic text-xs flex-1'
            >
              {status}
            </p>
          </div>
          <div 
            className='flex flex-row justify-start
              sm:gap-6'
          >
            <p>{day_of_week}</p>
            <p>{start_time}</p>
            <p>{end_time}</p>
          </div>
        </div>

        <div
          className='rounded-md p-4'
        >
          <button
            onClick={() => setIsDeleting(true)}
            className='flex flex-row justify-center items-center'
          >
            <MdOutlineDelete
              className='text-3xl fill-red-500 hover:fill-red-700
              duration-150'
            />
          </button>
        </div>

        {isDeleting && <DeleteDialog
          ref={deleteDialogRef}
          setIsDeleting={setIsDeleting}
          appointment_id={appointment_id}
          index={index}
          setSentAppointments={setSentAppointments}
        />}
      </div>
    </div>
  );
}

// dialog pop up for deleting an appointment
function DeleteDialog({ref, setIsDeleting, appointment_id, index, setSentAppointments}:{
  ref: React.RefObject<HTMLDialogElement | null>,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>,
  appointment_id?: number,
  index: number,
  setSentAppointments: React.Dispatch<React.SetStateAction<appointmentData[]>>
}){
  return(
    <dialog
      ref={ref}
      onClose={() => setIsDeleting(false)}
    >
      <div className='flex flex-col justify-center items-center w-full rounded-md p-4'>
        <h1>Are you sure? You can't undo this</h1>

        <div className='flex flex-row gap-4 w-full justify-center'>
          <button onClick={handleConfirm}>
            Confirm
          </button>
          <button onClick={() => setIsDeleting(false)}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );

  async function handleConfirm(){
    if(appointment_id === undefined) return;
    const body = { id: parseInt(appointment_id.toString()) };
    
    try{
      const response = await fetchBackend(
        `appointment/delete`,
        'DELETE',
        JSON.stringify(body),
        new Headers({"Content-Type": "application/json"})
      );

      if(!response.success) return alert(response.message);

      setIsDeleting(false);
      setSentAppointments(x => {
        x.splice(index, 1);
        return [...x];
      });
    }

    catch(err){
      console.error(err);
    }
  }
}

// dialog pop up for adding a new appointment and searching for professors
function NewAppointmentDialog(){
    const {professors, setProfessors, dialogRef, setNameInput, nameInput} = useStudentAppointmentContext();

  return(
    <>
    <dialog ref={dialogRef} onSubmit={(e) => e.preventDefault()}
      className='open:sm:w-[30rem]  open:sm:h-[80dvh] open:w-full
      open:flex open:flex-col open:justify-center open:items-center
      px-2 py-2'
      >
      <div className='
        flex flex-row justify-end align-top items-end w-full'
      >
        <button onClick={() => dialogRef?.current?.close()}>
          <IoIosCloseCircleOutline className='text-2xl'/>
        </button>
      </div>
      <div className='flex-1 w-full flex flex-col justify-center items-center'>
        <SearchPanel />
        <SearchResult />
      </div>
    </dialog>
    </>

  );
}

/**
 * search panel of user student, where the user can search for professors
 * TODO: add more search options
 */
function SearchPanel(){
  const { nameInput, setNameInput, setProfessors } = useStudentAppointmentContext();

  return (
    <div className='w-full flex flex-row justify-center items-center gap-2'
    >
      <label className='flex flex-row justify-center items-center'>
        <p>Search:</p> 
        <input type='text' className='ml-2'
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value) }
        />
      </label>
      <button type='button' onClick={e=>search(e)}><IoIosSearch className='text-2xl'/></button>
    </div>
  );

  // search function handling
  async function search(e: any){
    e.preventDefault();
    
    const body = JSON.stringify({name: nameInput});
    
    const response: SearchProfessorResponse = await fetchBackend("search/professor", "POST", body);
    
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
function SearchResult(){
  const {professors} = useStudentAppointmentContext();
  const processProfessorList = ProcessProfData(professors);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(-1);

  return (
    <>
      <div className='border-gray-500 border-2 border-solid m-4 w-[100%] rounded-md
        flex-1 p-4 flex flex-col gap-2
      '>
        {
          professors?.length !== 0 &&
          Object.values(processProfessorList).map((professor: newProfItem, index: number) => (
            <SearchResultCard
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
function SearchResultCard({professor, selectedSendButton, index, setSelectedButtonIndex}:{
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

      { isSelectedToSend && <SendConfirmDialog/> }

    </div>
  );

  function SendConfirmDialog(){
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
