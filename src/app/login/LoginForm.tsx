"use client";

import { logOption } from "./page";
import fetchBackend from "@/lib/fetchBackend";
import { useRouter } from "next/navigation";

export default function LoginForm({setOption}: {
  setOption: React.Dispatch<React.SetStateAction<logOption>>
}){

  const router = useRouter();

  return (
    <form className='flex-cc justify-center gap-2 h-full
    px-15
    [&_*]:w-full
    border-r-[1px] border-r-solid border-r-highlight-muted'

    onSubmit={(e) => handleSubmit(e)}
  >
    <h1 className='font-bold mb-4'>Login</h1>
    
    <div>
      <label>Email</label><br/>
      <input type='email' placeholder='example@email.com' name="email" required/>
    </div>

    <div>
      <label>Password</label> <br/>
      <input type='password' name="password"required/>
    </div>
    
    <button
      className='primary-button mt-4
      py-2 rounded-md w-full
      mb-8'
      type='submit'
    >
      Login
    </button>

    <p>
      Don&apos;t have an account yet?
        <span
          className='text-highlight ml-2
          font-semibold cursor-pointer'

          onClick={() => setOption('signup')}
        >
          Register
        </span>  
    </p>
  </form>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData);

    const response = await fetchBackend('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok){
        return router.push('/');
    } else {
        const json = await response.json() as common_response;
        alert(json.message);
    }
  }
}