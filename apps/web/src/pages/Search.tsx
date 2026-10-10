import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

/* ── Inline SVG Icons ─────────────────────────────────────────────── */

function SearchIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function StarIcon({ className = 'size-4 text-amber-400' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>
  )
}

function MapPinIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}

function CalendarIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}

function ClockIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function BookmarkIcon({ filled = false, className = 'size-5' }: { filled?: boolean; className?: string }) {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clipRule="evenodd" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  )
}

function XMarkIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

function CheckIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function ArrowRightIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function SparklesIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0 3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}

/* ── Destination Data Model ───────────────────────────────────────── */

interface Destination {
  id: string
  name: string
  region: string
  continent: 'Europe' | 'Asia' | 'Americas' | 'Africa & Middle East' | 'Oceania'
  category: 'Cultural & Heritage' | 'Nature & Outdoors' | 'Coastal & Beach' | 'Culinary & Wine' | 'Alpine & Winter'
  rating: number
  reviewsCount: number
  budgetTier: '$' | '$$' | '$$$'
  budgetEst: string
  duration: string
  bestSeason: string
  description: string
  highlights: string[]
  insiderTip: string
  tags: string[]
  photo: string
  accentColor: string
  badgeColor: string
}

const DESTINATIONS: Destination[] = [
  {
    id: 'kyoto',
    name: 'Kyoto',
    region: 'Japan',
    continent: 'Asia',
    category: 'Cultural & Heritage',
    rating: 4.97,
    reviewsCount: 342,
    budgetTier: '$$',
    budgetEst: 'From $1,450 / trip',
    duration: '5–7 days',
    bestSeason: 'Mar – May, Oct – Nov',
    description: 'Ancient imperial capital steeped in zen gardens, historic wooden machiya, vibrant geisha districts, and thousand-torii shrines.',
    highlights: ['Fushimi Inari morning hike', 'Bamboo forest at Arashiyama', 'Gion evening walking tour', 'Zen meditation at Ryoan-ji'],
    insiderTip: 'Visit the Fushimi Inari shrine at dawn before 7:00 AM for an ethereal hike with virtually no crowds.',
    tags: ['#Temples', '#ZenGardens', '#CherryBlossoms', '#TeaCeremony'],
    photo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-rose-700',
    badgeColor: 'bg-white/90 text-rose-700',
  },
  {
    id: 'santorini',
    name: 'Santorini',
    region: 'Greece',
    continent: 'Europe',
    category: 'Coastal & Beach',
    rating: 4.93,
    reviewsCount: 288,
    budgetTier: '$$$',
    budgetEst: 'From $2,100 / trip',
    duration: '4–6 days',
    bestSeason: 'May – Oct',
    description: 'Iconic whitewashed cubic villages perched dramatically on high volcanic cliffs overlooking sapphire Aegean caldera waters.',
    highlights: ['Fira to Oia caldera trek', 'Sunset wine tasting in Pyrgos', 'Akrotiri bronze-age ruins', 'Red Beach catamaran cruise'],
    insiderTip: 'Book sunset dinner in Imerovigli rather than Oia for identical panoramic views with a calmer atmosphere.',
    tags: ['#CalderaViews', '#Sunsets', '#Cyclades', '#WineTasting'],
    photo: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-sky-700',
    badgeColor: 'bg-white/90 text-sky-700',
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    region: 'Morocco',
    continent: 'Africa & Middle East',
    category: 'Cultural & Heritage',
    rating: 4.88,
    reviewsCount: 215,
    budgetTier: '$',
    budgetEst: 'From $850 / trip',
    duration: '4–6 days',
    bestSeason: 'Mar – May, Sep – Nov',
    description: 'Labyrinthine medinas scented with orange blossoms and spices, ornate riads, artisan souks, and sweeping Atlas mountain vistas.',
    highlights: ['Jemaa el-Fnaa night food stalls', 'Jardin Majorelle & YSL Museum', 'Bahia Palace courtyards', 'Atlas foothills excursion'],
    insiderTip: 'Hire an official local guide on your first morning to effortlessly decode the winding alleys of the historic souks.',
    tags: ['#Medina', '#Riads', '#Souks', '#AtlasMountains'],
    photo: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-amber-700',
    badgeColor: 'bg-white/90 text-amber-700',
  },
  {
    id: 'reykjavik',
    name: 'Reykjavík & South Coast',
    region: 'Iceland',
    continent: 'Europe',
    category: 'Nature & Outdoors',
    rating: 4.95,
    reviewsCount: 394,
    budgetTier: '$$$',
    budgetEst: 'From $2,450 / trip',
    duration: '6–9 days',
    bestSeason: 'Jun – Aug (Summer) / Sep – Mar (Auroras)',
    description: 'Geothermal hot springs, thunderous glacial waterfalls, obsidian black sand beaches, and otherworldly northern lights.',
    highlights: ['Skógafoss & Seljalandsfoss falls', 'Reynisfjara black sand beach', 'Silfra tectonic fissure snorkel', 'Vatnajökull ice caving'],
    insiderTip: 'Rent a 4x4 camper or SUV for total freedom to chase clear skies when hunting the Aurora Borealis.',
    tags: ['#NorthernLights', '#Glaciers', '#Waterfalls', '#Geothermal'],
    photo: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-teal-700',
    badgeColor: 'bg-white/90 text-teal-700',
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    region: 'Italy',
    continent: 'Europe',
    category: 'Coastal & Beach',
    rating: 4.92,
    reviewsCount: 318,
    budgetTier: '$$$',
    budgetEst: 'From $2,600 / trip',
    duration: '5–8 days',
    bestSeason: 'May – Sep',
    description: 'Cascading pastel houses sculpted into vertiginous sea cliffs, fragrant lemon groves, and classic Italian dolce vita.',
    highlights: ['Path of the Gods hike', 'Private Capri boat excursion', 'Villa Cimbrone infinity terrace', 'Limoncello tasting in Amalfi'],
    insiderTip: 'Use passenger ferries instead of crowded coastal buses to enjoy effortless travel and unobstructed sea views.',
    tags: ['#CliffsideVillas', '#CapriGrottos', '#Limoncello', '#ScenicCoasts'],
    photo: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-violet-700',
    badgeColor: 'bg-white/90 text-violet-700',
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    region: 'New Zealand',
    continent: 'Oceania',
    category: 'Nature & Outdoors',
    rating: 4.96,
    reviewsCount: 250,
    budgetTier: '$$',
    budgetEst: 'From $1,850 / trip',
    duration: '7–10 days',
    bestSeason: 'Dec – Feb (Summer) / Jun – Aug (Ski)',
    description: 'Surrounded by the jagged Remarkables mountain range on the shores of Lake Wakatipu, known as the world adventure capital.',
    highlights: ['Milford Sound scenic flight & cruise', 'Ben Lomond alpine summit', 'Central Otago Pinot Noir trail', 'Shotover River jet boat'],
    insiderTip: 'Drive over the Crown Range to historic Arrowtown for gold mining history and boutique bakeries.',
    tags: ['#AlpineLakes', '#MilfordSound', '#Hiking', '#Adventure'],
    photo: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-emerald-700',
    badgeColor: 'bg-white/90 text-emerald-700',
  },
  {
    id: 'banff',
    name: 'Banff & Lake Louise',
    region: 'Canada',
    continent: 'Americas',
    category: 'Nature & Outdoors',
    rating: 4.94,
    reviewsCount: 326,
    budgetTier: '$$',
    budgetEst: 'From $1,750 / trip',
    duration: '6–8 days',
    bestSeason: 'Jun – Sep, Dec – Mar',
    description: 'Turquoise glacial lakes reflecting snow-capped peaks in the heart of the Canadian Rocky Mountains.',
    highlights: ['Moraine Lake sunrise canoe', 'Icefields Parkway scenic drive', 'Peyto Lake panoramic viewpoint', 'Banff Upper Hot Springs'],
    insiderTip: 'Reserve park shuttles for Moraine Lake months in advance as personal vehicle access is restricted.',
    tags: ['#Rockies', '#GlacialLakes', '#Wildlife', '#Canoeing'],
    photo: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-cyan-700',
    badgeColor: 'bg-white/90 text-cyan-700',
  },
  {
    id: 'oaxaca',
    name: 'Oaxaca de Juárez',
    region: 'Mexico',
    continent: 'Americas',
    category: 'Culinary & Wine',
    rating: 4.91,
    reviewsCount: 198,
    budgetTier: '$',
    budgetEst: 'From $780 / trip',
    duration: '5–7 days',
    bestSeason: 'Oct – Apr',
    description: 'The culinary soul of Mexico, renowned for complex moles, artisanal mezcal palenques, and indigenous Zapotec weaving.',
    highlights: ['Mercado 20 de Noviembre food hall', 'Monte Albán archaeological site', 'Artisanal mezcal distillery tour', 'Hierve el Agua mineral falls'],
    insiderTip: 'Visit the Tlacolula Sunday market for one of the oldest living indigenous trade markets in Mesoamerica.',
    tags: ['#Gastronomy', '#Mezcal', '#ZapotecRuins', '#Artisans'],
    photo: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-orange-700',
    badgeColor: 'bg-white/90 text-orange-700',
  },
  {
    id: 'zermatt',
    name: 'Zermatt & Matterhorn',
    region: 'Switzerland',
    continent: 'Europe',
    category: 'Alpine & Winter',
    rating: 4.98,
    reviewsCount: 412,
    budgetTier: '$$$',
    budgetEst: 'From $2,950 / trip',
    duration: '5–7 days',
    bestSeason: 'Dec – Apr (Ski) / Jul – Sep (Trek)',
    description: 'Car-free postcard alpine wonderland dominated by the unmistakable pyramid peak of the majestic Matterhorn.',
    highlights: ['Gornergrat cogwheel train', 'Matterhorn Glacier Paradise', 'Five Lakes reflective walk', 'Traditional alpine fondue chalet'],
    insiderTip: 'Take the first Gornergrat train at dawn for still waters and the famed mirror reflection of the Matterhorn in Lake Riffelsee.',
    tags: ['#Matterhorn', '#AlpineSkiing', '#GlacierExpress', '#SwissAlps'],
    photo: 'https://images.unsplash.com/photo-1605555648408-f3f63f15e6b2?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-blue-700',
    badgeColor: 'bg-white/90 text-blue-700',
  },
  {
    id: 'capetown',
    name: 'Cape Town & Peninsula',
    region: 'South Africa',
    continent: 'Africa & Middle East',
    category: 'Coastal & Beach',
    rating: 4.9,
    reviewsCount: 264,
    budgetTier: '$$',
    budgetEst: 'From $1,350 / trip',
    duration: '7–10 days',
    bestSeason: 'Nov – Mar',
    description: 'Dramatic confluence of Atlantic waters, Table Mountain amphitheater, African penguin colonies, and rolling coastal vineyards.',
    highlights: ['Table Mountain aerial cableway', 'Boulders Beach penguin boardwalk', 'Chapman’s Peak cliffside drive', 'Cape Point nature reserve'],
    insiderTip: 'Hike Lions Head for late afternoon sunset over Camps Bay and the Twelve Apostles peaks.',
    tags: ['#TableMountain', '#Penguins', '#CoastalVistas', '#WineValleys'],
    photo: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-teal-700',
    badgeColor: 'bg-white/90 text-teal-700',
  },
  {
    id: 'chiangmai',
    name: 'Chiang Mai',
    region: 'Thailand',
    continent: 'Asia',
    category: 'Cultural & Heritage',
    rating: 4.89,
    reviewsCount: 278,
    budgetTier: '$',
    budgetEst: 'From $650 / trip',
    duration: '5–7 days',
    bestSeason: 'Nov – Feb',
    description: 'Misty northern mountain sanctuary dotted with centuries-old teak temples, night walking markets, and ethical sanctuaries.',
    highlights: ['Wat Phra That Doi Suthep at sunset', 'Ethical Elephant Nature Park', 'Sunday Walking Street crafts', 'Khao Soi tasting trail'],
    insiderTip: 'Doi Suthep temple chants in early evening create a deeply peaceful, spiritual atmosphere devoid of tour buses.',
    tags: ['#LannaTemples', '#NightMarkets', '#StreetFood', '#MistyMountains'],
    photo: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-lime-700',
    badgeColor: 'bg-white/90 text-lime-700',
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux & Saint-Émilion',
    region: 'France',
    continent: 'Europe',
    category: 'Culinary & Wine',
    rating: 4.91,
    reviewsCount: 184,
    budgetTier: '$$',
    budgetEst: 'From $1,650 / trip',
    duration: '5–7 days',
    bestSeason: 'May – Oct',
    description: 'World capital of fine viticulture surrounded by 18th-century neoclassical architecture, quiet riverfronts, and historic châteaux.',
    highlights: ['Saint-Émilion underground monolith church', 'Cité du Vin immersive museum', 'Place de la Bourse water mirror', 'Arcachon Bay fresh oysters'],
    insiderTip: 'Rent an e-bike in Saint-Émilion to glide between Grand Cru estates across the vineyard trails.',
    tags: ['#GrandCru', '#Chateaux', '#FrenchCuisine', '#Architecture'],
    photo: 'https://images.unsplash.com/photo-1502309282829-4be2dda4eb85?w=800&h=500&fit=crop&auto=format&q=80',
    accentColor: 'text-purple-700',
    badgeColor: 'bg-white/90 text-purple-700',
  },
]

const CONTINENTS = ['All', 'Europe', 'Asia', 'Americas', 'Africa & Middle East', 'Oceania'] as const
const CATEGORIES = [
  'All',
  'Cultural & Heritage',
  'Nature & Outdoors',
  'Coastal & Beach',
  'Culinary & Wine',
  'Alpine & Winter',
] as const

const BUDGETS = ['All', '$', '$$', '$$$'] as const
const SORT_OPTIONS = [
  { id: 'rating', label: 'Highest Rated' },
  { id: 'popular', label: 'Most Reviewed' },
  { id: 'alphabetical', label: 'Destination (A-Z)' },
] as const

/* ── Main Component ───────────────────────────────────────────────── */

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Query and continent are driven directly by URL search parameters
  const query = searchParams.get('q') ?? ''
  const rawRegion = searchParams.get('region') ?? 'All'
  const selectedContinent = CONTINENTS.includes(rawRegion as (typeof CONTINENTS)[number]) ? rawRegion : 'All'

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedBudget, setSelectedBudget] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('rating')

  // Saved items state (in-memory, persisted in user session)
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(['kyoto', 'santorini']))

  // Destination Details Modal state
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null)

  // Sync state back to URL when query or continent changes
  const handleQueryChange = (val: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (val.trim()) {
      nextParams.set('q', val)
    } else {
      nextParams.delete('q')
    }
    setSearchParams(nextParams, { replace: true })
  }

  const handleContinentSelect = (cont: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (cont !== 'All') {
      nextParams.set('region', cont)
    } else {
      nextParams.delete('region')
    }
    setSearchParams(nextParams, { replace: true })
  }

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Filter & sort logic
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((item) => {
      // Search text match
      if (query.trim()) {
        const q = query.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(q)
        const matchesRegion = item.region.toLowerCase().includes(q)
        const matchesDesc = item.description.toLowerCase().includes(q)
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q))
        const matchesHighlights = item.highlights.some((h) => h.toLowerCase().includes(q))
        if (!matchesName && !matchesRegion && !matchesDesc && !matchesTags && !matchesHighlights) {
          return false
        }
      }

      // Continent match
      if (selectedContinent !== 'All' && item.continent !== selectedContinent) {
        return false
      }

      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false
      }

      // Budget match
      if (selectedBudget !== 'All' && item.budgetTier !== selectedBudget) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount
      if (sortBy === 'alphabetical') return a.name.localeCompare(b.name)
      return 0
    })
  }, [query, selectedContinent, selectedCategory, selectedBudget, sortBy])

  const hasActiveFilters =
    Boolean(query.trim()) ||
    selectedContinent !== 'All' ||
    selectedCategory !== 'All' ||
    selectedBudget !== 'All'

  const resetFilters = () => {
    setSelectedCategory('All')
    setSelectedBudget('All')
    setSortBy('rating')
    setSearchParams({}, { replace: true })
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <section className="border-b border-slate-200/70 bg-gradient-to-b from-[#eef8f5]/40 to-white px-6 pt-10 pb-12 sm:px-8 sm:pt-14 sm:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1F4D45] sm:text-sm">
                Explore & Discover
              </p>
              <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight text-gray-900 font-display">
                Discover Curated Destinations
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                Curated global destinations, seasonal highlights, and hand-picked experiences designed for memorable journeys.
              </p>
            </div>

            {/* Saved indicator counter */}
            <div className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs">
              <BookmarkIcon filled={true} className="size-4 text-[#1F4D45]" />
              <span>{savedIds.size} saved to collection</span>
            </div>
          </div>

          {/* ── Search Input Bar ──────────────────────────────────────── */}
          <div className="mt-8">
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <SearchIcon className="size-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search by city, country, interest (e.g. temples, waterfalls, wine)..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-12 pl-12 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-[#1F4D45] focus:ring-4 focus:ring-[#1F4D45]/10 sm:text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleQueryChange('')}
                  aria-label="Clear search text"
                  className="absolute right-3.5 flex size-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <XMarkIcon className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── Region Pills ─────────────────────────────────────────── */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Region:
            </span>
            {CONTINENTS.map((cont) => {
              const active = selectedContinent === cont
              return (
                <button
                  key={cont}
                  type="button"
                  onClick={() => handleContinentSelect(cont)}
                  className={[
                    'rounded-xl px-3 py-1.5 font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'bg-[#1F4D45] text-white shadow-sm'
                      : 'border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {cont}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Filter & Sort Bar ───────────────────────────────────────── */}
      <section className="sticky top-16 sm:top-[70px] z-20 border-b border-slate-200/80 bg-white/95 px-6 py-3.5 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs sm:text-sm">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={[
                    'rounded-lg px-2.5 py-1 font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'bg-emerald-50 text-[#1F4D45] font-bold ring-1 ring-emerald-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  ].join(' ')}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Budget & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Budget */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400">Budget:</span>
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                {BUDGETS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedBudget(tier)}
                    className={[
                      'rounded px-2 py-0.5 font-medium transition',
                      selectedBudget === tier
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900',
                    ].join(' ')}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <label htmlFor="search-sort" className="sr-only">Sort by</label>
              <select
                id="search-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white py-1 pr-7 pl-2.5 text-xs font-medium text-slate-700 outline-none transition focus:border-[#1F4D45] focus:ring-1 focus:ring-[#1F4D45]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results Container ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-8 sm:px-8 sm:pt-10">
        {/* Results Header Status */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredDestinations.length}</span> destinations
            {hasActiveFilters && ' matching your criteria'}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#1F4D45] transition hover:text-[#2A6559]"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* ── Empty State ───────────────────────────────────────────── */}
        {filteredDestinations.length === 0 ? (
          <div className="my-16 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#1F4D45]">
              <SearchIcon className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">No destinations match your search</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              We couldn't find matches for <span className="font-semibold text-slate-700">"{query}"</span> with the selected filters.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl bg-[#1F4D45] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#2A6559]"
              >
                Clear all filters
              </button>
              <button
                type="button"
                onClick={() => handleQueryChange('Kyoto')}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Try "Kyoto"
              </button>
              <button
                type="button"
                onClick={() => handleQueryChange('Santorini')}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Try "Santorini"
              </button>
            </div>
          </div>
        ) : (
          /* ── Destinations Grid ───────────────────────────────────── */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((item) => {
              const isSaved = savedIds.has(item.id)

              return (
                <article
                  key={item.id}
                  onClick={() => setActiveDestination(item)}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300"
                >
                  {/* Photo Header with real travel photography */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200">
                    <img
                      src={item.photo}
                      alt={`${item.name} travel destination`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Dark overlay for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>

                    {/* Bookmark Save button */}
                    <button
                      type="button"
                      onClick={(e) => toggleSave(item.id, e)}
                      aria-label={isSaved ? `Remove ${item.name} from saved` : `Save ${item.name}`}
                      className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur-sm transition hover:scale-110 hover:bg-white active:scale-95"
                    >
                      <BookmarkIcon filled={isSaved} className={`size-4 ${isSaved ? 'text-[#1F4D45]' : 'text-slate-600'}`} />
                    </button>

                    {/* Rating badge bottom right */}
                    <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-900 shadow-xs backdrop-blur-sm">
                      <StarIcon className="size-3.5 text-amber-500" />
                      <span>{item.rating.toFixed(2)}</span>
                      <span className="text-[11px] font-normal text-slate-500">({item.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-bold tracking-tight text-slate-950 group-hover:text-[#1F4D45] transition-colors">
                          {item.name}
                        </h2>
                        <p className="flex items-center gap-1 text-xs font-medium text-slate-500 mt-0.5">
                          <MapPinIcon className="size-3.5 text-slate-400" />
                          <span>{item.region}</span>
                          <span className="text-slate-300">·</span>
                          <span>{item.continent}</span>
                        </p>
                      </div>

                      {/* Budget Tag */}
                      <span className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-700">
                        {item.budgetTier}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {item.description}
                    </p>

                    {/* Metadata specs */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="size-3.5 text-slate-400" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="size-3.5 text-slate-400" />
                        <span>{item.bestSeason}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-[#1F4D45] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        View details
                        <ArrowRightIcon className="size-3.5" />
                      </span>

                      <Link
                        to={`/create?destination=${encodeURIComponent(item.name)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg bg-[#1F4D45] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2A6559] active:scale-95 shadow-xs"
                      >
                        Plan trip
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Destination Details Modal / Drawer ────────────────────────── */}
      {activeDestination && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            onClick={() => setActiveDestination(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {/* Photo Header */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-800 sm:h-52">
              <img
                src={activeDestination.photo}
                alt={`${activeDestination.name} travel destination`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              <button
                type="button"
                onClick={() => setActiveDestination(null)}
                aria-label="Close details"
                className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-slate-950"
              >
                <XMarkIcon className="size-5" />
              </button>

              <div className="absolute bottom-4 left-6">
                <span className="inline-flex items-center rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
                  {activeDestination.category}
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl drop-shadow-md">
                  {activeDestination.name}
                </h3>
                <p className="text-xs font-medium text-white/80">
                  {activeDestination.region} · {activeDestination.continent}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Rating</span>
                  <div className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-900">
                    <StarIcon className="size-4 text-amber-500" />
                    <span>{activeDestination.rating.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Estimated Cost</span>
                  <p className="mt-1 text-sm font-bold text-slate-900">{activeDestination.budgetEst}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Recommended Pace</span>
                  <p className="mt-1 text-sm font-bold text-slate-900">{activeDestination.duration}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Best Season</span>
                  <p className="mt-1 text-sm font-bold text-slate-900">{activeDestination.bestSeason}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Overview
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {activeDestination.description}
                </p>
              </div>

              {/* Top Curated Highlights */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Signature Experiences
                </h4>
                <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {activeDestination.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#1F4D45]">
                        <CheckIcon className="size-3" />
                      </div>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Insider Tip Callout */}
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <SparklesIcon className="size-4 text-[#1F4D45]" />
                  <span>ITINERA Insider Tip</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-emerald-900/80">
                  {activeDestination.insiderTip}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => toggleSave(activeDestination.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  <BookmarkIcon
                    filled={savedIds.has(activeDestination.id)}
                    className={`size-4 ${savedIds.has(activeDestination.id) ? 'text-[#1F4D45]' : 'text-slate-600'}`}
                  />
                  <span>
                    {savedIds.has(activeDestination.id) ? 'Saved in Collection' : 'Save Destination'}
                  </span>
                </button>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveDestination(null)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                  >
                    Close
                  </button>
                  <Link
                    to={`/create?destination=${encodeURIComponent(activeDestination.name)}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4D45] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#2A6559] active:scale-[0.98] sm:w-auto"
                  >
                    <span>Start Itinerary</span>
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

