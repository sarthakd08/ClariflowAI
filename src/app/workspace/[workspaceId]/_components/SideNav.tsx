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
import { Doc } from '@/app/_shared/sharedTypes'


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
  useEffect( () => {
      let unsubscribe: any;
    if (workspaceId) {
        console.log('##### workspaceId useeffect', workspaceId);
        setDocumentList([]);
        v();
    }

    async function v () {
        const q = query(
            collection(db, "workspaceDocuments"),
            where("workspaceId", "==", workspaceId?.toString()),
            orderBy("createdAt", "desc")
        );
        console.log('##### query', q);
        // setDocumentList([]);
        const querySnapshot = await getDocs(q);
            
        querySnapshot.forEach((doc) => {
            console.log('##### doc.data', doc.data());
            setDocumentList((prev: any) => [...prev, doc.data()])
            // setDocumentList(docs);
        });
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
    await deleteDoc(doc(db, "workspaceDocuments", docObj.id));
    toast(`Doc ${docObj.documentName} deleted from workspace` )
  }

//   if(!isNavOpen) return null
  return (
    <div className="h-screen md:w-72 fixed bg-secondary shadow-md">
      <div className="flex justify-between p-4 gap-2 md:mb-6 md:p-6">
        <Link href={'/dashboard'}><Logo/></Link>
        <Bell className="h-5 w-5 mt-2" />
      </div>
      <div  className={`absolute right-4 w-6 h-6 md:hidden bg-gray-200 rounded-full shadow`} onClick={toggleNav}>
        <X  />
      </div>
      <hr className="mx-2" />

      {/* Workspace Name and create */}

      <div className="flex justify-between mt-8 mb-8 px-6 md:mt-6">
        <h2 className="font-semibold text-primary mt-1 text-sm md:text-lg">{workspaceName}</h2>
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
              className={`flex justify-between gap-2 mb-2 p-2 text-white text-sm hover:text-black cursor-pointer font-mono font-semibold
                ${documentId === doc.id ? " bg-white rounded-lg" : ""}
              `}
              onClick={() => onDocumentClick(doc.id)}
            >
                <div className="flex justify-start gap-2 text-sm">
                    <File className={` text-primary`} /> 
                    <h2 className={`text-primary`}>{doc.documentName}</h2>
                </div>
                <DocumentOptions docDetails={doc} deleteDocument={onDeleteDocument}/>
            </div>
          ))
        ) : (
          <div className="text-center">
            <h3 className="mt-10 lg:p-3 text-primary">Start creating pretty documents!</h3>
          </div>
        )}
      </div>


      {/* Progress Bar  */}

      <div className='absolute bottom-10  bg-white px-6 py-4 mx-4 rounded-lg'>
        <Progress className=" text-yellow-200" value={(documentList?.length/MAX_FILE)*100} />
        <h2 className='text-sm font-light my-2'><strong>{documentList?.length}</strong> Out of <strong>5</strong> files used</h2>
        <h2 className='text-sm font-light '>Upgrade your plan for unlimted access</h2>
       
        </div>
    </div>
  );
};

export default SideNav;
