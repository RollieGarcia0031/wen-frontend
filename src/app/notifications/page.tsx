"use client"

import fetchBackend from "@/lib/fetchBackend";
import { useCallback, useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Retrieve notifications from the database
 *
 * @param currentNextCursor - basis as starting point of retrieval in database
 * @param setNextcursor - used to prepare the next request for pagination
 * @param setNotifications - used to update state and UI
 * @param setIsloading - updates state for UI
 * @param setHasNext - to warn the next request if there are more data to load
 */
async function fetchNotifications(
  currentNextCursor: number,
  setNotifications: Dispatch<SetStateAction<notification_list_all_response_item[]>>,
  setNextcursor: Dispatch<SetStateAction<number | null>>,
  setIsloading: Dispatch<SetStateAction<boolean>>,
  setHasNext: Dispatch<SetStateAction<boolean>>
){

  if (currentNextCursor === null) return;

  const body = { end_from: currentNextCursor };

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

  // Refs for pagination
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Refs to hold the latest state values for the stable callback
  const isloadingRef = useRef(isloading);
  const nextCursorRef = useRef(nextCursor);
  const hasNextRef = useRef(hasNext);

  // Update refs upon state changes
  useEffect(() => { isloadingRef.current = isloading; }, [isloading]);
  useEffect(() => { nextCursorRef.current = nextCursor; }, [nextCursor]);
  useEffect(() => { hasNextRef.current = hasNext; }, [hasNext]);

  // Stable callback for IntersectionObserver
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {

    const target = entries[0];

    if (
      target.isIntersecting
      && nextCursorRef.current !== null
      && !isloadingRef.current
      && hasNextRef.current
    ) {
      fetchNotifications(
        nextCursorRef.current,
        setNotifications,
        setNextcursor,
        setIsloading,
        setHasNext
      );
    }

  }, []);

  // Effect to create and cleanup the IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '20px'
    });

    // Start observing if loaderRef.current exists
    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]); // handleIntersection is stable, so this runs once on mount

  // Effect to manage observing/unobserving based on hasNext state
  useEffect(() => {
    if (loaderRef.current && observerRef.current) {
      if (!hasNext) {
        observerRef.current.unobserve(loaderRef.current);
      } else {
        observerRef.current.observe(loaderRef.current);
      }
    }
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
