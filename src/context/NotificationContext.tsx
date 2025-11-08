"use client"

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

export const useNotification = () => useContext(Context);
