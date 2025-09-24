"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import { Doc } from '@/app/_shared/sharedTypes';
import GenerateAITemplate from './GenerateAITemplate';
import { useMutation, useStorage } from '@liveblocks/react/suspense';
import { LiveObject } from '@liveblocks/client';

// Dynamically import EditorJS to avoid SSR issues
const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false });

type Props = {
    documentInfo: Doc
};

const CollaborativeDocumentEditor = ({documentInfo}: Props) => {
  const ref = useRef<any>(null);
  const docDetailsRef = useRef<Doc | null>(null);
  const { user } = useUser();
  const [isFetched, setIsFetched] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const firebaseSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedToFirebaseRef = useRef<string>('');
  const isApplyingRemoteChangesRef = useRef(false);
  const lastChangeTimeRef = useRef<number>(0);
  const isUserActivelyTypingRef = useRef(false);

  // Liveblocks storage for real-time collaboration
  const documentContent = useStorage((root) => root.documentContent);
  
  const updateDocumentContent = useMutation(({ storage }, newContent) => {
    if (!isApplyingRemoteChangesRef.current) {
      storage.set('documentContent', new LiveObject(newContent));
    }
  }, []);

  useEffect(() => {
    initEditor();
    return () => {
      if (ref.current) {
        ref.current.destroy();
        ref.current = null;
      }
      if (firebaseSaveTimeoutRef.current) {
        clearTimeout(firebaseSaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    docDetailsRef.current = documentInfo;
    if(docDetailsRef.current && isEditorReady && !isFetched) {
        loadInitialContent();
    }
  }, [documentInfo, isEditorReady, isFetched]);

  // Handle real-time changes from other users - but only when user is not actively typing
  useEffect(() => {
    if (documentContent && isEditorReady && ref.current && !isApplyingRemoteChangesRef.current) {
      const now = Date.now();
      const timeSinceLastChange = now - lastChangeTimeRef.current;
      
      // Only apply remote changes if:
      // 1. User hasn't made changes recently (3+ seconds)
      // 2. User is not actively typing
      if (timeSinceLastChange > 3000 && !isUserActivelyTypingRef.current) {
        applyRemoteChanges(documentContent);
      } else {
        console.log('Skipping remote changes - user is actively editing');
      }
    }
  }, [documentContent, isEditorReady]);

  const loadInitialContent = async () => {
    if(docDetailsRef.current && docDetailsRef.current.id) {
        const currentDocDetails = docDetailsRef.current;
        const firebaseDocRef = doc(db, 'DocumentOutput', currentDocDetails.id);
        const docSnap = await getDoc(firebaseDocRef);

        console.log('Loading initial document content');
        if(docSnap.exists() && docSnap.data()?.output) {
            try {
                const parsedOutput = JSON.parse(docSnap.data()?.output);
                
                // Load content without triggering onChange
                isApplyingRemoteChangesRef.current = true;
                await ref.current?.render(parsedOutput);
                
                // Also set in Liveblocks if not already there
                if (!documentContent) {
                  updateDocumentContent(parsedOutput);
                }
                
                isApplyingRemoteChangesRef.current = false;
                lastSavedToFirebaseRef.current = JSON.stringify(parsedOutput);
            } catch (error) {
                console.error('Error parsing document output:', error);
            }
        }
        setIsFetched(true);
    }
  };

  const applyRemoteChanges = async (remoteContent: any) => {
    if (!ref.current || isApplyingRemoteChangesRef.current) return;

    try {
      // Get current content
      const currentData = await ref.current.save();
      const currentDataString = JSON.stringify(currentData);
      const remoteDataString = JSON.stringify(remoteContent);

      // Only apply if content is different
      if (currentDataString !== remoteDataString) {
        console.log('Applying remote changes when user is not actively typing');
        
        isApplyingRemoteChangesRef.current = true;
        
        // Apply the changes
        await ref.current.render(remoteContent);
        
        // Update our reference
        lastSavedToFirebaseRef.current = remoteDataString;
        
        isApplyingRemoteChangesRef.current = false;
      }
    } catch (error) {
      console.error('Error applying remote changes:', error);
      isApplyingRemoteChangesRef.current = false;
    }
  };

  const saveToFirebase = useCallback(async (content: any) => {
    const currentDocDetails = docDetailsRef.current;
    if (!currentDocDetails || !currentDocDetails.id) return;

    try {
      const contentString = JSON.stringify(content);
      
      // Only save to Firebase if content changed
      if (contentString !== lastSavedToFirebaseRef.current) {
        const docRef = doc(db, 'DocumentOutput', currentDocDetails.id);
        await updateDoc(docRef, {
          output: contentString,
          editedBy: user?.primaryEmailAddress?.emailAddress || 'Unknown User',
        });
        
        lastSavedToFirebaseRef.current = contentString;
        console.log('Document saved to Firebase');
      }
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }, [user]);

  const debouncedFirebaseSave = useCallback((content: any) => {
    if (firebaseSaveTimeoutRef.current) {
      clearTimeout(firebaseSaveTimeoutRef.current);
    }

    firebaseSaveTimeoutRef.current = setTimeout(() => {
      saveToFirebase(content);
    }, 3000); // Save to Firebase every 3 seconds of inactivity
  }, [saveToFirebase]);

  const handleContentChange = useCallback(async () => {
    if (!ref.current || isApplyingRemoteChangesRef.current) return;

    try {
      // Mark user as actively typing
      isUserActivelyTypingRef.current = true;
      lastChangeTimeRef.current = Date.now();
      
      // Clear the typing flag after 2 seconds of inactivity
      setTimeout(() => {
        isUserActivelyTypingRef.current = false;
      }, 2000);
      
      const outputData = await ref.current.save();
      
      // Immediately update Liveblocks for real-time sync
      updateDocumentContent(outputData);
      
      // Debounce Firebase save for persistence
      debouncedFirebaseSave(outputData);
      
    } catch (error) {
      console.error('Error handling content change:', error);
    }
  }, [updateDocumentContent, debouncedFirebaseSave]);

  const initEditor = async () => {
    if (!ref.current && typeof window !== 'undefined') {
      try {
        const EditorJSClass = (await import('@editorjs/editorjs')).default;
        const HeaderTool = (await import('@editorjs/header')).default;
        const DelimiterTool = (await import('@editorjs/delimiter')).default;
        const ListTool = (await import('@editorjs/list')).default;
        const TableTool = (await import('@editorjs/table')).default;
        const CodeToolImport = (await import('@editorjs/code')).default;
        const ParagraphTool = (await import('@editorjs/paragraph')).default;
        
        ref.current = new EditorJSClass({
          holder: 'editorjs',
          onChange: () => {
            // Use a small delay to batch rapid changes
            setTimeout(handleContentChange, 100);
          },
          onReady: () => {
            console.log('Editor is ready');
            setIsEditorReady(true);
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
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    }
  };
  
  const setTheAIGeneratedOutput = async (output: any) => {
    if(output && ref.current) {
      isApplyingRemoteChangesRef.current = true;
      await ref.current.render(output);
      isApplyingRemoteChangesRef.current = false;
      
      // Update both Liveblocks and Firebase
      updateDocumentContent(output);
      saveToFirebase(output);
    }
  };

  return (
    <div>
      <div id="editorjs"></div>

      <div className='fixed bottom-10 md:ml-80 right-4 md:right-10 z-10'>
          <GenerateAITemplate setTheAIGeneratedOutput={setTheAIGeneratedOutput}/>
      </div>
    </div>
  );
};

export default CollaborativeDocumentEditor;
