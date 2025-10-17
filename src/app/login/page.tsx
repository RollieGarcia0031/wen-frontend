"use client"

import Image from 'next/image';
import React, { useState } from 'react';

import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

export type logOption = 'signup' | 'login';

export default function Login(){
  const [option, setOption] = useState<logOption>('login');

  return (
    <div className='flex-full-center'>
      <main
        className='flex-rc card
        px-5 py-15 gap-15'
      >
        <AuthForm option={option} setOption={setOption}/>
        <Image src='/student-teacher.svg' width={400} height={400} alt='student-teacher'/>
      </main>
    </div>
  );
}

function AuthForm({option, setOption}: {
  option: logOption,
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