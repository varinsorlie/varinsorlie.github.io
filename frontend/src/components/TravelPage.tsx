import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { getTravelTips } from "../data/api.js"

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

const REGION_COLORS: Record<string, string> = {
  Europe: "#c94b1f",
  Asia: "#4a6741",
  Americas: "#1a5276",
  Africa: "#7a3a10",
  Oceania: "#3a5c6b",
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

        {/* Featured badge */}
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
  const regionColor = tip.destination?.region
    ? (REGION_COLORS[tip.destination.region] ?? "#888")
    : "#888"

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 75}ms` }}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <Link to={`/travel/${tip.slug}`} className="group block">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 relative">
          <img
            src={tip.image}
            alt={tip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {tip.destination && (
            <span
              className="absolute top-3 left-3 text-white text-[0.62rem] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium"
              style={{ background: regionColor }}
            >
              {tip.destination.region}
            </span>
          )}
          {tip.items.filter(i => i.essential).length > 0 && (
            <span className="absolute top-3 right-3 bg-black/55 text-white text-[0.62rem] tracking-wide px-2.5 py-1 rounded-full">
              ⚡ {tip.items.filter(i => i.essential).length} must-knows
            </span>
          )}
        </div>

        {/* Body */}
        <div>
          {tip.destination && (
            <p className="text-[0.68rem] tracking-[.18em] uppercase opacity-40 mb-1">
              {tip.destination.city}, {tip.destination.country}
            </p>
          )}
          <h3 className="font-serif text-xl tracking-tight italic group-hover:text-[#c94b1f] transition-colors duration-200 mb-1">
            {tip.title}
          </h3>
          {tip.story && (
            <p className="text-sm text-black/50 leading-relaxed line-clamp-2 mb-3">{tip.story}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[0.68rem] bg-[#ede8dc] text-black/60 px-2 py-0.5 rounded">
              {tip.emoji} {tip.items.length} tips
            </span>
            {tip.tripInfo?.budget && (
              <span className="text-[0.68rem] bg-[#ede8dc] text-black/60 px-2 py-0.5 rounded">
                {BUDGET_LABEL[tip.tripInfo.budget]}
              </span>
            )}
            {tip.tripInfo?.durationDays && (
              <span className="text-[0.68rem] bg-[#ede8dc] text-black/60 px-2 py-0.5 rounded">
                🗓 {tip.tripInfo.durationDays.min}–{tip.tripInfo.durationDays.max} days
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
type FilterKey = "all" | "budget" | "medium" | "luxury" | string

export default function TravelPage() {
  const [tips, setTips] = useState<TravelTip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")

  useEffect(() => {
    getTravelTips()
      .then((data: TravelTip[]) => { setTips(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const featured = tips.find(t => t.meta?.featured)
  const regions = [...new Set(tips.map(t => t.destination?.region).filter(Boolean))] as string[]

  const filtered = tips.filter(t => {
    if (activeFilter === "all") return true
    if (["budget", "medium", "luxury"].includes(activeFilter))
      return t.tripInfo?.budget === activeFilter
    return t.destination?.region === activeFilter
  })

  const gridTips = filtered.filter(t => t._id !== featured?._id)

  const filterOptions: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    ...regions.map(r => ({ key: r, label: r })),
    { key: "budget", label: "💸 Budget" },
    { key: "medium", label: "💳 Mid-range" },
    { key: "luxury", label: "💎 Luxury" },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
      <p className="font-serif italic text-black/30 text-lg animate-pulse">Loading trips…</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
      <p className="font-serif italic text-black/30 text-lg">Could not load travel tips.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#0d0d0d]">
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-[0.7rem] tracking-[.22em] uppercase opacity-40 mb-3">
            Reisenotater
          </p>
          <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] leading-[.9] tracking-[-0.04em] italic mb-4">
            Travel<br />
            <em className="text-[#c94b1f]">Tips</em>
          </h1>
          <p className="text-base text-black/50 max-w-md leading-relaxed">
            Steder jeg har vært, ting jeg lærte — samlet så du slipper å finne ut av det selv.
          </p>
        </div>

        {/* FEATURED */}
        {featured && <FeaturedCard tip={featured} />}

        {/* FILTERS — only show if there's more than one region or budget variety */}
        {(regions.length > 1 || tips.some(t => t.tripInfo?.budget)) && (
          <div className="flex gap-2 flex-wrap mb-8">
            {filterOptions.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`text-[0.72rem] tracking-[.1em] uppercase border rounded-full px-4 py-1.5 transition-all duration-200 cursor-pointer
                  ${activeFilter === f.key
                    ? "bg-[#0d0d0d] text-[#f5f0e8] border-[#0d0d0d]"
                    : "border-black/15 text-black/50 hover:border-black/40 hover:text-black"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* GRID */}
        {gridTips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
            {gridTips.map((tip, i) => (
              <TravelCard key={tip._id} tip={tip} index={i} />
            ))}
          </div>
        ) : tips.length === 0 ? (
          <p className="font-serif italic text-black/30 text-lg mt-10">
            Ingen reiser her ennå.
          </p>
        ) : null}

      </div>
    </div>
  )
}