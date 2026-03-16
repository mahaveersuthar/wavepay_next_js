"use client";

import React, { useState, useRef, ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";

// --- Type Definitions for Props ---
export interface DropdownOption {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  colorClass?: string; // e.g., 'text-red-500' for danger actions
}

interface DropdownMenuProps {
  options: DropdownOption[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use the hook to close the menu when clicking outside
  useOutsideClick(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* The button that triggers the dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* The dropdown panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg
                               bg-popover ring-1 ring-border z-10"
        >
          <ul className="py-1" role="menu">
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      option.onClick();
                      setIsOpen(false); // Close menu after action
                    }}
                    className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors
                                                    text-popover-foreground hover:bg-muted cursor-pointer ${option.colorClass || ""
                      }`}
                    role="menuitem"
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    <span>{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
