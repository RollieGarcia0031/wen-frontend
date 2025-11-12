"use client"

import { useNotification } from "@/context/NotificationContext";
import { RefObject } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from "react-icons/fa";

export default function NotifMiniPanel({ref}:{
  ref: RefObject<HTMLDivElement | null>
}) {

  const { unreadNotifications } = useNotification();

  return (
    <div
      ref={ref}
      className="card2 p-2 absolute right-[5rem]
      w-[20rem] max-h-[50dvh] overflow-y-auto"
    >
      <AnimatePresence>
        {
          unreadNotifications.map(item => (
            <NotifCard key={item.notification_id} item={item} />
          ))
        }

        {
          unreadNotifications.length === 0 && (
            <p> No notification Availabile </p>
          )
        }
      </AnimatePresence>
    </div>
  );
}

function NotifCard({item}:{
  item: notification_list_unread_response_item
}){
  
  const { id, message, created_at } = item;

  const displayDate = new Date(created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  return (
    <motion.div
      className="card2 text-sm my-2 flex flex-row items-center gap-4"
    >
      <div>
        <FaBell />
      </div>

      <div>
        <p>
          {message}
        </p>
        
        <p
          className="text-text-muted text-xs"
        >
          {displayDate}
        </p>
      </div>
    </motion.div>
  );
}
