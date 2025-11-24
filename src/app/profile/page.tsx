'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { IoMdAddCircleOutline } from "react-icons/io";
import SectionPanel from "./SectionPanel";
import DepartmentPanel from "./DepartmentPanel";

export default function Profile(){
  const { user, setUser } = useAuth();
  const { name } = user || {};
  const [username, Setusername] = useState<string>(name || '');

  useEffect(() => {
    if (name) {Setusername(name); console.log('updated name to', name)}
  }, [user]);

  return (
    <div className="flex-cc">
      <div
        className="p-6 w-[50rem]"
      >
        <h1>Profile Settings</h1>  
        <p className="text-muted mb-4">
          Manage your profile settings
        </p>

        <div
          className="[&>div]:p-8 p-6 flex-cl gap-8
          [&_input]:w-full [&_div]:w-full
          "
        >
          {/* contains the user information */}
          <div className="flex-cl gap-4 px-8 card2">
            <h3>User Info</h3>
            <div>
              <label>Username</label>
              {user && <input type="text" value={username} onChange={(e) => Setusername(e.target.value)}/>}
            </div>

            <div>
              <label>Role</label>
              <input type="text" defaultValue={user?.role} disabled />
            </div>
          </div>

          <SectionPanel />

          { user?.role === 'professor' && <DepartmentPanel /> }
        </div>
      </div>
    </div>
  );    
}
