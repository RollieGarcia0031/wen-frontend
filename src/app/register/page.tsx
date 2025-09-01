"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { fetchBackend } from "@/lib/api"; 

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("student");

  useEffect(()=>{
    console.log(role);
  },[role]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="inline-block">
        <form
          onSubmit={e=>handleSubmit(e)}
          className="flex flex-col gap-2"
        >
          <p>Log in with your account</p>
          <InputForm type="email" label="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputForm type="password" label="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputForm type="text" label="Name" value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="professor">professor</option>
            <option value="student">student</option>
          </select>

          <button type="submit">Register</button>

        </form>
      </div>
      <Link href='/login'>Or you can Log in</Link>
    </div>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = JSON.stringify({email, password, name, role});
    const headers = new Headers({"Content-Type": "application/json"});

    console.log(body);

    const response = await fetchBackend("auth/signup", "POST", body, headers);
    console.log(response);

  }
}

function InputForm({type, label, value, onChange}: {
  type: string, label: string, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      {label}:
      <input type={type} required
        value={value}
        onChange={onChange}
      />
    </label>
  );
}