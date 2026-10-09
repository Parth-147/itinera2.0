import { Link } from 'react-router-dom'

export default function Saved() {
  return (
    <main className="px-6 lg:px-8">
      <section className="mx-auto max-w-5xl py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 sm:text-sm">
          Collection
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Your saved destinations and plans
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">
          Save destinations, hotels, activities and complete trip plans so you never lose an idea. Your collection is coming soon.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          ← Back to Home
        </Link>
      </section>
    </main>
  )
}
