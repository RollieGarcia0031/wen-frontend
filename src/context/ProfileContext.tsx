"use client"

import { useContext, createContext, useState, Dispatch, SetStateAction } from "react"

/*
 *
 * This file contains the context that will be used
 * to read and update the profile of the logged user
 * some values of this context can be null depending
 * on the role of the logged user
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

  /**
   * Contains list of sections with corresponding course_id
   * it wil use courseList as it's lookup table to render the
   * matching course in fetched section
   */
  sectionList: [];
  setSectionList: Dispatch<SetStateAction<[]>>;
}

const Context = createContext<ProfileContextProps>({
  courseList: [],
  setCourseList: ()=>{},

  sectionList: [],
  setSectionList: ()=>{}
});

export function ProfileContextProvider({children}:{
  children: React.ReactNode
}){

  const [ courseList, setCourseList ] = useState<courseListItem[]>([]);
  const [ sectionList, setSectionList ] = useState<[]>([]);

  return (
    <Context.Provider
      value={{
        courseList,
        setCourseList,
        sectionList,
        setSectionList
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useProfileContext = () => useContext(Context);
