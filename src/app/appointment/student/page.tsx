"use client"

import { FaCheck, FaPlus, FaTrashAlt } from "react-icons/fa";
import { AppointmentContextProvider, useAppointment } from "@/context/AppointmentContext";
import SearchProfessorDialog from "@/components/SearchProfessorDialog";
import { SearchProfessorContextProvider } from "@/context/SearchProfessorContext";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import fetchBackend from "@/lib/fetchBackend";
import { MdCancel, MdWatchLater } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function Student(){

  const { user } = useAuth();
  const router = useRouter();

  useEffect(()=>{
    if (user?.role === 'professor')
      router.replace('/appointment/professor');
  }, [user]);

  if (!user) return null;

  if (user.role === 'student')
  return (
    <AppointmentContextProvider>
      <SearchProfessorContextProvider>
        <div className="px-10 mt-4">

          <AppointmentHeader />

          <AppointmentsTable />

        </div>

      </SearchProfessorContextProvider>
    </AppointmentContextProvider>
  );
}

/**
 * Header and quick opttion bar in sending appointment
 */
function AppointmentHeader(){
  const { setSearchDialogOpened } = useAppointment();

  return (

    <div className="flex-rl">
      <h1 className="flex-1">
        Sent Appointments
      </h1>

      <button
        className="bg-primary hover:bg-primary-hover px-4 rounded-md
          shadow-black shadow-md
        "
        title="create new appointment"
        onClick={()=>setSearchDialogOpened(true)}
      >
        <FaPlus />
      </button>

      <SearchProfessorDialog />
    </div>
  );
}

function AppointmentsTable(){
  const { sentAppointments, hasNext, isLoading, fetchMoreAppointment, reset } = useAppointment();

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    reset();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNext && !isLoading) {
          fetchMoreAppointment();
        }
      },
      { threshold: 1.0 }
    );

    const loader = loaderRef.current;
    if (loader) {
      observer.observe(loader);
    }

    return () => {
      if (loader) {
        observer.unobserve(loader);
      }
    };
  }, [hasNext, isLoading, fetchMoreAppointment]);

  if (sentAppointments.length === 0 && !isLoading){

    return (
      <div className="flex-full-center h-[30dvh]">
        <p>
          No Appointments Found
        </p>
      </div>
    );
  }
  return (
    <div className="h-screen flex-cc pt-5 pb-1">        
      <div
        className="w-[40rem] h-full card p-8 grid grid-rows-[auto_1fr]"
      >
        <div className="mb-8">
          <p className="text-4xl font-extrabold">
            Appointments
          </p>
          <p>
            View your sent appointments
          </p>
        </div>

        <div className="overflow-y-scroll">
          <div
            className="grid grid-cols-[1fr_1fr_4rem_4rem] px-4 my-4 font-semibold"
          >
            <p>Name</p>
            <p>Date</p>
            <p>Status</p>
          </div>

          <AnimatePresence> 
          {sentAppointments.map(item => (
            <AppointmentCard item={item} key={item.id}/> 
          ))}
          </AnimatePresence>

          {
            hasNext && (
              <div
                ref={loaderRef}
                className="flex-cc"
              >
                <p className="text-lg font-semibold">
                  Loading...
                </p>
              </div>
            )
          }

          { !hasNext && (
            <div className="flex-full-center">
              <p className="text-lg font-semibold">
                No More Appointments
              </p>
            </div>
          )}
        </div>

      </div>        
    </div>
  );
}

function AppointmentCard({item}:{
  item: appointment_list_response_item
}){

  const { setSentAppointments } = useAppointment();
  const { counterpart_name: name, id, target_date, status, header: message, end_time, start_time } = item;

  const isPast = new Date(target_date) > new Date();
  const isAccepted = status === 1;

  const infoRef = useRef<HTMLDialogElement | null>(null);
  const [ infoIsOpened, setInfoIsOpened ] = useState(false);

  const displayDate = new Date(target_date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <>
    <motion.div
      className="grid grid-cols-[1fr_1fr_4rem_4rem]
      border-y-highlight-muted border-y-[1px] cursor-pointer
      px-4 py-4 my-2 duration-100 rounded-md hover:bg-highlight-muted"
      initial={{ opacity: 0, height: 'auto', marginBottom: 0 }}
      animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
      exit={{ opacity: 0, height: 'auto', marginBottom: 0 }}
      transition={{ duration: 0.3}}
      onClick={()=>infoRef.current?.showModal()}
    >
      <p className="overflow-x-hidden">
        {name}
      </p>

      <p className="flex flex-row items-center">
        {displayDate}
      </p>

      <div className="flex-cc">
        <StatusIcon status={status} />
      </div>

      <button
        onClick={handleDelete}
        className="flex-cc disabled:opacity-50"
        disabled={isPast && isAccepted}
      >
        <FaTrashAlt />
      </button>

    </motion.div>
    <InfoDialog message={message} start_time={start_time} end_time={end_time} target_date={target_date} ref={infoRef} handleClose={()=>infoRef.current?.close()}/>
    </>
  );

  async function handleDelete(){

    const reqBody = { id };

    try {

      const response = await fetchBackend("appointment/delete", {
        method: "DELETE",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(reqBody)
      });

      const { message, success } = await response.json() as common_response;

      if (!response.ok || !success) throw new Error(message || "Error Occured");

      setSentAppointments(appointments => 
        appointments.filter(apt => apt.id !== id)
      );

    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    }
    
  }
}

function StatusIcon({status}:{status:number}){
  switch (status){
    case 0: return (
      <MdWatchLater title="pending" className="fill-orange-500"/>
    )
    case 1: return (
      <FaCheck title='approved' className="fill-green-500"/>
    )
    case 2: return (
      <MdCancel title='declined' className="fill-red-400"/>
    )
    default:
      <MdWatchLater />
  }
}

function InfoDialog({message, end_time, start_time, target_date, ref, handleClose}: {
  message: string,
  end_time: string,
  start_time: string,
  target_date: string,
  ref: React.RefObject<HTMLDialogElement | null>,
  handleClose?: () => void
}){

  return (
    <dialog ref={ref}>
      <div className="grid grid-rows-[auto_1fr]">
        <div className="flex-rr">
          <button
            className="text-xl fill-red-500"
            onClick={handleClose}
          >
            <IoMdCloseCircleOutline />
          </button>
        </div>

        <div>
          <p className="text-2xl">
            Appointment Details
          </p>

          <div className="space-y-2">
            <p>Message: {message}</p>
            <p>Start Time: {start_time}</p>
            <p>End Time: {end_time}</p>
            <p>Target Date: {target_date}</p>
          </div>
        </div>
      </div>
    </dialog>
  )
}