"use client"

import { fetchRecievedAppointments, ProfAppointmentContextProvider, useProfAppointment } from "@/context/ProfessorAppointmentContext";
import { removeSeconds } from "@/util/TimeFormat";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { MdOutlinePending } from "react-icons/md";
import RecivedAppointmentDialog from "@/components/RecivedAppointmentDialog";
import { FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import fetchBackend from "@/lib/fetchBackend";
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Professor(){

  const router = useRouter();
  const { user } = useAuth();

  useEffect(()=>{
    if (user?.role === 'student'){
      router.replace('/appointment/student');
    }
  }, [user]);

  if (!user){
    return null;
  }

  if (user.role === 'professor')
  return (
    <ProfAppointmentContextProvider>
      <div>

        <AppointmentTable />

        <RecivedAppointmentDialog />

      </div>
    </ProfAppointmentContextProvider>
  );
}

/**
 * Table containing the recived appointments of the user
 */
function AppointmentTable(){

  const {
    setRecievedAppointments,
    recievedAppointments,
    selectionOption,
    setSelectionOption,
    selectedIds,
    setSelectedIds,
    fetchMoreAppointments,
    loaderRef,
    observerRef,
    hasNext,
    isLoading,
    resetAll,
    searchFilter,
    setSearchFilter
  } = useProfAppointment();

  useEffect(()=>{
    resetAll();
  },[]);

  useEffect(()=>{

    const oberverHandler = new IntersectionObserver((entries: IntersectionObserverEntry[])=>{
      const target = entries[0];
      if (target.isIntersecting && hasNext && !isLoading) {
        fetchMoreAppointments();
      }
    },{ threshold: 1.0 });

    if (loaderRef.current) {
      oberverHandler.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        oberverHandler.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, hasNext, fetchMoreAppointments])

  return (
    <div
      className="flex-cc pb-8"
    >
      <div
        className="card w-[57rem] rounded-md p-8"
      >
        {/* title and subtitle of the main table */}
        <div>
          <p className="text-4xl font-extrabold">
            Appointment History
          </p>
          <p className="mb-12">
            A complete record of all your scheduled meetings.
          </p>
        </div>

        {/* shortcut option for deleting */}
        <div
          className="mb-4 space-x-4 flex"
        >
          <span className="card2 space-x-2 py-3">
            <span>
              Select:
            </span>
            
            <select
              value={`${selectionOption}`}
              onChange={(e)=>setSelectionOption(parseInt(e.target.value))}>
              <option value={0} >none</option>
              <option value={1} >all</option>
              <option value={2} >non-pending</option>
            </select>
            {selectedIds.length > 0 && (
              <button onClick={handleMultiDelete}>
                <FaTrash />
              </button>
            )}
          </span>

          <span className="card2 space-x-2 py-3">
            <span>
              Status:
            </span>
            <select
              value={searchFilter.status === undefined ? "" : searchFilter.status}
              onChange={e => setSearchFilter(prev => ({...prev, status: e.target.value === "" ? undefined : parseInt(e.target.value!)}))}
            >
              <option value={-1}>all</option>
              <option value={0}>pending</option>
              <option value={1}>confirmed</option>
              <option value={2}>declined</option>
            </select>
          </span>

          <span className="card2 space-x-2 py-3">
            <span>Time Range:</span>
            <select
              value={searchFilter.time_range || "all"}
              onChange={e => setSearchFilter(prev => ({...prev, time_range: e.target.value as 'all' | 'past' | 'upcoming' | 'today'}))}
            >
              <option value='all'>all</option>
              <option value='today'>today</option>
              <option value='upcoming'>upcoming</option>
              <option value='past'>past</option>
            </select>
          </span>
        </div>

        {/* table header */}
        <div
          className="grid grid-cols-[13rem_15rem_10rem_7rem_5rem]
          mb-4 px-4 *:font-bold"
        >
          <p>
            Student Name
          </p>

          <p>
            Message
          </p>

          <p>
            Date
          </p>

          <p>
            Time
          </p>

          <p>
            Status
          </p>

        </div>
        <AnimatePresence>
          {recievedAppointments.map(item => (
            <AppointmentCard key={item.id} item={item} />
          ))}
        </AnimatePresence>

        { hasNext && !isLoading &&
          <div ref={loaderRef}></div>
        }

        {
          isLoading &&
          <div>
            <p className="text-center">Loading...</p>
          </div>
        }

        {
          !hasNext && !isLoading &&
          <div>
            <p
              className="text-center mt-10 italic text-gray-400
              border-t-white boder-t-[1px] border-solid"
            >
              No more appointments
            </p>
          </div>
        }
      </div>

    </div>
  );

  async function handleMultiDelete(){

    const reqBody = { ids: selectedIds }

    try {

      const response = await fetchBackend("appointment/hide",{
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(reqBody)
      });

      if (!response.ok) throw new Error("Error occured, no appointments are deleted");

      setRecievedAppointments(items => (
        items.filter(item => (
          !selectedIds.includes(item.id)
        ))
      ));

      setSelectedIds([]);
      toast.success("Appointments deleted successfully");

    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message);
    }
  }
}

function AppointmentCard({item}: {
  item: appointment_list_response_item
}) {

  const { counterpart_name: name, status, header: message, target_date, start_time, id } = item;
  const displayDate = new Date(target_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const displayTime = removeSeconds(start_time);

  const {
    setMainDialogOpened,
    setSelectedAppointmentId,
    selectionOption,
    selectedIds,
    setSelectedIds
  } = useProfAppointment();

  useEffect(()=>{
    console.log(selectedIds);
  }, [selectedIds]);
  return (
    <motion.div
      initial={{ opacity: 0, height: 'auto', marginBottom: 0 }}
      animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
      exit={{ opacity: 0, height: 'auto', marginBottom: 0 }}
      transition={{ duration: 0.3}}

      className="border-t-highlight-muted border-t-[1px]"
    >
      <button
        onClick={handleClick}
        className={`py-4 px-4
        grid grid-cols-[13rem_15rem_10rem_7rem_5rem] my-1
        ${selectionOption === 0 ? 'hover:bg-highlight-muted' : ''}
        ${selectionOption === 2 && selectedIds.includes(id)? 'bg-highlight-muted' : ''}
        duration-100 rounded-md cursor-pointer
        text-left`}
      >

        <p>
          {name}
        </p>

        <p>
          {message}
        </p>

        <p>
          {displayDate}
        </p>

        <p>
          {displayTime}
        </p>

        <div className="flex-cc [&_svg]:text-2xl">
          <StatusIcon statusNumber={status} />
        </div>

      </button>
    </motion.div>
  );

  function handleClick(){
    switch (selectionOption){
      case 0:
        setMainDialogOpened(true);
        setSelectedAppointmentId(id);
        break;
      case 2:
        if (status === 0) break;
        if (selectedIds.includes(id))
          setSelectedIds(ids => ids.filter(val => val !== id)); 
        else
          setSelectedIds(ids => [...ids, id]);
        break;
    }
  }
}

function StatusIcon({statusNumber}:{
  statusNumber: number
}){

  return {

    0: <MdOutlinePending className="fill-yellow-500" />,

    1:  <FaCheck title='approved' className='fill-green-500' />, 

    2: <MdCancel title='declined' className='fill-red-400' />

  }[statusNumber]
}
