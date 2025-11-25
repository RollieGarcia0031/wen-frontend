"use cient"

import Link from "next/link";
import { useAppointment } from "@/context/AppointmentContext";
import { useSearchProfessor } from "@/context/SearchProfessorContext";
import fetchBackend from "@/lib/fetchBackend";
import { useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoSend } from "react-icons/io5";

export default function SearchProfessorDialog(){
  const { searchDialogOpened, setSearchDialogOpened} = useAppointment();
  const { setSearchResults, searchResults } = useSearchProfessor();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  
  useEffect(()=>{
    if (searchDialogOpened) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [searchDialogOpened]);

  return (
    <dialog ref={dialogRef} onClose={()=>setSearchDialogOpened(false)} onSubmit={e => e.preventDefault() } 
      className="pt-0"
    >
      <div className="grid grid-rows-[auto_69dvh] gap-y-5
        h-[70dvh] w-[40rem] overflow-hidden
      ">
        <div className="flex-rr">
          <button onClick={()=>setSearchDialogOpened(false)}>
            <IoMdCloseCircleOutline /> 
          </button>
        </div>

        <div className="space-y-10 overflow-auto">
           <form className="flex-rl
            border-highlight-muted border-[1px]
            rounded-md mx-4 px-2"
            
             onSubmit={handleSearch}

           >
              <input className="flex-1" name='user_name'
                placeholder="Search..."
              />

              <button type='submit'>
                <FaSearch/>
              </button>
           </form>

           <div className="space-y-4">
              {/* Render the search results */
                searchResults.map(item =>(
                  <SearchResultCard
                    key={item.id}
                    searchResultItem={item}
                  />
                ))
              }
           </div>
        </div>
      </div>
    </dialog>
  );

  /**
   * Searches for the professor based on user name
   */
  async function handleSearch(event: React.SyntheticEvent<HTMLFormElement>){
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
  
    const response = await fetchBackend("search/professors",{
      method: "POST",
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok){
      const { message } = await response.json() as common_response;
      alert(message);
      return;
    }

    // get the json data
    const json = await response.json() as common_response;
    const jsonData = json.data as search_professor_response_item[];

    // save the state
    setSearchResults(jsonData);

  }
}

export function SearchResultCard({searchResultItem}:{
  searchResultItem: search_professor_response_item
}){

  const { name, id } = searchResultItem;
  const classes = ["fake1", "fake2"];

  return (

    <div
      className="card2 mx-10 py-2 px-4
      grid grid-cols-[1fr_auto] items-center"
    > 

      <div>
        <p className="text-md font-bold">
          {name}
        </p>

        <div className="flex-rl gap-2 text-xs">
          { 
            classes.map((item, index) => (
              <p key={index}>
                {item}
              </p>
            ))
          }
        </div>
      </div>

      <Link href={`/appointment/send/${id}`}>
        <button>
          <IoSend />
        </button>
      </Link>

    </div>

  );
}
