import { Link } from 'react-router-dom'
import { Compass, Sparkles, Mountain, ShieldCheck, Heart } from 'lucide-react'

export default function ITINERAFooter() {
  return (
    <footer className="border-t border-gray-200/80 bg-white text-gray-600">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-[#1F4D45] text-white flex items-center justify-center">
                <Compass className="size-4 text-amber-300" />
              </div>
              <span className="text-base font-black tracking-[0.18em] text-gray-950">
                ITINERA
              </span>
            </Link>
            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-gray-500">
              AI-powered travel planning, curated world treks, and real-time weather adaptability. Built for explorers who value both inspiration and reliability.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-200/60">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry & Gemini Models Active</span>
            </div>
          </div>

          {/* Navigation Links: Discovery */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Discover
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/search" className="transition hover:text-[#1F4D45]">
                  Top Destinations
                </Link>
              </li>
              <li>
                <Link to="/#treks" className="transition hover:text-[#1F4D45]">
                  World’s Greatest Treks
                </Link>
              </li>
              <li>
                <Link to="/create" className="transition hover:text-[#1F4D45]">
                  AI Dynamic Architect
                </Link>
              </li>
              <li>
                <Link to="/saved" className="transition hover:text-[#1F4D45]">
                  Curated Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links: Platform */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Operations & Tools
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/operator" className="transition hover:text-[#1F4D45]">
                  Operator Mission Control
                </Link>
              </li>
              <li>
                <Link to="/inbox" className="transition hover:text-[#1F4D45]">
                  Live Fleet Bulletins
                </Link>
              </li>
              <li>
                <Link to="/profile" className="transition hover:text-[#1F4D45]">
                  Traveler DNA Matrix
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="transition hover:text-[#1F4D45]">
                  How DAG Routing Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links: Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              ITINERA
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <span className="text-gray-400">About Our Engine</span>
              </li>
              <li>
                <span className="text-gray-400">Digital Twin Weather</span>
              </li>
              <li>
                <span className="text-gray-400">Verified Partner Stays</span>
              </li>
              <li>
                <span className="text-gray-400">Privacy & Terms</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-8 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} ITINERA Travel Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-gray-500">
            <span>Crafted for curious travelers worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
