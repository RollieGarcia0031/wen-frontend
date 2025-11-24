"use client";

import fetchBackend from "@/lib/fetchBackend";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
   * List of ids of sections that are temporary
   * which means that they are not owned by the user
   * the user has the options to commit it to database
   */
  temporarySections: number[];
  setTemporarySections: Dispatch<SetStateAction<number[]>>;

  /**
   * Refresh the list of owned course by the user
   */
  refreshOwnedSections: () => Promise<void>;
}

const Context = createContext<SectionPanelProps>({
  sections: [] as section_list_all_response_item[],
  setSections: ()=>{},

  ownedSections: [] as section_list_all_response_item[],
  setOwnedSections: ()=>{},

  temporarySections: [] as number[],
  setTemporarySections: () => {},

  refreshOwnedSections: async () => {}
});

export default function SectionPanelContextProvider({children}:{
  children: React.ReactNode
}) {

  const [ sections, setSections ] = useState<section_list_all_response_item[]>([]);
  const [ ownedSections, setOwnedSections ] = useState<section_list_all_response_item[]>([]);
  const [ temporarySections, setTemporarySections ] = useState<number[]>([]);

  useEffect(()=>{
    refreshSections();
  }, []);

  /**
   * Refreshes the list of available sections
   */
  const refreshSections = async () => {
    try {
      const response = await fetchBackend("section/list/all", {
        method: "GET",
        headers: { 'Content-Type' : 'application/json' }
      });

      if (!response.ok) throw new Error("Failed to refresh sections");

      const { data } = await response.json() as section_list_all_response;

      setSections(data);

    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  }

  const refreshOwnedSections = async () => {
    try {
      const response = await fetchBackend("section/list/owned", {
        method: "GET",
        headers: { 'Content-Type' : 'application/json' }
      });

      const { data, success, message } = await response.json() as section_list_owned_response;

      if (!response.ok || !success)
        throw new Error(message || "Failed to refresh owned sections");

      setOwnedSections(data);

    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  }

  return (
    <Context.Provider value={{
      sections, setSections,
      ownedSections, setOwnedSections,
      temporarySections, setTemporarySections,
      refreshOwnedSections
    }}>
    {children}
    </Context.Provider>
  )
}

export const useSectionPanel = () => useContext(Context); 