"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard,
  Trash2,
  FileText,
  MessageSquare,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Bell,
  Users,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  href: string
  icon: any
  roles: string[]
  badge?: string
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  const navigation: NavItem[] = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: LayoutDashboard, 
      roles: ["user", "admin"] 
    },
    { 
      name: "Bins", 
      href: "/dashboard/bins", 
      icon: Trash2, 
      roles: ["user", "admin"] 
    },
    { 
      name: "Reports", 
      href: "/dashboard/reports", 
      icon: FileText, 
      roles: ["user", "admin"] 
    },
    { 
      name: "Analytics", 
      href: "/dashboard/analytics", 
      icon: BarChart3, 
      roles: ["user", "admin"] 
    },
    { 
      name: "Requests", 
      href: "/dashboard/requests", 
      icon: MessageSquare, 
      roles: ["user", "admin"],
      badge: "New"
    },
    { 
      name: "Admin Panel", 
      href: "/dashboard/admin", 
      icon: Shield, 
      roles: ["admin"] 
    },
    { 
      name: "Settings", 
      href: "/dashboard/settings", 
      icon: Settings, 
      roles: ["user", "admin"] 
    },
  ]

  const filteredNav = navigation.filter((item) =>
    item.roles.includes(session?.user?.role as string)
  )

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo & Collapse Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  WasteBin
                </h1>
                <p className="text-xs text-gray-500">Smart System</p>
              </div>
            </Link>
          )}
          
          {collapsed && (
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative overflow-hidden",
                  active
                    ? "bg-linear-to-r from-blue-50 to-purple-50 text-blue-600 shadow-md"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                )}
              >
                {active && (
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                )}
                
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all relative z-10",
                    active ? "text-blue-600 scale-110" : "text-gray-400 group-hover:text-blue-600 group-hover:scale-110",
                    collapsed && "mx-auto"
                  )}
                />
                
                {!collapsed && (
                  <>
                    <span className="flex-1 relative z-10">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {active && (
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        {!collapsed && session?.user && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="m-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 flex items-center justify-center group"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          )}
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <nav className="flex items-center justify-around p-2">
          {filteredNav.slice(0, 5).map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 relative",
                  active ? "text-blue-600" : "text-gray-600"
                )}
              >
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all",
                      active && "scale-110"
                    )}
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
