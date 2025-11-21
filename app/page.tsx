import Link from "next/link"
import { Trash2, BarChart3, Bell, Shield, Zap, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg">
                <Trash2 className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Smart Waste
              <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {" "}Management
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Real-time monitoring, IoT simulation, and intelligent analytics for modern waste management systems.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-blue-200"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-100">
              <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
                <div className="text-left">
                  <p className="font-semibold text-blue-700">Admin</p>
                  <p>admin@waste.com</p>
                  <p>admin123</p>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-blue-700">User</p>
                  <p>user@waste.com</p>
                  <p>user123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              6 Waste Categories
            </h3>
            <p className="text-gray-600">
              Manage Plastic, Paper, Metal, Organic, Glass, and E-Waste with dedicated tracking.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              IoT Simulation
            </h3>
            <p className="text-gray-600">
              Real-time sensor simulation with realistic fill patterns and auto-emptying.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600">
              Interactive charts and real-time statistics for data-driven decisions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Smart Requests
            </h3>
            <p className="text-gray-600">
              Submit and track manual pickups, maintenance, and hazardous waste alerts.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Secure & Scalable
            </h3>
            <p className="text-gray-600">
              Role-based access control with NextAuth v5 and PostgreSQL database.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Multi-Role System
            </h3>
            <p className="text-gray-600">
              Admin controls for simulation and management, user access for monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-linear-to-br from-blue-600 to-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Next.js 16 • TypeScript • PostgreSQL • Prisma 5 • TailwindCSS v4
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-blue-500 rounded-lg">NextAuth v5</span>
            <span className="px-4 py-2 bg-blue-500 rounded-lg">Recharts</span>
            <span className="px-4 py-2 bg-blue-500 rounded-lg">Zod Validation</span>
            <span className="px-4 py-2 bg-blue-500 rounded-lg">Server Components</span>
            <span className="px-4 py-2 bg-blue-500 rounded-lg">Lucide Icons</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="text-sm">
            © 2025 WasteBin. Built for educational purposes with ❤️
          </p>
        </div>
      </footer>
    </div>
  )
}
