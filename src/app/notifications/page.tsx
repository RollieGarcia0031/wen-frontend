"use client"

import fetchBackend from "@/lib/fetchBackend";
import { useCallback, useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

async function fetchNotifications(
  isloading: boolean,
  nextCursor: number,
  hasNext: boolean,
  setNotifications: Dispatch<SetStateAction<notification_list_all_response_item[]>>,
  setNextcursor: Dispatch<SetStateAction<number | null>>,
  setIsloading: Dispatch<SetStateAction<boolean>>,
  setHasNext: Dispatch<SetStateAction<boolean>>
){

  if (nextCursor === null) return;
  if (isloading && !hasNext) return;

  const body = { end_from: nextCursor };

  setIsloading(true);

  try {
    const response = await fetchBackend("notification/list/all", {
      method: "POST",
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(body)
    });

    const { success, message, data } = await response.json() as notification_list_all_response;

    if (!response.ok || !success) throw new Error(message || "Unexpected Error Occurred");

    setNotifications(prev => [...prev, ...data.data] );
    setNextcursor(data.next_cursor);
    setHasNext(!!data.next_cursor);

    console.log(!!data.next_cursor);
    console.log(data.next_cursor);
    console.log(data.data);
  } catch (error) {
    if (error instanceof Error) toast.error(error.message);
  } finally {
    setIsloading(false);
  };
}

export default function Notification(){

  const [ notifications, setNotifications ] = useState<notification_list_all_response_item[]>([]);
  const [ nextCursor, setNextcursor ] = useState<number | null>(0);
  const [ isloading, setIsloading ] = useState(false);
  const [ hasNext, setHasNext ] = useState(true);

  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchMore = useCallback((entries: IntersectionObserverEntry[]) => {

    const target = entries[0];

    if (target.isIntersecting && nextCursor !== null && !isloading)
      fetchNotifications(isloading, nextCursor, hasNext, setNotifications, setNextcursor, setIsloading, setHasNext );

  }, [isloading, nextCursor, hasNext]);

  useEffect(()=>{
    observerRef.current = new IntersectionObserver(fetchMore, {
      rootMargin: '20px'
    });
    
    if (loaderRef.current)
      observerRef.current?.observe(loaderRef.current);
  }, [fetchMore]);

  useEffect(()=>{
    if (loaderRef.current)
      observerRef.current?.unobserve(loaderRef.current);
    if (hasNext)
      observerRef.current?.observe(loaderRef.current!);
  }, [hasNext]);

  return (
    <div
      className="grid grid-rows-[auto_1fr] w-[40rem] max-h-[80dvh]
      gap-4"
    >

      <div>
        <h1>
          Notifications
        </h1>
      </div>

      <div className="card p-5 h-[50dvh] overflow-y-auto">
        <AnimatePresence>
          { notifications.map(item => (
            <NotificationCard item={item} key={item.user_notification_id}/>
          )) }
        </AnimatePresence>

        {hasNext && <div ref={loaderRef}> </div>}
      </div>

    </div>
  );
}

function NotificationCard({ item }: {
  item: notification_list_all_response_item
}) {

  const { message, user_notification_id, created_at } = item;
  const displayDate = new Date(created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute:'numeric'
  });

  return (
    <motion.div
      className="card2 my-2"
    >
      <p>
        {message}
      </p>

      <p>
        {displayDate}
      </p>

    </motion.div>
  );
}
