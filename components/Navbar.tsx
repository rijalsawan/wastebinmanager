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
      <nav className="sticky top-0 z-30 bg-white border-b border-[rgb(218,220,224)]">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-[rgb(26,115,232)] rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium text-[rgb(32,33,36)] hidden sm:block">
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
                      flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm
                      ${isActive 
                        ? "bg-[rgb(232,240,254)] text-[rgb(26,115,232)]" 
                        : "text-[rgb(95,99,104)] hover:bg-[rgb(241,243,244)] hover:text-[rgb(32,33,36)]"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search - Hidden on mobile */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(95,99,104)]" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-[rgb(241,243,244)] text-[rgb(60,64,67)] placeholder-[rgb(95,99,104)] pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-[rgb(26,115,232)]/20 focus:bg-white transition-all w-64 text-sm"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-[rgb(241,243,244)] rounded-full transition-colors">
                <Bell className="w-5 h-5 text-[rgb(95,99,104)]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[rgb(217,48,37)] rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)} 
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-[rgb(241,243,244)] transition-all duration-200 border border-transparent hover:border-[rgb(218,220,224)]"
                >
                  <div className="w-8 h-8 bg-[rgb(26,115,232)] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-[rgb(218,220,224)] py-2 z-50 animate-scale-in origin-top-right">
                    <div className="px-4 py-3 border-b border-[rgb(218,220,224)] flex items-center gap-3">
                      <div className="w-10 h-10 bg-[rgb(26,115,232)] rounded-full flex items-center justify-center text-white text-lg font-medium">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-[rgb(32,33,36)] truncate">{session?.user?.name}</p>
                        <p className="text-xs text-[rgb(95,99,104)] truncate">{session?.user?.email}</p>
                      </div>
                    </div>

                    <div className="py-2">
                      <button 
                        onClick={() => signOut({ callbackUrl: "/" })} 
                        className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(241,243,244)] flex items-center gap-3 text-[rgb(60,64,67)]"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                    
                    <div className="px-4 py-2 text-xs text-[rgb(95,99,104)] text-center border-t border-[rgb(218,220,224)] mt-1">
                      <a href="#" className="hover:underline">Privacy Policy</a> • <a href="#" className="hover:underline">Terms of Service</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-[rgb(241,243,244)] rounded-full transition-colors text-[rgb(95,99,104)]"
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
        <div className="lg:hidden fixed inset-0 top-16 z-20 bg-white border-b border-[rgb(218,220,224)] shadow-lg animate-slide-down">
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
                    flex items-center gap-3 px-4 py-3 rounded-r-full font-medium transition-all duration-200 text-sm
                    ${isActive 
                      ? "bg-[rgb(232,240,254)] text-[rgb(26,115,232)]" 
                      : "text-[rgb(60,64,67)] hover:bg-[rgb(241,243,244)]"
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
