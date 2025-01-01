"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon, SmileIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import CoverPicker from '../_components/CoverPicker';
import coverPics from '../_shared/cover-pics';
import { doc, setDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig'
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import uuid4 from 'uuid4';

type Props = {}

const CreateWorkspace = (props: Props) => {
    const [workspaceCoverImage, setWorkspaceCoverImage] = useState(coverPics?.length ? coverPics[0].imageUrl: '');
    const [workspaceName, setWorkspaceName] = useState('')
    const [loading, setLoading] = useState(false);
    const {user} = useUser();
    const {orgId} = useAuth()
    const router = useRouter()

    /**
     * To Create new Workspace and add in our Database 
     */
    const onCreateWorkspace = async () => {
        setLoading(true);

        const workspaceId = Date.now();
        console.log('### ',{workspaceName: workspaceName,
            workspaceCoverImage: workspaceCoverImage,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            id: workspaceId,
            orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress});

        console.log('### db', db);
        
        // return;
        const result = await setDoc( doc(db, 'Workspace', workspaceId.toString()), {
            workspaceName: workspaceName,
            workspaceCoverImage: workspaceCoverImage,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            id: workspaceId,
            orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress
        })

        const docId= uuid4();
        await setDoc(doc(db,'workspaceDocuments',docId.toString()),{
            workspaceId:workspaceId.toString(),
            createdBy:user?.primaryEmailAddress?.emailAddress,
            coverImage:null,
            emoji:null,
            id:docId,
            documentName:'Untitled Document',
            documentOutput:[],
            createdAt: serverTimestamp()
        })

        await setDoc(doc(db, 'DocumentOutput', docId.toString()), {
            docId: docId,
            output: []
        })

        console.log('Data Inserted in 3 collections susscessfully!')
        setLoading(false);
        router.replace('/workspace/'+workspaceId+'/'+docId)
    }

  return (
    <div className='p-10 md:p-48 lg:px-96 xl-px-96 py-20'>

        <div className='shadow-2xl rounded-2xl'>
            {/* Workspace Cover header */}
            <CoverPicker setCoverImage={(v) => { setWorkspaceCoverImage(v)}}>
                <div>
                    <div className='relative group cursor-pointer'>
                        <h2 className='absolute w-full h-full flex items-center justify-center text-beige font-bold text-white group-hover:text-black'>Change Cover</h2>
                        <div className='group-hover:opacity-40'>
                            <Image src={workspaceCoverImage} alt='' width={400} height={400} 
                                className='w-full h-[150px] object-cover rounded-t-xl'
                            />
                        </div>
                    </div>
                </div>
            </CoverPicker>

            {/* Input Section */}
            <div className='p-16'>
                <h2 className='font-medium text-xl'>Create a new workspace</h2>
                <h2 className='text-sm mt-2'> This is a shared screen where you can collaborate with your team. You can always change the name later.</h2>
                <div className='mt-8 flex gap-2 justify-center items-center'>
                    <Button variant={'outline'}>
                        <SmileIcon />
                    </Button>
                    <Input 
                        placeholder='Workspace Name..' 
                        value={workspaceName}
                        onChange={(e) => {setWorkspaceName(e.target.value)}}
                    />
                </div>
                <div className='mt-8 flex justify-end gap-2'>
                    <Button disabled={!workspaceName?.length || loading}
                        onClick={onCreateWorkspace}
                    >Create {loading && <Loader2Icon className='animate-spin ml-2'/>}</Button>
                    <Button variant={'outline'}>Cancel</Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateWorkspace