"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { fetchBackend } from "@/lib/api"; 
import { useRouter } from "next/navigation";
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { IoMdEye } from "react-icons/io";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("student");

  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="card bg-background-medium
        sm:py-10 sm:px-8 sm:w-[22rem]"
      >
        <form
          onSubmit={e=>handleSubmit(e)}
          className="flex flex-col gap-2"
        >
          <p
            className="font-bold text-center sm:text-xl mb-4"
          >
            Log in with your account
          </p>
          <InputForm type="email" label="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputForm type="password" label="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputForm type="text" label="Name" value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <label
            className="sm:mt-4 font-bold"
          >Select A Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} >
            <option value="professor">professor</option>
            <option value="student">student</option>
          </select>

        <div className="flex-row-center">
          <button
            type="submit"
            className="border-highlight border-[1px] border-solid rounded-md
              bg-primary text-background hover:bg-primary-hover duration-150
              sm:px-4 sm:py-1 sm:mt-4"
          >
            Register
          </button>
        </div>

        </form>
      </div>
      <Link href='/login'>Or you can Log in</Link>
    </div>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = JSON.stringify({email, password, name, role});
    const headers = new Headers({"Content-Type": "application/json"});

    try{
      const response = await fetchBackend("auth/signup", "POST", body, headers);
      console.log(response);

      if(response.success) {
        router.push("/login");
      }
      alert(response.message);

    } catch (error) {
      console.error(error);
    }

  }
}

function InputForm({type, label, value, onChange}: {
  type: string, label: string, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="flex flex-col gap-1 w-full">
      <p className="font-bold text-text-muted">{label}:</p>
      <div className="flex flex-row gap-2">
        <input type={`${showPassword ? "text" : type}`} required
          className="flex-1"
          value={value}
          onChange={onChange}
        />
        {type === "password" &&
          <button
            type='button'
            onClick={() => setShowPassword(x=>!x)}
          >
            {showPassword ? <MdRemoveRedEye/> : <MdOutlineRemoveRedEye/>}
          </button>
        }
      </div>
    </label>
  );
}