"use client";

import PersonalInfoPanel from "./PersonalInfoPanel";

export default function StudentPage() {
  return (
    <div
      className="flex flex-col place-items-center"
    >
      <div className="p-4">
        <PersonalInfoPanel />
      </div>
    </div>
  );
}