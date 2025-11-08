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
   * List of unseen notifications
   */
  unreadNotifications: notification_list_unread_response_item[];
  setUnreadNotifications: Dispatch<SetStateAction<notification_list_unread_response_item[]>>
}

const Context = createContext<NotificationContextProps>({
  notifications: [],
  setNotifications: ()=>{},

  unreadNotifications: [],
  setUnreadNotifications: ()=>{}
});

export function NotificationContextProvider({children}:{
  children: React.ReactNode
}) {
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
      setUnreadNotifications
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

export const useNotification = () => useContext(Context);
