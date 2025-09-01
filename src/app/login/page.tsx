"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { fetchBackend } from "@/lib/api"; 

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
          <button type="submit">Log in</button>

        </form>
      </div>
      <Link href='/register'>Don&apos;t have an account?</Link>
    </div>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = JSON.stringify({email, password});
    const headers = new Headers({"Content-Type": "application/json"});

    console.log(body);

    try {
      const response = await fetchBackend("auth/login", "POST", body, headers);
      alert(response.message);
      if (response.success) window.location.href = "/";
      
    } catch (error) {
      console.error(error);
    }


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