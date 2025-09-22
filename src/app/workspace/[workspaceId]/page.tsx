"use client"

import React, { useEffect, useState } from 'react'
import SideNav from './_components/SideNav'
import Image from 'next/image'
import { db } from '@/config/firebaseConfig'
import { Button } from '@/components/ui/button'
import CreateDocDialogue from './_components/CreateDocDialogue'
import { doc, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import uuid4 from 'uuid4';
import { useParams, useRouter } from 'next/navigation';

type Props = {
    params: any
}

const WorkSpace = ({params}: Props) => {
    // const {workspaceId, documentId} = JSON.parse(params.value);
    // const [workspaceId, setWorkspaceId] = useState('')
    console.log('## workspace page params', params?.value);
    const router = useRouter()
    const {user} = useUser();

  return (
    <div>
        {/* Sidenav */}
        <div>
            <SideNav params={params} />
        </div>

        {/* document here */}
        <div className='md:ml-72 flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900'>
           <h3 className='text-md text-gray-600 dark:text-gray-300'>Select or Create a document to open its content here</h3>
           {/* <Image src={'/workspace.png'} alt='workspace' width={250} height={250}/> */}
           {/* <Image src={'/workspace.jpeg'} alt='cover' width={300} height={300}/> */}
            {/* <div className='p-10 my-10 flex flex-col items-center justify-center'>
                <Image src={'/workspace.png'} alt='workspace' width={250} height={250}/>
                <CreateDocDialogue onCreateDocument={onCreateNewDocument}>
                    <Button size={'lg'}><span className='text-md'>Create new document</span></Button>
                    <h3>Heyyyyy</h3>
                </CreateDocDialogue>
            </div> */}
        </div>
    
    </div>
  )
}

export default WorkSpace