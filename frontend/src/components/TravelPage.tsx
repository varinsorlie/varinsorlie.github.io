import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { getTravelTips } from "../data/api.js"
import { getLists } from "../data/api.js"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

// ── Types ──────────────────────────────────────────────────────
interface Destination {
  city: string
  country: string
  region: string
  coordinates?: { lat: number; lng: number }
}

interface TripInfo {
  bestTimeToVisit?: string
  durationDays?: { min: number; max: number }
  budget?: "budget" | "medium" | "luxury"
  currency?: string
  visaRequired?: boolean
}

interface TipItem {
  id: string
  tip: string
  category: string
  essential: boolean
  note?: string
}

// ── New overview types ─────────────────────────────────────────
interface AppItem {
  id: string
  name: string
  description: string
  platform: string[]
  free: boolean
}

interface PlaceItem {
  id: string
  name: string
  area: string
  tip: string
  priceRange: string
  mustVisit: boolean
  cuisine?: string  // restaurants only
  type?: string     // shopping + activities only
}

interface Overview {
  apps?: AppItem[]
  cafes?: PlaceItem[]
  restaurants?: PlaceItem[]
  shopping?: PlaceItem[]
  activities?: PlaceItem[]
}

interface TravelTip {
  _id: string
  slug: string
  title: string
  subtitle?: string
  emoji: string
  color: string
  image: string
  story?: string
  closingNote?: string
  destination?: Destination
  tripInfo?: TripInfo
  items: TipItem[]
  categories?: string[]
  overview?: Overview
  meta?: {
    featured?: boolean
    tags?: string[]
    publishedAt?: string
  }
}

// ── Helpers ────────────────────────────────────────────────────
const BUDGET_LABEL: Record<string, string> = {
  budget: "💸 Budget",
  medium: "💳 Mid-range",
  luxury: "💎 Luxury",
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

// ── Featured hero card ─────────────────────────────────────────
function FeaturedCard({ tip }: { tip: TravelTip }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out mb-10 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <Link to={`/travel/${tip.slug}`} className="group block rounded-3xl overflow-hidden relative aspect-[16/7]">
        <img
          src={tip.image}
          alt={tip.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute top-5 right-5 bg-white/90 text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-full font-medium text-black">
          Featured
        </div>
        <div className="absolute bottom-0 left-0 p-7 sm:p-10 text-white">
          {tip.destination && (
            <p className="text-[0.7rem] tracking-[.2em] uppercase opacity-60 mb-2">
              {tip.destination.city}, {tip.destination.country}
            </p>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight italic mb-2">
            {tip.title}
          </h2>
          {tip.story && (
            <p className="text-sm opacity-60 max-w-md line-clamp-2 mb-4">{tip.story}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <span className="text-[0.68rem] bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {tip.emoji} {tip.items.length} tips
            </span>
            {tip.tripInfo?.budget && (
              <span className="text-[0.68rem] bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {BUDGET_LABEL[tip.tripInfo.budget]}
              </span>
            )}
            {tip.tripInfo?.durationDays && (
              <span className="text-[0.68rem] bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                🗓 {tip.tripInfo.durationDays.min}–{tip.tripInfo.durationDays.max} days
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Grid card ──────────────────────────────────────────────────
function TravelCard({ tip, index }: { tip: TravelTip; index: number }) {
  const { ref, inView } = useInView()

  // Count total overview items across all sections
  const overviewCount = tip.overview
    ? Object.values(tip.overview).reduce((sum, arr) => sum + (arr?.length ?? 0), 0)
    : 0

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pb-4">
      
      
      <Link to={`/travel/${tip.slug}`} className="group overflow-hidden bg-white p-4">
        <div className="aspect-video overflow-hidden mb-3">
          <img
            src={tip.image}
            alt={tip.title}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
        <div>
          <h3 className="text-sm mb-1 text-left pl-2">{tip.title}</h3>
          <p className="text-xs text-muted-foreground">
          </p>
        </div>
      </Link>
    </div>
    </div>
  )
}

// ── Overview section (shown on the index page as a preview) ────
const OVERVIEW_SECTIONS: {
  key: keyof Overview
  label: string
  emoji: string
}[] = [
  { key: "apps",        label: "Apps",        emoji: "📱" },
  { key: "cafes",       label: "Cafés",       emoji: "☕" },
  { key: "restaurants", label: "Restaurants", emoji: "🍽" },
  { key: "shopping",    label: "Shopping",    emoji: "🛍" },
  { key: "activities",  label: "Activities",  emoji: "🗺" },
]

function OverviewPreview({ tip }: { tip: TravelTip }) {
  if (!tip.overview) return null
  const sections = OVERVIEW_SECTIONS.filter(s => (tip.overview![s.key]?.length ?? 0) > 0)
  if (sections.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-black/5">
      <div className="flex gap-3 flex-wrap">
        {sections.map(s => (
          <span key={s.key} className="text-[0.68rem] text-black/40 flex items-center gap-1">
            {s.emoji} {tip.overview![s.key]!.length} {s.label.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
type FilterKey = "all" | "budget" | "medium" | "luxury" | string

export default function TravelPage() {
  const [tips, setTips] = useState<TravelTip[]>([])
  const [allLists, setAllLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")

  useEffect(() => {
    Promise.all([
      getTravelTips().then((data: TravelTip[]) => setTips(data)),
      getLists().then((data) => setAllLists(data))
    ]).then(() => setLoading(false)).catch(() => { setError(true); setLoading(false) })
  }, [])

  const featured = tips.find(t => t.meta?.featured)
  const regions = [...new Set(tips.map(t => t.destination?.region).filter(Boolean))] as string[]

  const filtered = tips.filter(t => {
    if (activeFilter === "all") return true
    if (["budget", "medium", "luxury"].includes(activeFilter))
      return t.tripInfo?.budget === activeFilter
    return t.destination?.region === activeFilter
  })

  // const gridTips = filtered.filter(t => t._id !== featured?._id)
  const gridTips = filtered.filter(t => t._id)

  const filterOptions: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    ...regions.map(r => ({ key: r, label: r })),
    { key: "budget", label: "💸 Budget" },
    { key: "medium", label: "💳 Mid-range" },
    { key: "luxury", label: "💎 Luxury" },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-serif italic text-black/30 text-lg animate-pulse">Loading trips…</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-serif italic text-black/30 text-lg">Could not load travel tips.</p>
    </div>
  )

  return (
    <div className="min-h-screen text-[#0d0d0d]" >
      <div className="max-w-5xl mx-auto px-6 pt-15 pb-24">

        {/* HEADER */}
        <div className="text-left mb-10">
          <p className="text-[0.7rem] tracking-[.22em] uppercase opacity-40 mb-3">
            Reisenotater
          </p>
          <h1
            className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] mb-1"
            style={{color: "var(--font-color)" }}
          >
            Blog
          </h1>
          <p className="text-muted-foreground italic text-base pb-6" 
          style={{ color: "var(--font-color)" }}>
            Steder jeg har vært og ting jeg har lært
          </p>
        </div>

        {/* FEATURED */}
        {/* {featured && <FeaturedCard tip={featured} />} */}

        {/* TRAVEL TIPS GRID */}
        <p className="text-left text-[0.7rem] tracking-[.22em] uppercase opacity-40 mb-3">
          Reiser
        </p>
        {gridTips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-12 ">
            {gridTips.map((tip, i) => (
              <TravelCard key={tip._id} tip={tip} index={i} />
            ))}
          </div>
        ) : tips.length === 0 ? (
          <p className="font-serif italic text-black/30 text-lg mt-10">
            Ingen reiser her ennå.
          </p>
        ) : null}

        {/* CURATED LISTS SECTION */}
        <p className="text-left text-[0.7rem] tracking-[.22em] uppercase opacity-40 mb-3">
          Tilfeldige innlegg
        </p>
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 pb-4">
            {allLists.map((list) => (
              <Link
                key={list.slug}
                to={`/${list.slug}`}
                className="overflow-hidden bg-white p-4"
              >
                <div className="aspect-video overflow-hidden mb-3">
                  <img
                    src={list.image}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>
                <h3 className="text-sm text-left mb-1 pl-2">{list.title}</h3>
                <p className="text-xs text-left text-muted-foreground pl-2">
                  {list.items.length} valgte

                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}