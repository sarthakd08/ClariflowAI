"use client";
import React, { useState } from "react";
import SideNav from "../_components/SideNav";
import DocumentEditorSection from "../_components/DocumentEditorSection";
import { Menu, X } from "lucide-react";
import { Room } from "@/app/Room";

type Props = {
  params: any;
};

const WorkspaceDocumentDetails = ({ params }: Props) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
      <div className="relative flex">
        {/* Mobile Toggle Button */}
        <button
          onClick={toggleNav}
          className={`absolute top-4 left-4 z-50 md:hidden p-2 bg-gray-200 rounded-full shadow ${isNavOpen && 'hidden'}`}
          aria-label="Toggle navigation"
        >
          {isNavOpen ? '' : <Menu className="w-6 h-6" />}
        </button>

        {/* Side Navigation (Always Fixed on Mobile and Laptop) */}
        <div
          className={`fixed inset-y-0 left-0 bg-white shadow-lg transform transition-transform duration-300 z-40 w-52  md:translate-x-0 md:block md:w-72 md:fixed ${
            isNavOpen ? "block" : "hidden"} top-0 bottom-0 h-screen`}
        >
          <div className="h-full overflow-y-auto">
            <SideNav params={params} isNavOpen={isNavOpen} toggleNav={toggleNav} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto md:ml-72">
          <DocumentEditorSection params={params} />
        </div>
      </div>
  );
};

export default WorkspaceDocumentDetails;
