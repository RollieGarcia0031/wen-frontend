"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { fetchBackend } from "@/lib/api";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUserName, setRole } = useAuthContext();

  return (
    <div
      className="flex flex-col justify-center items-center h-full"
    >
      <div className="card bg-background-medium
        sm:p-10 sm:mb-4">
        <form
          onSubmit={e=>handleSubmit(e)}
          className="flex flex-col gap-2"
        >
          <p
            className="font-bold sm:text-xl mb-4"
          >
            Log in with your account</p>
          <InputForm type="email" label="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputForm type="password" label="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex-row-center">
            <button
              className="border-highlight border-[1px] border-solid rounded-md
                bg-primary text-background hover:bg-primary-hover duration-150
                sm:py-1 sm:px-4 sm:mt-4"
              type="submit"
            >
              Log in
            </button>
          </div>

        </form>
      </div>
      <Link href='/register'>Don&apos;t have an account?</Link>
    </div>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = JSON.stringify({email, password});
    const headers = new Headers({"Content-Type": "application/json"});

    try {
      const response = await fetchBackend("auth/login", "POST", body, headers);
      
      if (response.success && response.data && setUserName && setRole) {
        const { role, name } = response.data;
        
        setUserName(name);
        setRole(role);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("name", name);
        
        router.push("/");
        return;
      };
      alert(response.message);
      
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
      <p
        className="font-bold text-text-muted"
      >{label}:</p>
      <input type={type} required
        value={value}
        onChange={onChange}
      />
    </label>
  );
}