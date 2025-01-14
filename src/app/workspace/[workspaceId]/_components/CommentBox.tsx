
"use client";

import { useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";

export function CommentBox() {
  const { threads } = useThreads();

  return (
    <div className="w-72 h-96 shadow-lg rounded-lg overflow-auto">
      {threads.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
      <Composer />
    </div>
  );
}