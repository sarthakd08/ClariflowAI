"use client"
import React, { useState, useEffect } from 'react'
import DocumentHeader from './DocumentHeader'
import DocumentInfo from './DocumentInfo'
import { usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import DocumentEditor from './DocumentEditor';

type Props = {
    params: any
}

const DocumentEditorSection = ({params}: Props) => {
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    const [documentInfo, setDocumentInfo] = useState<any>({})
useEffect(() => {
    if(id) {
        getDocumentInfo(id)
    }
}, [id]);

const getDocumentInfo = async (docId: string) => {
    if(docId) {
        const docRef = doc(db, 'workspaceDocuments', docId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            console.log('%%% docSnap', docSnap.data());
            setDocumentInfo(docSnap.data())
        }
    }
}

  return (
    <div>
        {/* Header */}
        <DocumentHeader />

        
        {documentInfo && (
            <>
                <DocumentInfo documentInfo={documentInfo} />
                <div className='p-4 lg:-ml-40 md:p-0'>
                    <DocumentEditor documentInfo={documentInfo} />
                </div>
            </>
        )}
    </div>
  )
}

export default DocumentEditorSection