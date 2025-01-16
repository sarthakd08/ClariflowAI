import Header from "./Header";
import WorkspaceArea from "./WorkspaceArea";

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-secondary shadow-md z-10">
          <Header />
        </div>
      
        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Background gradients */}
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20 pointer-events-none"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
          </div>

          {/* Workspace Content */}
          <div className="relative z-20">
            <WorkspaceArea />
          </div>
        </div>
      </div>
    </>
  );
}
