"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import uuid4 from "uuid4";
import { db } from "@/config/firebaseConfig";
import { collection, orderBy, query, where, doc, setDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Logo from "@/app/_components/Logo";
import CreateDocDialogue from "./CreateDocDialogue";
import { Bell, File } from "lucide-react";
import DocumentOptions from "./DocumentOptions";

type Props = {
  params?: { value?: string };
};

type Doc = {
  coverImage?: string;
  createdBy: string;
  documentName: string;
  documentOutput: any[];
  emoji?: string;
  id: string;
  workspaceId: number | string;
};

const SideNav = ({ params }: Props) => {
  const router = useRouter();
  const { user } = useUser();

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [documentList, setDocumentList] = useState<Doc[]>([]);

  // Parse params when available
//   useEffect(() => {
//     console.log('#### params', params);
    
//     if (params?.value) {
//       try {
//         const parsedParams = JSON.parse(params.value);
//         setWorkspaceId(parsedParams.workspaceId);
//         setDocumentId(parsedParams.documentId);
//       } catch (error) {
//         console.error("Failed to parse params.value:", error);
//       }
//     }
//   }, [params]);
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
      router.replace(`/workspace/${workspaceId}/${clickedDocId}`);
    }
  };

  const onCreateNewDocument = async (docName: string) => {
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
      router.replace(`/workspace/${workspaceId}/${docId}`);
    }
  };

  return (
    <div className="h-screen md:w-72 fixed bg-primary p-6 shadow-md">
      <div className="flex justify-between mb-6">
        <Logo />
        <Bell className="h-5 w-5 mt-2" />
      </div>
      <hr className="mx-2" />
      <div className="flex justify-between mt-4">
        <h2 className="font-semibold text-gray-100 mt-1">Workspace Name</h2>
        <CreateDocDialogue onCreateDocument={onCreateNewDocument}>
          <Button size="sm" variant="secondary">
            +
          </Button>
        </CreateDocDialogue>
      </div>
      <div className="mt-5">
        {documentList.length ? (
          documentList.map((doc) => (
            <div
              key={doc.id}
              className={`flex justify-between gap-2 mb-2 p-2 text-white hover:text-black cursor-pointer 
                ${documentId === doc.id ? "bg-white text-black rounded-lg" : ""}
              `}
              onClick={() => onDocumentClick(doc.id)}
            >
                <div className="flex justify-start gap-2">
                    <File />
                    <h2>{doc.documentName}</h2>
                </div>
                <DocumentOptions />
            </div>
          ))
        ) : (
          <div>
            <h3 className="mt-10 p-2 text-white">No Documents yet!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNav;
