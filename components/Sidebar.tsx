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
      icon: BarChart3, 
      roles: ["user", "admin"] 
    },
    { 
      name: "Requests", 
      href: "/dashboard/requests", 
      icon: MessageSquare, 
      roles: ["user", "admin"] 
    },
    { 
      name: "Users", 
      href: "/dashboard/users", 
      icon: Users, 
      roles: ["admin"] 
    },
  ]

  const userRole = session?.user?.role?.toLowerCase() || "user"

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-white border-r border-[rgb(218,220,224)] transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[rgb(218,220,224)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[rgb(26,115,232)] rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-lg text-[rgb(32,33,36)]">WasteBin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-full hover:bg-[rgb(241,243,244)] text-[rgb(95,99,104)] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          if (!item.roles.includes(userRole)) return null
          
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-r-full text-sm font-medium transition-colors relative",
                isActive 
                  ? "bg-[rgb(232,240,254)] text-[rgb(26,115,232)]" 
                  : "text-[rgb(60,64,67)] hover:bg-[rgb(241,243,244)]"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-[rgb(26,115,232)]" : "text-[rgb(95,99,104)]")} />
              {!collapsed && <span>{item.name}</span>}
              {item.badge && !collapsed && (
                <span className="ml-auto bg-[rgb(217,48,37)] text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[rgb(218,220,224)]">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-[rgb(26,115,232)] text-white flex items-center justify-center text-sm font-medium">
            {session?.user?.name?.[0] || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-[rgb(32,33,36)] truncate">{session?.user?.name}</p>
              <p className="text-xs text-[rgb(95,99,104)] truncate">{session?.user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
