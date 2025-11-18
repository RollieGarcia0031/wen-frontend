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
export default function Professor(){
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
    isLoading
  } = useProfAppointment();

  const observerHandler = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasNext && !isLoading) {
      fetchMoreAppointments();
    }
  }, [ fetchMoreAppointments, hasNext, isLoading ] );

  useEffect(()=>{

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(observerHandler);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };

  }, [ observerHandler ])

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
          </span>
          
          { selectionOption === 2 &&
            <button className='flex-rc'
              onClick={handleMultiDelete}
            >
              <FaTrash
                className={`${selectedIds.length > 0? 'fill-red-600':''}
                duration-500`}
              />
            </button>
          }
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

  const { counterpart_name: name, status, message, target_date, start_time, id } = item;
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
