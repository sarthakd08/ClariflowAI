'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  const router = useRouter();
  const { isLoaded, user } = useUser(); // useUser hook to check the authentication state


  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <div>    
        <div>
          <Header userInfo={user} />
          <Hero userInfo={user}/>
        </div>
      
    </div>
  );
}
