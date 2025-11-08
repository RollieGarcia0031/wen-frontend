"use client"

import { fetchRecievedAppointments, ProfAppointmentContextProvider, useProfAppointment } from "@/context/ProfessorAppointmentContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function Professor(){
  return (
    <ProfAppointmentContextProvider>
      <div>

        Proffessor

        <AppointmentTable />

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
    <div>
      <AnimatePresence>
        {recievedAppointments.map(item => (
          <AppointmentCard key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function AppointmentCard({item}: {
  item: appointment_list_response_item
}) {

  const { name, status, day_of_week } = item;

  return (
    <motion.div>

      <p>
        {name}
      </p>

    </motion.div>
  );
}
