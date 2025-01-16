"use client"

import { Button } from '@/components/ui/button';
import { db } from '@/config/firebaseConfig';
import { useUser, useAuth} from '@clerk/nextjs'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AlignCenter, AlignLeft, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import WorkspaceList from './WorkspaceList';

type Props = {}

type Workspace = {
    id: string,
    createdBy: string,
    orgId: string,
    workspaceName: string
    workspaceCoverImage: string,
    emoji? : string,
  }


const WorkspaceArea = (props: Props) => {
    const { user } = useUser();
    const {orgId} = useAuth();
    const [workspaceList, setWorkspaceList] = useState<Workspace[]>([])

    useEffect(() => {
        // setWorkspaceList([{id: 1, name: 'Dev Workspace'}, {id: 2, name: 'QA Workspace'}])
        if(user) getWorkspaceList()
    }, [user, orgId])

    const getWorkspaceList = async () => {
        const q = query(collection(db, 'Workspace'), where('orgId', '==', orgId?orgId:user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);
        setWorkspaceList([]);

        console.log('### querySnapshot', querySnapshot);
        
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            setWorkspaceList((prev: any) => [...prev, doc.data()])
        })
    }

  return (
    <div className=' p-10 md:px-24 lg:px-36 xl:px-52'>
        <div className='flex justify-between'>
            <h2 className='font-bold text-xl'>Hello, <span className='font-semibold text-2xl'>{user?.fullName}</span></h2>
            <Link href={'/createworkspace'}><Button>+</Button></Link>
        </div>

        <div className='flex justify-between mt-10'>
            <div><h2 className='font-semibold text-xl text-primary'>Workspaces</h2></div>
            <div className='flex gap-2'>
                <LayoutGrid />
                <AlignLeft />
            </div>
        </div>

        {!workspaceList?.length ?
            <div className='p-10 my-10 flex flex-col items-center justify-center'>
                <Image src={'/workspace.png'} alt='workspace' width={250} height={250}/>
                <Link href={'/createworkspace'}><Button size={'lg'}><span className='text-md'>+ Add Workspace</span></Button></Link>
            </div>
            : 
            <div className=''>
                {/* {workspaceList?.map((ws: WorkspaceItem) => (<h2>{ws?.name}</h2>))
                } */}
                <WorkspaceList workspaceList={workspaceList} />
            </div> 
        }
    </div>
  )
}

export default WorkspaceArea;