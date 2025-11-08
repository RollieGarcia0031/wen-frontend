"use client"

import fetchBackend from "@/lib/fetchBackend";
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";

interface NotificationContextProps {
  /**
   * List of both seen and unseen notifications
   */
  notifications: notification_list_all_response_item[];
  setNotifications: Dispatch<SetStateAction<notification_list_all_response_item[]>>;
  /**
   * The id of next notification to fetch,
   *  - will be used for pagination
   */
  notifNextCursor: number;
  setNotifNextCursor: Dispatch<SetStateAction<number>>;

  /**
   * List of unseen notifications
   */
  unreadNotifications: notification_list_unread_response_item[];
  setUnreadNotifications: Dispatch<SetStateAction<notification_list_unread_response_item[]>>;
}

const Context = createContext<NotificationContextProps>({
  notifications: [],
  setNotifications: ()=>{},

  notifNextCursor: 0,
  setNotifNextCursor: ()=>{},

  unreadNotifications: [],
  setUnreadNotifications: ()=>{}
});

export function NotificationContextProvider({children}:{
  children: React.ReactNode
}) {
  const [ notifNextCursor, setNotifNextCursor ] = useState(0);
  const [ notifications, setNotifications ] = useState<notification_list_all_response_item[]>([]);
  const [ unreadNotifications, setUnreadNotifications ] = useState<notification_list_unread_response_item[]>([]);

  useEffect(()=>{
    refreshUnreadNotifications(setUnreadNotifications);
  }, [])

  return (
    <Context.Provider value={{
      notifications,
      setNotifications,
      unreadNotifications,
      setUnreadNotifications,
      notifNextCursor,
      setNotifNextCursor
    }}>
      {children}
    </Context.Provider>
  );
}

/**
 * Refresh the list of unread notifications
 */
export async function refreshUnreadNotifications(
  setUnreadNotifications: Dispatch<SetStateAction<notification_list_unread_response_item[]>>
) {
  const reqBody = {
    end_from: 0
  };

  const response = await fetchBackend("notification/list/unread", {
    method: "POST",
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify(reqBody)
  });

  if (!response.ok){
    return;
  }

  const { data } = await response.json() as notification_list_unread_response;
  
  setUnreadNotifications(data);
}

/**
 * fetches the list of notification with pagination
 *
 * @param setNotifications - hook for updated
 * @param setNotifNextCursor - hook for pagination
 * @param end_from - derived from next_cursor of this response
 *                 - for first time api call, it should be zero (0)
 */
export async function fetchNotifications(
  setNotifications: Dispatch<SetStateAction<notification_list_all_response_item[]>>,
  setNotifNextCursor: Dispatch<SetStateAction<number>>,
  end_from: number
) {
  const reqBody = { end_from };

  const response = await fetchBackend("notification/list/all", {
    method: "POST",
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify(reqBody)
  });

  if (!response.ok) {
    return;
  }

  const { data } = await response.json() as notification_list_all_response;

  setNotifications(data.data);
  setNotifNextCursor(data.next_cursor);

  return data.next_cursor;
}

export const useNotification = () => useContext(Context);
