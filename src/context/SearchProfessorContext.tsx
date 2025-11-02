"use client"

import { useContext, createContext, useState } from "react"

interface ProfessorContextProps {
  searchResults: search_professor_response_item[];
  setSearchResults: React.Dispatch< React.SetStateAction<search_professor_response_item[]> >
}

const SearchProfessorContext = createContext<ProfessorContextProps>({
  searchResults: [],
  setSearchResults: ()=>{} 
});

export function SearchProfessorContextProvider({children}:{children:React.ReactNode}){
 
  const [ searchResults, setSearchResults ] = useState<search_professor_response_item[]>([]);

  return (
    <SearchProfessorContext.Provider value={{
      searchResults,
      setSearchResults
    }}>
      {children}
    </SearchProfessorContext.Provider>
  );
}

export const useSearchProfessor = () => useContext(SearchProfessorContext);
