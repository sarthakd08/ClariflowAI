'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isLoaded, user } = useUser(); // useUser hook to check the authentication state

  // Redirect to dashboard if the user is signed in
  useEffect(() => {
    console.log('11111');
    
    if (isLoaded && user) {
      console.log('222222');
      router.push('/dashboard');
    }
  }, [isLoaded, user, router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}

        <LoaderCircle className="text-primary h-8 w-8"/>
      </main>
    </div>
  );
}
