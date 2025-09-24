"use client"

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import EditorJS to avoid SSR issues
const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false });
// Dynamically import EditorJS tools to avoid SSR issues
const Header = dynamic(() => import('@editorjs/header'), { ssr: false });
const Delimiter = dynamic(() => import('@editorjs/delimiter'), { ssr: false });
const List = dynamic(() => import('@editorjs/list'), { ssr: false });
const Checklist = dynamic(() => import('@editorjs/checklist'), { ssr: false });
const Table = dynamic(() => import('@editorjs/table'), { ssr: false });
const CodeTool = dynamic(() => import('@editorjs/code'), { ssr: false });
const Paragraph = dynamic(() => import('@editorjs/paragraph'), { ssr: false });
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


  const initEditor = async () => {
    if (!ref.current && typeof window !== 'undefined') {
      // Ensure we're in the browser environment
      const EditorJSClass = (await import('@editorjs/editorjs')).default;
      const HeaderTool = (await import('@editorjs/header')).default;
      const DelimiterTool = (await import('@editorjs/delimiter')).default;
      const ListTool = (await import('@editorjs/list')).default;
      const TableTool = (await import('@editorjs/table')).default;
      const CodeToolImport = (await import('@editorjs/code')).default;
      const ParagraphTool = (await import('@editorjs/paragraph')).default;
      
      ref.current = new EditorJSClass({
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
          header: HeaderTool,
          delimiter: DelimiterTool,
          paragraph: ParagraphTool,
          table: TableTool,
          list: {
            class: ListTool,
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
          code: {
            class: CodeToolImport,
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
