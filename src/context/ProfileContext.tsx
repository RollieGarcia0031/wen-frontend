"use client"

import { useContext, createContext, useState, Dispatch, SetStateAction } from "react"

/*
 *
 * This file contains the context that will be used
 * to read and update the profile of the logged user
 * all values of this context are the only traits
 * the both student and professor possess
 *
 */

interface ProfileContextProps {
  /**
   * Contains list of courses of both profesor and student
   *
   * for professors, it represents the courses that user teaches
   * for students, it represents the courses that a user is studying
   */
  courseList: courseListItem[];
  setCourseList: Dispatch<SetStateAction<courseListItem[]>>;
}

const Context = createContext<ProfileContextProps>({
  courseList: [],
  setCourseList: ()=>{},
});

export function ProfileContextProvider({children}:{
  children: React.ReactNode
}){

  const [ courseList, setCourseList ] = useState<courseListItem[]>([]);

  return (
    <Context.Provider
      value={{
        courseList,
        setCourseList
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useProfileContext = () => useContext(Context);
