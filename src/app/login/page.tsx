"use client"

import Image from 'next/image';
import React, { useState } from 'react';

import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

export type logOption = 'signup' | 'login';

export default function Login(){
  const [option, setOption] = useState<logOption>('login');

  return (
    <div className='flex-full-center min-h-screen'>
      <main
        className={`card w-[60rem]
        ${option == 'signup'? 'h-[35rem]': 'h-[25rem]'}
        duration-700 overflow-y-hidden
        grid grid-cols-[25rem_auto]
        px-5 py-10 gap-15`}
      >
        <AuthForm option={option} setOption={setOption}/>
        <div className='flex-full-center h-full'>
          <Image src='/student-teacher.svg' width={400} height={400} alt='student-teacher'/>
        </div>
      </main>
    </div>
  );
}

/**
 * Conditional component that renders the login/signup form based on the option state
 */ 
function AuthForm({option, setOption}: {
  /** The state that serves as base condition on which  to render*/
  option: logOption,
  /** To change the current option state */
  setOption: React.Dispatch<React.SetStateAction<logOption>>
}){
  switch (option) {
    case 'login':
      return <LoginForm setOption={setOption}/>
    case 'signup':
      return <SignupForm setOption={setOption}/>
    default:
      return <LoginForm setOption={setOption}/>
  }
}
