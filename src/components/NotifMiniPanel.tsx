"use client"

import { useNotification } from "@/context/NotificationContext";
import { RefObject } from "react";
import { motion, AnimatePresence } from 'framer-motion';

export default function NotifMiniPanel({ref}:{
  ref: RefObject<HTMLDivElement | null>
}) {

  const { unreadNotifications } = useNotification();

  return (
    <div
      ref={ref}
      className="card p-4 absolute right-[5rem]
      w-[20rem]"
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
    year: 'numeric'
  });

  return (
    <motion.div
      className="card2 text-sm"
    >
      <p>
        {message}
      </p>
      
      <p className="text-text-muted border-t-[1px] border-t-solid border-t-highlight-muted
        mt-2"
      >
        {displayDate}
      </p>
    </motion.div>
  );
}
