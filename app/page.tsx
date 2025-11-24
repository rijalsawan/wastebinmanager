import Link from "next/link"
import { Trash2, BarChart3, Bell, Shield, Zap, Users, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-[rgb(218,220,224)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[rgb(26,115,232)] rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-medium text-[rgb(32,33,36)]">WasteBin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-[rgb(95,99,104)] hover:text-[rgb(32,33,36)] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-[rgb(26,115,232)] text-white text-sm font-medium rounded-lg hover:bg-[rgb(24,90,188)] transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-medium text-[rgb(32,33,36)] mb-6 tracking-tight">
              Smart waste management for a 
              <span className="text-[rgb(26,115,232)]"> cleaner future</span>
            </h1>

            <p className="text-xl text-[rgb(95,99,104)] mb-10 leading-relaxed">
              Intelligent monitoring, real-time analytics, and automated collection optimization for modern cities and organizations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/auth/login"
                className="px-8 py-3 bg-[rgb(26,115,232)] text-white rounded-lg font-medium hover:bg-[rgb(24,90,188)] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-3 bg-white text-[rgb(26,115,232)] rounded-lg font-medium hover:bg-[rgb(248,250,253)] transition-all border border-[rgb(218,220,224)]"
              >
                Learn More
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="inline-block text-left bg-[rgb(248,250,253)] rounded-xl border border-[rgb(218,220,224)] p-6">
              <p className="text-xs font-bold text-[rgb(95,99,104)] uppercase tracking-wider mb-4">Demo Access</p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-medium text-[rgb(32,33,36)] mb-1">Admin Account</p>
                  <code className="text-xs text-[rgb(95,99,104)] bg-white px-2 py-1 rounded border border-[rgb(218,220,224)] block mb-1">admin@waste.com</code>
                  <code className="text-xs text-[rgb(95,99,104)] bg-white px-2 py-1 rounded border border-[rgb(218,220,224)] block">admin123</code>
                </div>
                <div>
                  <p className="text-sm font-medium text-[rgb(32,33,36)] mb-1">User Account</p>
                  <code className="text-xs text-[rgb(95,99,104)] bg-white px-2 py-1 rounded border border-[rgb(218,220,224)] block mb-1">user@waste.com</code>
                  <code className="text-xs text-[rgb(95,99,104)] bg-white px-2 py-1 rounded border border-[rgb(218,220,224)] block">user123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-[rgb(248,250,253)] border-t border-[rgb(218,220,224)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-[rgb(32,33,36)] mb-4">
              Powerful capabilities
            </h2>
            <p className="text-[rgb(95,99,104)] max-w-2xl mx-auto">
              Everything you need to manage waste collection efficiently and sustainably.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
              icon: Trash2,
              title: "Smart Categorization",
              desc: "Manage 6 distinct waste categories including Plastic, E-Waste, and Organic with specialized tracking.",
              color: "text-[rgb(26,115,232)]",
              bg: "bg-[rgb(232,240,254)]"
            },
            {
              icon: Zap,
              title: "IoT Simulation",
              desc: "Advanced real-time sensor simulation with realistic fill patterns and automated emptying triggers.",
              color: "text-[rgb(251,188,4)]",
              bg: "bg-[rgb(254,247,224)]"
            },
            {
              icon: BarChart3,
              title: "Analytics Dashboard",
              desc: "Comprehensive insights into collection trends, peak hours, and category distribution.",
              color: "text-[rgb(52,168,83)]",
              bg: "bg-[rgb(230,244,234)]"
            },
            {
              icon: Bell,
              title: "Smart Alerts",
              desc: "Instant notifications for critical fill levels and collection requirements.",
              color: "text-[rgb(234,67,53)]",
              bg: "bg-[rgb(252,232,230)]"
            },
            {
              icon: Users,
              title: "Role Management",
              desc: "Secure access control for administrators and standard users with specific permissions.",
              color: "text-[rgb(161,66,244)]",
              bg: "bg-[rgb(243,232,253)]"
            },
            {
              icon: Shield,
              title: "Secure Platform",
              desc: "Enterprise-grade security ensuring your data and operations remain protected.",
              color: "text-[rgb(70,189,198)]",
              bg: "bg-[rgb(224,247,250)]"
            }].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-[rgb(218,220,224)] hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-medium text-[rgb(32,33,36)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[rgb(95,99,104)] text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[rgb(218,220,224)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[rgb(95,99,104)] rounded-md flex items-center justify-center">
              <Trash2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-medium text-[rgb(95,99,104)]">WasteBin</span>
          </div>
          <p className="text-sm text-[rgb(95,99,104)]">
            © 2024 WasteBin Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
