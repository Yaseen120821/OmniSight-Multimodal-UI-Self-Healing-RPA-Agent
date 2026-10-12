"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, Play, RefreshCw } from "lucide-react";
import NotificationPanel from "@/components/ui/NotificationPanel";

interface HeaderProps {
  onToggleMobileMenu: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onRunGlobalTest?: () => void;
  isTestRunning?: boolean;
}

export default function Header({
  onToggleMobileMenu,
  searchQuery = "",
  onSearchChange,
  onRunGlobalTest,
  isTestRunning = false,
}: HeaderProps) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getPageInfo = () => {
    switch (pathname) {
      case "/users":
        return {
          title: "Team & Users",
          subtitle: "Manage platform access and RPA automation roles",
        };
      case "/projects":
        return {
          title: "Projects & Test Targets",
          subtitle: "Registered web applications under self-healing coverage",
        };
      case "/reports":
        return {
          title: "Reports & Analytics",
          subtitle: "Visual regression logs and execution pass rate trends",
        };
      case "/settings":
        return {
          title: "Platform Settings",
          subtitle: "Configure vision AI thresholds, Playwright runner, and webhooks",
        };
      default:
        return {
          title: "SaaS Admin Dashboard",
          subtitle: "Multimodal UI self-healing agent overview & test suite execution",
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Mobile Toggle & Page Headings */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            data-testid="mobile-menu-button"
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                OmniSight
              </span>
              <span className="text-slate-300">/</span>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Right Section: Controls, Search, Run Test, Notifications & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 justify-end">
          {/* Global Search Bar */}
          <div className="relative max-w-xs w-full sm:w-64">
            <label htmlFor="global-header-search" className="sr-only">
              Search projects or target URLs
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="global-header-search"
              type="text"
              data-testid="project-search"
              placeholder="Search projects or URLs..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Run Test Button in Header */}
          {onRunGlobalTest && (
            <button
              onClick={onRunGlobalTest}
              disabled={isTestRunning}
              data-testid="run-test-button"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              aria-label="Run Test Suite"
            >
              {isTestRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Test</span>
                </>
              )}
            </button>
          )}

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              data-testid="notification-button"
              aria-label="Notifications"
              aria-expanded={notifOpen}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* User Avatar with Profile Dropdown */}
          <div className="relative pl-2 border-l border-slate-200">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg p-1 hover:bg-slate-50 transition-colors"
              aria-label="User Profile Menu"
              aria-expanded={userMenuOpen}
            >
              <div
                className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 shadow-2xs"
                title="Logged in as Admin (Alex Rivera)"
              >
                AR
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">Alex Rivera</p>
                <p className="text-[10px] text-slate-500 font-medium">Lead QA Engineer</p>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">Alex Rivera</p>
                  <p className="text-[11px] text-slate-500 truncate">alex.rivera@omnisight.dev</p>
                </div>
                <div className="py-1">
                  <a href="/users" className="block px-3 py-1.5 text-slate-700 hover:bg-slate-50">
                    Team Members
                  </a>
                  <a href="/settings" className="block px-3 py-1.5 text-slate-700 hover:bg-slate-50">
                    Account Settings
                  </a>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    Close Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
