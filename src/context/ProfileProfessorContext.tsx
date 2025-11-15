"use state"

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"

interface ProfessorProfileProps {
  /**
   * Contains list of the courses that are
   * created by the logged professor
   */
  ownedCourses: SelfCourseItem[];
  setOwnedCourses: Dispatch<SetStateAction<SelfCourseItem[]>>;
}

const Context = createContext<ProfessorProfileProps>({
  ownedCourses: [],
  setOwnedCourses: ()=>{}
});

export function ProfileProfessorContext({children}:{
  children: ReactNode
}) {

  const [ ownedCourses, setOwnedCourses ] = useState<SelfCourseItem[]>([]);

  return (
    <Context.Provider
      value={{
        ownedCourses,
        setOwnedCourses
      }}
    >
      {children}
    </Context.Provider>
  );
}
