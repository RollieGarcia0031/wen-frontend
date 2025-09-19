import React, {useState, useRef, useEffect, use, ReactElement} from 'react';
import { fetchBackend } from '@/lib/api';
import { SearchProfessorResponse, SearchProfessorResponseDataItem } from '@/lib/response';
import { ProcessProfData, newProfItem } from '@/lib/professorProcessor';
import { useRouter } from 'next/navigation';
import { appointmentData } from '@/context/ProffesorAppointMentContext';
import { MdOutlineCreate, MdOutlineEdit, MdOutlineInfo } from "react-icons/md";
import { IoIosCloseCircleOutline, IoIosSearch } from "react-icons/io";
import { MdOutlinePending, MdCheckCircleOutline, MdOutlineDelete } from "react-icons/md";
import { TbCalendarUser } from "react-icons/tb";
import { useStudentAppointmentContext } from '@/context/StudentAppointmentContext';

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
    <InfoDialog/>
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

  const {setSentAppointments, infoDialogRef, setSelectedAppointment, setSelectedIndex } = useStudentAppointmentContext();

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
        flex-row-center w-full
        sm:p-4
        border-highlight-muted border-2 border-solid rounded-md m-4'
      >

        <div
          className='flex-1 flex flex-col
          sm:gap-2'
        >
          <div
            className='flex flex-row justify-start gap-6
            [&>p]:flex [&>p]:flex-col [&>p]:justify-end'
          >
            <p className='font-bold'>
              {name}
            </p>
            <p
              className='italic text-xs flex-1 text-text-muted'
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
          className='rounded-md flex-row-center
          sm:[&_svg]:text-3xl sm:gap-2
          [&>button]:duration-300 [&>button]:p-1 [&>button]:rounded-full'
        >
          <button>
            <MdOutlineInfo
              onClick={handleInfoButton}
              className='fill-blue-300 hover:fill-blue-700'
            />
          </button>

          <button onClick={() => setIsDeleting(true)}>
            <MdOutlineDelete
              className='fill-red-500 hover:fill-red-700'
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

  function handleInfoButton(){
    if(setSelectedAppointment && infoDialogRef){
      setSelectedAppointment(appointment);
      setSelectedIndex(index);
      infoDialogRef?.current?.showModal();
    }
  }
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
      className='rounded-xl p-4'
    >
      <div className='flex flex-col justify-center items-center w-full rounded-md p-4'>
        <h1>Are you sure? You can&apos;t undo this</h1>

        <div className='flex flex-row gap-4 w-full justify-center mt-4'>
          <button onClick={handleConfirm}
            className='bg-green-500 px-2 py-1 rounded-lg text-black'
          >
            Confirm
          </button>
          <button onClick={() => setIsDeleting(false)}
            className='bg-red-500 px-2 py-1 rounded-lg text-black'  
          >
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
      className='open:sm:w-[30rem] open:sm:h-[80dvh] open:w-full
      open:h-full open:overflow-hidden
      open:flex open:flex-col open:justify-start open:items-center
      open:px-6 open:py-2'
      >
      <div className='
        flex flex-row justify-end align-top items-end w-full'
      >
        <button onClick={() => dialogRef?.current?.close()}>
          <IoIosCloseCircleOutline className='text-2xl fill-red-700'/>
        </button>
      </div>
      <div className='flex-1 w-full grid h-full
        grid-rows-[4rem_auto] grid-cols-1
        gap-2 justify-items-center'
      >
        <SearchPanel />
        <SearchResult />
      </div>
    </dialog>
    </>

  );
}
/**
 * shows information of selected appointment
 * TODO: add option to edit appointment message
 * TODO: fix adding function, update index first, update appointment states
 */
function InfoDialog(){
  const {
    infoDialogRef,
    selectedAppointment,
    setSentAppointments,
    selectedIndex,
  } = useStudentAppointmentContext();
  const { name, appointment_id, message, time_stamp, status } = selectedAppointment || {};

  const messageSpanRef = useRef<HTMLSpanElement | null>(null);

  type EditState = 'changed' | 'unchanged' | 'saved';
  const [editState, setEditState] = useState<EditState>('unchanged');

  useEffect(()=>{
    setEditState('unchanged');
  },[selectedIndex])

  const EditButtonColor = {
    unchanged: 'bg-blue-700',
    changed: 'bg-yellow-700',
    saved: 'bg-green-600'
  }

  return (
    <dialog
      ref={infoDialogRef}
      className='sm:open:w-[30rem] sm:open:h-[80dvh] open:overflow-hidden
      open:flex open:flex-col justify-start items-center
      sm:open:p-2'
    >
      <div className='text-right w-full'>
        <button onClick={() => infoDialogRef?.current?.close()}>
          <IoIosCloseCircleOutline className='text-2xl fill-red-700'/>
        </button>
      </div>

      <form
        className='w-full sm:space-y-1
        sm:px-9 sm:[&_p>*]:ml-3
        [&_p>*]:border-b-highlight-muted [&_p>*]:border-b-[1px] [&_p>*]:border-solid [&_p>*]:px-2 [&_p>*]:focus:outline-none'
      >
        <p>To: <span> {name} </span></p>
        <div className='w-full flex flex-row'>
          <p className='indent-0'>
            Message:
            <span
              ref={messageSpanRef}
              contentEditable={true}
              dangerouslySetInnerHTML={{__html: message || ''}}
              onInput={e=>handleEditEvent(e)}
            >
            </span>
          </p>

          <div className='flex-1 flex flex-row items-center justify-end'>
            <button type='button'
              className={`${EditButtonColor[editState]}
              sm:p-1 rounded-full
              duration-500`}
            >
              <MdOutlineEdit
                onClick={handleEditButton}
                className={`text-2xl`}
              />
            </button>
          </div>
        </div>
        <p>Status:  <span> {status} </span></p>
        <p>Day: <span> {time_stamp} </span></p>
      </form>
    </dialog>
  );

  function handleEditEvent(e: React.SyntheticEvent<HTMLSpanElement>){
    const target = e.target as HTMLDivElement;
    const typedMessage = target.textContent;
    
    if(typedMessage === message) {setEditState('unchanged'); return;}//stop if no changes typed;
    setEditState('changed');  
  }

  async function handleEditButton(){
    if(
      messageSpanRef.current === null ||
      message?.length === undefined ||
      message?.length === null ||
      message?.length === 0 ||
      appointment_id === undefined ||
      appointment_id < 0
    ) return;

    messageSpanRef.current.focus();

    const typedMessage = messageSpanRef.current.innerHTML;

    if(typedMessage === message) return;//stop if no changes typed

    const body = {id: parseInt(appointment_id.toString()), message: typedMessage};
    const head = new Headers({"Content-Type": "application/json"});
    //save new message
    const response = await fetchBackend(
      'appointment/update/message',
      'PUT',
      JSON.stringify(body),
      head
    );

    if(response.success){
      setSentAppointments(x => {
        x[selectedIndex].message = typedMessage;
        return [...x];
      });
      setEditState('saved');
    }
  }
}

/**
 * search panel of user student, where the user can search for professors
 * TODO: add more search options
 */
function SearchPanel(){
  const { nameInput, setNameInput, setProfessors } = useStudentAppointmentContext();

  return (
    <div
      className='w-full flex flex-row justify-center items-center gap-4
      sm:my-6'
    >
      <label className='flex flex-row justify-center items-center'>
        <p>Search:</p> 
        <input type='text' className='ml-2'
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value) }
        />
      </label>
      <button
        type='button' onClick={e=>search(e)}
        className='bg-primary aspect-square rounded-full
        sm:p-2 p-2'  
      >
        <IoIosSearch className='sm:text-2xl'/>
      </button>
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
  const [searchMessage, setSearchMessage] = useState<string>("Search Result");

  useEffect(()=>{
    if(professors.length === 0){
      setSearchMessage("No professors found");
    }
  }, [professors]);

  return (
    <>
      <div className='w-full rounded-md sm:h-[95%]
        flex-1 flex flex-col justify-start 
        sm:gap-6 sm:px-6 
        gap-4 p-4
        overflow-y-auto'
      >
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

        {professors?.length === 0 &&
          (<div
            className='h-full flex-row-center text-2xl text-text-muted'
          >
            {searchMessage}
          </div>)
        }
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
    <div className='border-b-highlight-muted border-b-2 border-solid w-[100%] rounded-md
      sm:py-2 sm:px-4
      py-1 px-2
      flex flex-row'
    >
      <div className='flex-1'>
        <p className='font-bold'>{name}</p>
        <div className='flex flex-row gap-4'>
          <p className='text-xs'>department: {department}</p>
        </div>
      </div>

      <button onClick={SendButtonHandler}>
        <TbCalendarUser
          className='text-2xl'/>
      </button>

      { isSelectedToSend && <SendConfirmDialog/> }

    </div>
  );

  function SendConfirmDialog(){
    const router = useRouter();
    const { user_id } = professor[0]

    return (
      <div
        className='border-black border-2 border-solid rounded-md absolute right-0
          w-[10rem] p-2
          bg-gray-800 text-black
          flex flex-row justify-evenly gap-2'
      >
        <button
          className='bg-green-500 py-1 px-2 rounded-md'
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
