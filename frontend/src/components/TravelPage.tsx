import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { getTravelTips } from "../data/api.js"
import { getLists } from "../data/api.js"
import { allLists as staticLists } from "./list-data.js"
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

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 75}ms` }}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <Link to={`/travel/${tip.slug}`} className="group rounded-xl overflow-hidden bg-white p-4 hover:shadow-md transition">
        {/* Image */}
        <div className="aspect-video rounded-xl overflow-hidden mb-3">
          <img
            src={tip.image}
            alt={tip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Body */}
        <div>
          <h3 className="text-sm mb-1 font-medium">{tip.title}</h3>
          <p className="text-xs text-muted-foreground">
            {tip.emoji} {tip.items.length} tips
          </p>
        </div>
      </Link>
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
    <div className="min-h-screen text-[#0d0d0d]" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-6 pt-15 pb-24">

        {/* HEADER */}
        <div className="text-left mb-10">
          <p className="text-[0.7rem] tracking-[.22em] uppercase opacity-40 mb-3">
            Reisenotater
          </p>
         <h1
        className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] mb-1"
        style={{ fontFamily: "'Gasoek One', serif", color: "var(--font-color)"}}
      >
      Blog
      </h1>
          <p className="text-base text-black/50 max-w-md leading-relaxed">
            Steder jeg har vært og ting jeg har lært
          </p>
        </div>

        {/* FEATURED */}
        {featured && <FeaturedCard tip={featured} />}

        {/* FILTERS */}
        {/* {(regions.length > 1 || tips.some(t => t.tripInfo?.budget)) && (
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
        )} */}

        {/* TRAVEL TIPS GRID */}
        <p className="text-left text-[0.7rem] tracking-[.22em] uppercase opacity-40 mb-3">
            Reiser
          </p>
        {gridTips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 mb-16">
            
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

          {/* {allLists.map((list) => ( */}
           {allLists.map((list) => (
            <Link
              key={list.slug}
              to={`/${list.slug}`}
              className="rounded-xl overflow-hidden bg-white p-4 hover:shadow-md transition"

            >
              <div className="aspect-video rounded-xl overflow-hidden mb-3">
              <img
                src={list.image}
                  className="w-full h-full object-cover hover:scale-105 transition"
              />
            </div>

              <h3 className="text-sm mb-1">{list.title}</h3>

              <p className="text-xs text-muted-foreground">
                {list.items.length} picks
              </p>

              {/* <span className="inline-block mt-3 text-xl">
                {list.emoji}
              </span> */}
            </Link>
          ))}

        </div>
      </div>
      </div>
    </div>

    
    
  )
}