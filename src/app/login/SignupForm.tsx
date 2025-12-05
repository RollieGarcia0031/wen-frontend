"use client";

import { useState, useEffect } from "react";
import { logOption } from "./page";
import fetchBackend from "@/lib/fetchBackend";
import { toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa";

export default function SignupForm({setOption}: {
  setOption: React.Dispatch<React.SetStateAction<logOption>>
}){

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false);

    const passwordMatched = password === confirmPassword;

    useEffect(() => {
      setPasswordValid(isStrongPassword(password));
    }, [password]);

    // used to limit the api request at a time, only one api
    // request will be allowed to be sent, before each responses
    const [ isSubmitting, setIsSubmitting ] = useState(false);

  return (
      <form className='flex-cl justify-between gap-2 h-full
      px-15 min-w-30
      [&_input]:w-full [&_div]:w-full
      border-r-[1px] border-r-solid border-r-highlight-muted
      overflow-y-auto'

      onSubmit={(e) => handleSubmit(e)}
    >
      <h1 className='font-bold mb-4 text-left'>Sign Up</h1>

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
        {!passwordValid && password && (
            <div className='flex items-center gap-2'>
                <button
                    type="button"
                    className="text-blue-500 text-sm mt-1 underline"
                    onClick={() => setShowPasswordRequirements(!showPasswordRequirements)}
                >
                  <FaInfoCircle />
                </button>
                <p className='text-red-500 text-sm mt-1'>
                    Password is not strong enough.
                </p>
            </div>
        )}
        {showPasswordRequirements && !passwordValid && password && (
            <p className='text-red-500 text-sm mt-1'>
                Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
            </p>
        )}
      </div>

      <div>
        <label>Confirm Password</label> <br/>
        <input type='password' required
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {
        !passwordMatched &&
        <span className="text-red-400">
          <p className='text-red-500'>
            Passwords do not match
          </p>
        </span>
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
        className='primary-button mt-4   disabled:opacity-50 
        py-2 rounded-md w-full mb-8
        shadow-black shadow-lg'
        type='submit'
        disabled={ !passwordMatched || isSubmitting || !password  || !confirmPassword || !passwordValid }
      >
        Sign Up
      </button>

      <p className="text-center w-full">
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

    if (isSubmitting) return;

    if (!passwordValid) {
        toast.error('Password does not meet the strength requirements.');
        return;
    }

    const formdata = new FormData(e.currentTarget);

    const data = Object.fromEntries(formdata);

    // update state, to block further api requests
    setIsSubmitting(true);

    // send api request
    const response = await fetchBackend('auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // handle response
    if (response.ok){
      toast.info('Signup successful');

      setIsSubmitting(false);
      return setOption('login');

    } else {
      const json = await response.json() as common_response;
      toast.error(json.message);
      setIsSubmitting(false);
    }
  }
}

/**
 * Checks if the password is valid
 * with minimum length of 8, uppercase, lowercase, digit, and special character
 * @param password 
 * @returns 
 */
function isStrongPassword(password: string){
  const minLength = /.{8,}/;
  const upper = /[A-Z]/;
  const lower = /[a-z]/;
  const digit = /[0-9]/;
  const special = /[^A-Za-z0-9]/;

  return (
    minLength.test(password) &&
    upper.test(password) &&
    lower.test(password) &&
    digit.test(password) &&
    special.test(password)
  );
}