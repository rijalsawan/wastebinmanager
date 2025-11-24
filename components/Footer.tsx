import { Trash2, Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-[rgb(218,220,224)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[rgb(26,115,232)] rounded-lg">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-medium text-[rgb(32,33,36)]">WasteBin</span>
            </div>
            <p className="text-sm text-[rgb(95,99,104)]">
              Smart waste management system with real-time monitoring and analytics.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-medium text-[rgb(32,33,36)] mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-[rgb(95,99,104)]">
              <li>6 Waste Categories</li>
              <li>Real-time IoT Simulation</li>
              <li>Analytics Dashboard</li>
              <li>Request Management</li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-sm font-medium text-[rgb(32,33,36)] mb-3">Project</h3>
            <div className="flex items-center gap-2 text-sm text-[rgb(95,99,104)] mb-2">
              <Github className="w-4 h-4" />
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(26,115,232)] transition-colors">
                View on GitHub
              </a>
            </div>
            <div className="flex items-center gap-1 text-sm text-[rgb(95,99,104)]">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-[rgb(234,67,53)] fill-current" />
              <span>for a cleaner world</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[rgb(218,220,224)] text-center text-xs text-[rgb(95,99,104)]">
          © {new Date().getFullYear()} WasteBin Management System. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
