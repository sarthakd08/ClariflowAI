"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { usePathname } from 'next/navigation';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

export function Room({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const id = pathname.split('/').pop() || '';

  return (
    <LiveblocksProvider 
        // publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCK_PUBLIC_KEY || ""}
        authEndpoint="/api/liveblocks-auth"
        resolveUsers={async ({ userIds }) => {
            try {
                const q=query(collection(db,'Users'),where('email','in',userIds));
                const querySnapshot=await getDocs(q);
                const userList: any[]=[];
                querySnapshot.forEach((doc)=>{
                  console.log(doc.data())
                  userList.push(doc.data())
                })
                console.log('#### room userList', userList);
                
               return userList;
            } catch (error) {
                console.error('Error resolving users:', error);
                return [];
            }
        }}

        resolveMentionSuggestions={async ({ text, roomId }) => {
            try {
                const q=query(collection(db,'Users'),where('email','!=',null));
                const querySnapshot=await getDocs(q);
                let userList: any[]=[];
                querySnapshot.forEach((doc)=>{
                    userList.push(doc.data())
                })
            
                if (text) {
                    // Filter any way you'd like, e.g. checking if the name matches
                    userList = userList.filter((user) => user.name && user.name.includes(text));
                }
                console.log(userList.map((user) => user.email))
            
                // Return a list of user IDs that match the query
                return userList.map((user) => user.email);
            } catch (error) {
                console.error('Error resolving mention suggestions:', error);
                return [];
            }
        }}
    >
      <RoomProvider id={id}>
        <ClientSideSuspense fallback={<div>Loading Comments…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
