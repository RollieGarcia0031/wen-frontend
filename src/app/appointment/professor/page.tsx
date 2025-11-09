"use client"

import { fetchRecievedAppointments, ProfAppointmentContextProvider, useProfAppointment } from "@/context/ProfessorAppointmentContext";
import { removeSeconds } from "@/util/TimeFormat";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { MdOutlinePending } from "react-icons/md";
import RecivedAppointmentDialog from "@/components/RecivedAppointmentDialog";

export default function Professor(){
  return (
    <ProfAppointmentContextProvider>
      <div>

        Proffessor

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

  const { setRecievedAppointments, recievedAppointments } = useProfAppointment();

  useEffect(() => {
    fetchRecievedAppointments(setRecievedAppointments);
  }, []);

  return (
    <div
      className="flex-cc pb-8"
    >
      <div
        className="card w-[57rem] rounded-md p-8"
      >

        <div>
          <p className="text-4xl font-extrabold">
            Appointment History
          </p>
          <p className="mb-12">
            A complete record of all your scheduled meetings.
          </p>
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
      </div>

    </div>
  );
}

function AppointmentCard({item}: {
  item: appointment_list_response_item
}) {

  const { name, status, message, target_date, start_time, id } = item;
  const displayDate = new Date(target_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const displayTime = removeSeconds(start_time);

  const { setMainDialogOpened, setSelectedAppointmentId } = useProfAppointment();

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
        className=" py-4 px-4
        grid grid-cols-[13rem_15rem_10rem_7rem_5rem] my-1
        hover:bg-highlight-muted duration-100 rounded-md cursor-pointer"
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
    setMainDialogOpened(true);
    setSelectedAppointmentId(id);
  }
}

function StatusIcon({statusNumber}:{
  statusNumber: number
}){

  return {

    0: <MdOutlinePending className="fill-yellow-600" />,

    1: <p> Approved </p>,

    2: <p> Decilined </p>
  }[statusNumber]
}
