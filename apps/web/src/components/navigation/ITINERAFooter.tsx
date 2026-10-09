import { Link } from 'react-router-dom'

export default function ITINERAFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-base font-bold tracking-[0.22em] text-slate-950 transition hover:text-indigo-600"
            >
              ITINERA
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Intelligent travel planning crafted for modern explorers. Discover curated destinations, personalized recommendations, and budget-aware itineraries in one unified platform.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="flex size-2 rounded-full bg-emerald-500" />
              <span>Platform active & ready</span>
            </div>
          </div>

          {/* Navigation Links: Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/search" className="transition hover:text-indigo-600">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link to="/create" className="transition hover:text-indigo-600">
                  Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/saved" className="transition hover:text-indigo-600">
                  Saved Collections
                </Link>
              </li>
              <li>
                <Link to="/inbox" className="transition hover:text-indigo-600">
                  Trip Messaging
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links: Discover */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Discover
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/search?region=Europe" className="transition hover:text-indigo-600">
                  European Escapes
                </Link>
              </li>
              <li>
                <Link to="/search?region=Asia" className="transition hover:text-indigo-600">
                  Asia Cultural Tours
                </Link>
              </li>
              <li>
                <Link to="/search?q=Alpine" className="transition hover:text-indigo-600">
                  Alpine & Ski
                </Link>
              </li>
              <li>
                <Link to="/search?q=Gastronomy" className="transition hover:text-indigo-600">
                  Culinary Trails
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links: Company & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#about" className="transition hover:text-indigo-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="#privacy" className="transition hover:text-indigo-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="transition hover:text-indigo-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#contact" className="transition hover:text-indigo-600">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} ITINERA Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="text-slate-500">Designed for seamless, memorable journeys.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
