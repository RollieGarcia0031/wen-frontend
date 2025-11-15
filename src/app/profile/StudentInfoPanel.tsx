"use state"

import { useState, useEffect } from "react"

export default function StudentInfoPanel(){

  const [ sections, setSections ] = useState([]);

  useEffect(()=>{

  }, []);

  return (
    <div className="card2">
      <h3>
        Student Info
      </h3>
    </div>
  );
}
