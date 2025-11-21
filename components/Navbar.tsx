"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { 
  LogOut, 
  ChevronDown, 
  Bell, 
  Search,
  LayoutDashboard,
  Trash2,
  FileText,
  BarChart3,
  MessageSquare,
  Shield,
  Settings
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Badge } from "./ui/Badge"

const navLinks = [
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/bins", label: "Bins", icon: Trash2 },
  { href: "/dashboard/requests", label: "Requests", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, adminOnly: true },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!session) return null

  const filteredLinks = navLinks.filter(link => 
    !link.adminOnly || session?.user?.role === "ADMIN"
  )

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                WasteBin
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-3xl mx-8">
              {filteredLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search - Hidden on mobile */}
              <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline">Search...</span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)} 
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
                    <Badge variant={session?.user?.role === "ADMIN" ? "purple" : "info"} size="sm">
                      {session?.user?.role}
                    </Badge>
                  </div>

                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </div>

                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${
                      userMenuOpen ? "rotate-180" : ""
                    }`} 
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-slide-in-bottom">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{session?.user?.email}</p>
                    </div>

                    <div className="py-2">
                      <button 
                        onClick={() => signOut({ callbackUrl: "/" })} 
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-20 bg-white border-b border-gray-200 shadow-xl animate-slide-down">
          <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {filteredLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
