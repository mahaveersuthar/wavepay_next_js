"use client";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { MoreVertical } from "lucide-react";

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

export interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  className?: string;
  icon?: React.ReactNode;
  show?: (item: T) => boolean; // Add this line
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  isLoading?: boolean;
  shimmerCount?: number;
  actions?: Action<T>[];
  onActionClick?: (action: Action<T>, item: T) => void;
}

const getAlignClass = (align?: "left" | "center" | "right") => {
  switch (align) {
    case "center": return "text-center";
    case "right": return "text-right";
    default: return "text-left";
  }
};

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  className = "",
  isLoading = false,
  shimmerCount = 5,
  actions = [],
  onActionClick,
}: DataTableProps<T>) {
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handlePointerDownOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!containerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDownOutside);
    return () => document.removeEventListener("mousedown", handlePointerDownOutside);
  }, []);

  const handleActionClick = (e: React.MouseEvent, action: Action<T>, item: T) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setMenuPosition(null);
    if (onActionClick) onActionClick(action, item);
    else action.onClick(item);
  };

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>, itemId: string | number) => {
    e.stopPropagation();
    if (openMenuId === itemId) {
      setOpenMenuId(null);
      setMenuPosition(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 8, left: rect.right - 160 });
    setOpenMenuId(itemId);
  };

  const displayColumns = actions.length > 0 
    ? [...columns, {
        header: "Actions",
        key: "actions",
        align: "right" as const,
        render: (item: T) => {
          // FILTER ACTIONS HERE based on the show() property
          const visibleActions = actions.filter(action => !action.show || action.show(item));
          
          if (visibleActions.length === 0) return null;

          return (
            <div className="relative flex justify-end">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => handleMenuToggle(e, item.id)}
              >
                <MoreVertical size={18} />
              </button>

              {openMenuId === item.id && menuPosition && typeof window !== "undefined" &&
                createPortal(
                  <div
                    ref={menuRef}
                    className="fixed w-40 rounded-xl border bg-white shadow-lg dark:bg-gray-900 dark:border-gray-700 z-[9999] overflow-hidden"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                  >
                    {visibleActions.map((action, index) => (
                      <button
                        type="button"
                        key={index}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 ${action.className || 'text-gray-700 dark:text-white'}`}
                        onClick={(e) => handleActionClick(e, action, item)}
                      >
                        {action.icon}
                        {action.label}
                      </button>
                    ))}
                  </div>,
                  document.body
                )
              }
            </div>
          );
        }
      }] 
    : columns;

  return (
    <div ref={containerRef} className={`max-w-full overflow-x-auto ${className}`}>
      <Table className="min-w-full">
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>
            {displayColumns.map((col, index) => (
              <TableCell key={index} isHeader className={`px-6 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${getAlignClass(col.align)}`}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading ? 
            Array.from({ length: shimmerCount }).map((_, r) => (
              <TableRow key={r}>
                {displayColumns.map((_, c) => (
                  <TableCell key={c} className="px-6 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                ))}
              </TableRow>
            )) : 
            data.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                {displayColumns.map((col, index) => (
                  <TableCell key={index} className={`px-6 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90 ${getAlignClass(col.align)}`}>
                    {col.render ? col.render(item) : (item[col.key as keyof T] as any)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}