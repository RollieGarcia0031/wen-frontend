"use client";

import { section } from "framer-motion/client";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface SectionPanelProps {
  /**
   * List of all available sections
   */
  sections: section_list_all_response_item[];
  setSections: Dispatch<SetStateAction<section_list_all_response_item[]>>;

  /**
   * List of all sections that the user owns
   */
  ownedSections: section_list_all_response_item[];
  setOwnedSections: Dispatch<SetStateAction<section_list_all_response_item[]>>;

  /**
   * List of all sections to be added to the database
   * used for temporary storage, and render new sections to
   * be added
   */
  temporarySections: section_list_all_response_item[];
  setTemporarySections: Dispatch<SetStateAction<section_list_all_response_item[]>>;
}

const Context = createContext({
  sections: [] as section_list_all_response_item[],
  setSections: () => {},

  ownedSections: [] as section_list_all_response_item[],
  setOwnedSections: () => {},

  temporarySections: [] as section_list_all_response_item[],
  setTemporarySections: () => {},
});

export default function SectionPanelContext({children}:{
  children: React.ReactNode
}) {

  const [ sections, setSections ] = useState<section_list_all_response_item[]>([]);
  const [ ownedSections, setOwnedSections ] = useState<section_list_all_response_item[]>([]);
  const [ temporarySections, setTemporarySections ] = useState<section_list_all_response_item[]>([]);


  return (
    <Context.Provider value={{
      sections, setSections,
      ownedSections, setOwnedSections,
      temporarySections, setTemporarySections
    }}>
    {children}
    </Context.Provider>
  )
}

export const useSectionPanel = () => useContext(Context); 