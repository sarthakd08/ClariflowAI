"use client"

import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import List from "@editorjs/list";
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import Paragraph from '@editorjs/paragraph';
import { BlockTool } from '@editorjs/editorjs';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import { Doc } from '@/app/_shared/sharedTypes';
import GenerateAITemplate from './GenerateAITemplate';
import { Room } from '@/app/Room';
import { Button } from '@/components/ui/button';
import { CommentBox } from './CommentBox';
import { MessageCircle, X } from 'lucide-react';

type Props = {
    documentInfo: Doc
};

const DocumentEditor = ({documentInfo}: Props) => {
  const ref = useRef<EditorJS | null>(null);
  const docDetailsRef = useRef<Doc | null>(null);
  const { user } = useUser();
  const [isFetched, setIsFetched] = useState(false) // Flag to track if Current Document data has been fetched once on load
  const [openComment, setOpenComment] = useState<boolean>(false)

  useEffect(() => {
    initEditor();
    return () => {
      if (ref.current) {
        ref.current.destroy();
        ref.current = null;
      }
    };
  }, []);

useEffect(() => {
    docDetailsRef.current = documentInfo;
    if(docDetailsRef.current) {
        getDocumentDetails()
    }
  }, [documentInfo, user, isFetched]);


    const getDocumentDetails = async () => {
        if(docDetailsRef.current && docDetailsRef.current.id) {
            const currentDocDetails = docDetailsRef.current;
            const firebaseDocRef = doc(db, 'DocumentOutput', currentDocDetails.id)
            const docSnap = await getDoc(firebaseDocRef)

            console.log('### current Doc Detailsss output', docSnap.data());
            if(docSnap.data()?.editedBy !== user?.primaryEmailAddress?.emailAddress || !isFetched) {
                console.log('#### Inside ');
                if(docSnap.data()?.editedBy) {
                    try {
                        ref.current?.render(JSON.parse(docSnap.data()?.output));
                    } catch (error) {
                        console.error('Error parsing document output:', error);
                    }
                }
                setIsFetched(true);
            }
            
        }
    }

/**
   * Used to save Document
   */
const saveDocument = () => {
    if (!ref.current) {
      console.error("Editor instance is not initialized.");
      return;
    }
  
    const currentDocDetails = docDetailsRef.current;
    if (!currentDocDetails || !currentDocDetails.id) {
      console.error("Document ID is missing.");
      return;
    }
  
    ref.current.save().then(async (outputData) => {
      try {
        console.log(`### saving for doc ${currentDocDetails.id} now`, outputData);
        
        const docRef = doc(db, 'DocumentOutput', currentDocDetails.id);

  
        await updateDoc(docRef, {
          output: JSON.stringify(outputData),
          editedBy: user?.primaryEmailAddress?.emailAddress || 'Unknown User',
        });
  
        console.log('Document updated with outputData:', outputData);
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }).catch((error) => {
      console.error('Error saving editor data:', error);
    });
  };


  const initEditor = () => {
    if (!ref.current) {
      ref.current = new EditorJS({
        holder: 'editorjs',
        onChange: (api, event) => {
            console.log('Content changed:', event, 'Document Info:', docDetailsRef.current);
        
            if (!docDetailsRef.current?.id) {
                console.warn("Document ID is missing. Save skipped.");
                return;
            }
        
            saveDocument();
        },
        onReady: () => {
          console.log('Editor is ready');
          getDocumentDetails();
        },
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph: Paragraph,
          table: Table,
          list: {
            class: List as unknown as EditorJS.ToolConstructable, // Adjusted casting to ToolConstructable
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
            config: {
              defaultStyle: 'unordered',
            },
            conversionConfig: {
              import: 'text',
              export: 'text',
            },
          },
        //   checklist: Checklist, // Declared in .d.ts file
          code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+P',
          },
        },
      });
    }
  };
  
  const setTheAIGeneratedOutput = (output: any) => {
    if(output) {
      ref.current?.render(output);
    }
  }

  return (
    <div>
      <div id="editorjs"></div>

      <div className='fixed bottom-10 md:ml-80 right-4 md:right-10 z-10'>
          <GenerateAITemplate setTheAIGeneratedOutput={setTheAIGeneratedOutput}/>
      </div>
      {/* <div className='fixed right-10 bottom-24 z-50'>
          <Room>
              <Button className='cursor-pointer' onClick={() => setOpenComment(!openComment)}>{openComment ? <X /> :<MessageCircle />}</Button>
              {openComment && <CommentBox />}
          </Room>
      </div> */}
    </div>
  );
};

export default DocumentEditor;
