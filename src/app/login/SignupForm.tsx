"use client";

import { useState } from "react";
import { logOption } from "./page";
import fetchBackend from "@/lib/fetchBackend";

export default function SignupForm({setOption}: {
  setOption: React.Dispatch<React.SetStateAction<logOption>>
}){

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const passwordMatched = password === confirmPassword;

  return (
      <form className='flex-cc justify-between gap-2 h-full
      px-15 min-w-30
      [&_input]:w-full [&_div]:w-full
      border-r-[1px] border-r-solid border-r-highlight-muted'

      onSubmit={(e) => handleSubmit(e)}
    >
      <h1 className='font-bold mb-4'>Sign Up</h1>

      <div>
        <label>Username</label><br/>
        <input type='text' name='name' placeholder='John Doe' required/>
      </div>

      <div>
        <label>Email</label><br/>
        <input type='email' name='email' placeholder='example@email.com' required/>
      </div>

      <div>
        <label>Password</label> <br/>
        <input type='password' name='password' required
            value={password} onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label>Confirm Password</label> <br/>
        <input type='password' required
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {
        !passwordMatched &&
        <p className='text-red-500'>
          Passwords do not match
        </p>
      }

      <div className='flex-rl items-center gap-2
      mt-4'>
        <label>Role:</label>
        <select className='px-4 py-2' name='role'>
          <option value='student'>Student</option>
          <option value='professor'>Professor</option>
        </select>
      </div>

      <button
        className='primary-button mt-4 
        py-2 rounded-md w-full mb-8'
        type='submit'
        disabled={!passwordMatched}
      >
        Sign Up
      </button>

      <p>
        Already have an account?
          <span
            className='text-highlight ml-2
            font-semibold cursor-pointer'
            onClick={() => setOption('login')}
          >
            Login
          </span>  
      </p>
    </form>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);

    const data = Object.fromEntries(formdata);

    const response = await fetchBackend('auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok){
        alert('Signup successful');
        return setOption('login');
    } else {
        const json = await response.json() as common_response;
        alert(json.message);
    }
  }
}