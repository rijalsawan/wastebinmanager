import { Trash2, Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">WasteBin</span>
            </div>
            <p className="text-sm text-gray-600">
              Smart waste management system with real-time monitoring and analytics.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>6 Waste Categories</li>
              <li>Real-time IoT Simulation</li>
              <li>Analytics Dashboard</li>
              <li>Request Management</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Built With</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Next.js 16 & TypeScript</li>
              <li>PostgreSQL & Prisma 5</li>
              <li>TailwindCSS v4</li>
              <li>NextAuth v5</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 WasteBin. Built for educational purposes.
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using Next.js
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
