"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import uuid4 from "uuid4";
import { db } from "@/config/firebaseConfig";
import { collection, orderBy, query, where, doc, setDoc, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Logo from "@/app/_components/Logo";
import CreateDocDialogue from "./CreateDocDialogue";
import { Bell, File, Plus, X } from "lucide-react";
import DocumentOptions from "./DocumentOptions";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { Doc } from '@/app/_shared/sharedTypes';
import { ThemeToggle } from '@/components/theme-toggle'


type Props = {
  params?: { [value:string]: any };
  isNavOpen?: boolean
  toggleNav?: () => void
};


// const MAX_FILE=process.env.NEXT_PUBLIC_MAX_FILE_COUNT;
const MAX_FILE=5;

const SideNav = ({ params, isNavOpen, toggleNav }: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const workspaceName = searchParams.get('workspaceName');
  console.log('#### params workspaceName',workspaceName); // "someValue"

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [documentList, setDocumentList] = useState<Doc[]>([]);


useEffect(() => {
    (async () => {
      try {
        const resolvedParams = await Promise.resolve(params); // Force resolution
        console.log("#### Resolved params", resolvedParams);
  
        if (resolvedParams?.workspaceId) setWorkspaceId(resolvedParams?.workspaceId);
        if (resolvedParams?.documentId) setDocumentId(resolvedParams?.documentId);
      } catch (error) {
        console.error("Failed to resolve params:", error);
      }
    })();
  }, [params]);

  // Fetch documents when workspaceId changes
  useEffect(() => {
    if (workspaceId) {
        console.log('##### workspaceId useeffect', workspaceId);
        setDocumentList([]);
        fetchDocuments();
    }

    async function fetchDocuments() {
        try {
            const q = query(
                collection(db, "workspaceDocuments"),
                where("workspaceId", "==", workspaceId?.toString()),
                orderBy("createdAt", "desc")
            );
            console.log('##### query', q);
            const querySnapshot = await getDocs(q);
            
            const docs: Doc[] = [];
            querySnapshot.forEach((doc) => {
                console.log('##### doc.data', doc.data());
                docs.push(doc.data() as Doc);
            });
            setDocumentList(docs);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

  }, [workspaceId]);

  const onDocumentClick = (clickedDocId: string) => {
    if (workspaceId && clickedDocId) {
      router.replace(`/workspace/${workspaceId}/${clickedDocId}?workspaceName=${workspaceName}`);
    }
  };

  const onCreateNewDocument = async (docName: string) => {
    if(documentList?.length>=MAX_FILE) {
        console.log('Max file exceeded');
        toast("Upgrade plan to create more",{
            description: "You reach max file, Please upgrade for unlimited file creation",
            action: {
              label: "Upgrade",
              onClick: () => console.log("Undo"),
            },
          })
        return;
        }
    if (workspaceId && docName) {
      const docId = uuid4();
      const newDoc = {
        workspaceId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        coverImage: null,
        emoji: null,
        id: docId,
        documentName: docName,
        documentOutput: [],
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, "workspaceDocuments", docId), newDoc);
      await setDoc(doc(db, "DocumentOutput", docId), { docId, output: [] });

      setDocumentList((prevList: any) => [...prevList, newDoc]);
      router.replace(`/workspace/${workspaceId}/${docId}?workspaceName=${workspaceName}`);
    }
  };

  const onDeleteDocument = async (docObj: Doc) => {
    try {
      await deleteDoc(doc(db, "workspaceDocuments", docObj.id));
      await deleteDoc(doc(db, "DocumentOutput", docObj.id));
      
      // Remove from local state
      setDocumentList(prev => prev.filter(doc => doc.id !== docObj.id));
      
      toast(`Doc ${docObj.documentName} deleted from workspace`);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast(`Error deleting ${docObj.documentName}`);
    }
  }

//   if(!isNavOpen) return null
  return (
    <div className="h-screen md:w-72 fixed bg-secondary dark:bg-gray-900 shadow-md dark:shadow-gray-700">
      <div className="flex justify-between p-4 gap-2 md:mb-6 md:p-6">
        <Link href={'/dashboard'}><Logo size="sm" variant="background" /></Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
      <div  className={`absolute right-4 w-6 h-6 md:hidden bg-gray-200 dark:bg-gray-700 rounded-full shadow`} onClick={toggleNav}>
        <X className="text-gray-600 dark:text-gray-300" />
      </div>
      <hr className="mx-2 border-gray-300 dark:border-gray-600" />

      {/* Workspace Name and create */}

      <div className="flex justify-between mt-8 mb-8 px-6 md:mt-6">
        <h2 className="font-semibold text-primary dark:text-orange-400 mt-1 text-sm md:text-lg">{workspaceName}</h2>
        <CreateDocDialogue onCreateDocument={onCreateNewDocument}>
          <Button size="sm" variant={'default'}>
            <Plus className="w-4 h-4"/>
          </Button>
        </CreateDocDialogue>
      </div>

      {/*  Documents List  */}

      <div className="mt-5 px-2 md:px-6">
        {documentList.length ? (
          documentList.map((doc) => (
            <div
              key={doc.id}
              className={`flex justify-between gap-2 mb-2 p-2 text-gray-700 dark:text-gray-300 text-sm hover:text-black dark:hover:text-white cursor-pointer font-mono font-semibold transition-colors
                ${documentId === doc.id ? " bg-white dark:bg-gray-700 rounded-lg shadow-sm" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
              `}
              onClick={() => onDocumentClick(doc.id)}
            >
                <div className="flex justify-start gap-2 text-sm">
                    <File className={`text-primary dark:text-orange-400`} /> 
                    <h2 className={`text-primary dark:text-orange-400`}>{doc.documentName}</h2>
                </div>
                <DocumentOptions docDetails={doc} deleteDocument={onDeleteDocument}/>
            </div>
          ))
        ) : (
          <div className="text-center">
            <h3 className="mt-10 lg:p-3 text-primary dark:text-orange-400">Start creating pretty documents!</h3>
          </div>
        )}
      </div>


      {/* Progress Bar  */}

      <div className='absolute bottom-10 bg-white dark:bg-gray-800 px-6 py-4 mx-4 rounded-lg shadow-lg dark:shadow-gray-900'>
        <Progress className=" text-yellow-200" value={(documentList?.length/MAX_FILE)*100} />
        <h2 className='text-sm font-light my-2 text-gray-700 dark:text-gray-300'><strong>{documentList?.length}</strong> Out of <strong>5</strong> files used</h2>
        <h2 className='text-sm font-light text-gray-600 dark:text-gray-400'>Upgrade your plan for unlimited access</h2>
       
        </div>
    </div>
  );
};

export default SideNav;
