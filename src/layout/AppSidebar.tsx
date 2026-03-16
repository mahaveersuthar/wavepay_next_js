"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon,
  ChevronDownIcon,
  UserCircleIcon,
  HorizontaLDots,
  BoxCubeIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  visibleTo?: "admin" | "user" | "both";
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
    visibleTo: "both",
  },
  {
    icon: <PieChartIcon />,
    name: "User Management",
    path: "/user-management",
    visibleTo: "admin",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Fund Request",
    path: "/funds",
    visibleTo: "both",
  },
  {
    icon: <ListIcon />,
    name: "Transactions",
    path: "/transactions",
    visibleTo: "both",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
    visibleTo: "both",
  },
  {
    icon: <PlugInIcon />,
    name: "Developer Settings",
    visibleTo: "admin",
    subItems: [
      { name: "API Document", path: "/developer/api-document" },
      { name: "Credentials", path: "/developer/credentials" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  // --- Hydration Fix States ---
  const [mounted, setMounted] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Set mounted to true on client-side to allow cookie-based rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev?.index === index && prev?.type === menuType
        ? null
        : { type: menuType, index }
    );
  };

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  // --- Role Based Logic ---
  const normalizedRole = Cookies.get("pinepeRole");

  const canViewItem = (visibleTo: NavItem["visibleTo"] = "both") => {
    if (visibleTo === "both") return true;
    return visibleTo === normalizedRole;
  };

  // On the server (mounted=false), we only render items visible to "both" 
  // to ensure the initial HTML is consistent.
  const visibleNavItems = mounted
    ? navItems.filter((item) => canViewItem(item.visibleTo))
    : navItems.filter((item) => item.visibleTo === "both");

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const isPathActive = nav.path ? isActive(nav.path) : false;
        const isChildActive =
          nav.subItems?.some((sub) => isActive(sub.path)) || false;
        const isHeaderActive = isPathActive || isChildActive;
        const isSubmenuOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;

        return (
          <li key={nav.name} className="relative">
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${
                    isSubmenuOpen || isChildActive
                      ? "bg-gray-100 dark:bg-white/5 text-brand-600 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
              >
                {isChildActive && (
                  <div className="absolute left-0 w-1 h-5 bg-brand-600 dark:bg-brand-500 rounded-r-full" />
                )}

                <span
                  className={`${
                    isHeaderActive
                      ? "text-brand-600 dark:text-brand-400"
                      : "group-hover:text-gray-900 dark:group-hover:text-white"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="text-sm font-medium flex-1 text-left">
                      {nav.name}
                    </span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isSubmenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isPathActive
                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                >
                  {isPathActive && (
                    <div className="absolute left-0 w-1 h-5 bg-brand-600 dark:bg-brand-500 rounded-r-full" />
                  )}

                  <span
                    className={`${
                      isPathActive
                        ? "text-brand-600 dark:text-brand-400"
                        : "group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="text-sm font-medium">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* Submenu Dropdown */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    isSubmenuOpen || isChildActive
                      ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                      : "0px",
                }}
              >
                <ul className="mt-1 ml-9 flex flex-col gap-1 border-l border-gray-100 dark:border-gray-800">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.path}
                        className={`block py-2 px-3 text-xs font-medium rounded-md transition-colors
                          ${
                            isActive(sub.path)
                              ? "text-brand-600 dark:text-brand-400"
                              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                          }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col
        ${isExpanded || isHovered || isMobileOpen ? "w-72" : "w-20"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div
        className={`h-20 flex items-center px-6 transition-all ${
          !isExpanded && !isHovered ? "justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          <Image
            src="/images/logo/wavepay-logo.png"
            alt="payoutapi"
            width={isExpanded || isHovered || isMobileOpen ? 140 : 42}
            height={42}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar">
        <header
          className={`mb-4 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ${
            !isExpanded && !isHovered ? "text-center" : ""
          }`}
        >
          {isExpanded || isHovered || isMobileOpen ? (
            "Main Menu"
          ) : (
            <HorizontaLDots className="mx-auto" />
          )}
        </header>

        <nav>
          {/* Only rendering the menu items when mounted ensures 
             the client-side role check matches the view.
          */}
          {renderMenuItems(visibleNavItems, "main")}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;