import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getTravelTip } from "../data/api.js"

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
  languages?: string[]
  visaRequired?: boolean
}

interface TipItem {
  id: string
  tip: string
  category: string
  essential: boolean
  source?: string
  note?: string
}

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
  cuisine?: string
  type?: string
}

interface Overview {
  apps?: AppItem[]
  cafes?: PlaceItem[]
  restaurants?: PlaceItem[]
  shopping?: PlaceItem[]
  activities?: PlaceItem[]
}

interface ItineraryActivity {
  id: string
  name: string
  type: string
  image?: string
  mustVisit?: boolean
}

interface Accommodation {
  name: string
  address: string
  rating?: string
  note?: string
}

interface ItineraryStop {
  id: string
  city: string
  order: number
  nights?: number
  accommodation?: Accommodation
  activities?: ItineraryActivity[]
}

interface HotTips {
  eat?: string[]
  prepare?: string[]
  remember?: string[]
}

interface TravelTip {
  _id: string
  slug: string
  title: string
  subtitle?: string
  emoji: string
  color?: string
  image: string
  photos?: string[]
  story?: string
  closingNote?: string
  destination?: Destination
  tripInfo?: TripInfo
  items: TipItem[]
  categories?: string[]
  overview?: Overview
  itinerary?: ItineraryStop[]
  hotTips?: HotTips
  meta?: {
    featured?: boolean
    tags?: string[]
    publishedAt?: string
    author?: string
  }
}

// ── Helpers ────────────────────────────────────────────────────
const BUDGET_LABEL: Record<string, string> = {
  budget: "💸 Budget",
  medium: "💳 Mid-range",
  luxury: "💎 Luxury",
}

// ── Sub-components ─────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-serif mb-5 mt-12">
      {children}
    </h2>
  )
}

function ActivityCard({ item }: { item: ItineraryActivity }) {
  return (
    <div className="rounded-xl border border-black/8 overflow-hidden bg-white flex flex-col min-w-0">
      {/* <div className="aspect-[4/3] bg-black/5 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-black/5" />
        )}
      </div> */}
       <div className="p-2.5 flex flex-col h-full">
        <div className="flex-1">
          <p className="text-xs font-medium leading-tight mb-0.5 whitespace-normal break-words">{item.name}</p>
          <p className="text-[0.65rem] text-black/35 mb-1.5 whitespace-normal break-words">{item.type}</p>
        </div>
        {item.mustVisit && (
          <span className="text-[0.55rem] tracking-wide uppercase bg-black/5 text-black/35 px-1.5 py-0.5 rounded-full w-fit">
            ★
          </span>
        )}
        {!item.mustVisit && (
          <div className="h-5" />
        )}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function TravelDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [tip, setTip] = useState<TravelTip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeCity, setActiveCity] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")

  useEffect(() => {
    if (!slug) return
    getTravelTip(slug)
      .then((data: TravelTip) => {
        setTip(data)
        if (data.itinerary?.length) {
          setActiveCity(data.itinerary[0].city)
        }
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-serif italic text-black/30 text-lg animate-pulse">Loading…</p>
    </div>
  )

  if (error || !tip) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-serif italic text-black/30 text-lg">Travel tip not found.</p>
    </div>
  )

  const sortedItinerary = [...(tip.itinerary ?? [])].sort((a, b) => a.order - b.order)
  const activeStop = sortedItinerary.find(s => s.city === activeCity)

  const categories = ["all", ...(tip.categories ?? [])]
  const filteredItems = activeCategory === "all"
    ? tip.items
    : tip.items.filter(i => i.category === activeCategory)

  const { overview, hotTips } = tip

  return (
    <div className="min-h-screen text-[#0d0d0d]" style={{ background: "var(--background)" }}>
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">

        {/* TITLE */}
        <h1
          className="text-[2.8rem] sm:text-[4rem] mb-10 leading-none"
          style={{color: "var(--font-color)" }}
        >
          {tip.destination?.country ?? tip.title}
        </h1>

        {/* PHOTO ALBUM */}
        {(tip.photos?.length ?? 0) > 0 && (
          <>
            <SectionHeading>Foto album</SectionHeading>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {tip.photos!.map((url, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden bg-black/5 shrink-0 w-64">
                  {/* <img
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  /> */}
                </div>
              ))}
            </div>
          </>
        )}

        {/* STORY */}
        {tip.story && (
          <p className="text-base text-black/60 leading-relaxed mt-10">{tip.story}</p>
        )}

        {/* ITINERARY */}
        {sortedItinerary.length > 0 && (
          <>
            <SectionHeading>Reiserute</SectionHeading>

            {/* City pills */}
            <div className="flex gap-2 flex-wrap mb-8">
              {sortedItinerary.map((stop) => (
                <button
                  key={stop.id}
                  onClick={() => setActiveCity(stop.city)}
                  className={`text-sm border rounded-full px-4 py-1.5 transition-all cursor-pointer
                    ${activeCity === stop.city
                      ? "bg-[#0d0d0d] text-[#f5f0e8] border-[#0d0d0d]"
                      : "border-black/15 text-black/50 hover:border-black/40 hover:text-black"
                    }`}
                >
                  {stop.order}. {stop.city}
                </button>
              ))}
            </div>

            {/* Overnight stays — all cities stacked */}
            {/* <SectionHeading>Overnight Stays</SectionHeading>
            <div className="space-y-4 mb-4">
              {sortedItinerary.map((stop, i) => stop.accommodation && (
                <div key={stop.id}>
                  <p className="text-sm text-black/40 mb-2">{i + 1}. {stop.city}</p>
                  <div className="rounded-2xl border border-black/8 bg-white p-5 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium leading-snug mb-1">
                        {stop.accommodation.name}
                      </p>
                      <p className="text-xs text-black/35 leading-relaxed">
                        {stop.accommodation.address}
                      </p>
                    </div>
                    <div>
                      {stop.accommodation.rating && (
                        <>
                          <p className="text-xs font-medium mb-1">Rating:</p>
                          <p className="text-xs text-black/50 leading-relaxed">
                            {stop.accommodation.rating}
                          </p>
                        </>
                      )}
                      {stop.accommodation.note && (
                        <p className="text-xs text-black/35 mt-1 italic">
                          Note: {stop.accommodation.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Activities — filtered by active city pill */}
            <SectionHeading>Aktiviteter</SectionHeading>
            <div className="space-y-8">
              {sortedItinerary.map((stop, i) => (
                (stop.activities?.length ?? 0) > 0 && (
                  <div key={stop.id}>
                    <p className="text-sm text-black/40 mb-3">{i + 1}. {stop.city}</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {stop.activities!.map(act => (
                        <ActivityCard key={act.id} item={act} />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        )}

        {/* HOT TIPS */}
        {hotTips && (
          <>
            <SectionHeading>Hot Tips</SectionHeading>
            <div className="rounded-2xl border border-black/8 bg-white p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {hotTips.eat && (
                <div>
                  <p className="text-sm font-medium mb-2">Eat this:</p>
                  <ul className="space-y-1">
                    {hotTips.eat.map((item, i) => (
                      <li key={i} className="text-xs text-black/55 flex items-start gap-1.5">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-black/25 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hotTips.prepare && (
                <div>
                  <p className="text-sm font-medium mb-2">Prepare this:</p>
                  <ul className="space-y-1">
                    {hotTips.prepare.map((item, i) => (
                      <li key={i} className="text-xs text-black/55 flex items-start gap-1.5">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-black/25 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hotTips.remember && (
                <div>
                  <p className="text-sm font-medium mb-2">Remember this:</p>
                  <ul className="space-y-1">
                    {hotTips.remember.map((item, i) => (
                      <li key={i} className="text-xs text-black/55 flex items-start gap-1.5">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-black/25 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        {/* OVERVIEW SECTIONS (apps, cafes, restaurants, shopping, activities) */}
        {(overview?.apps?.length ?? 0) > 0 && (
          <>
            <SectionHeading>Smarte apper</SectionHeading>
            <p> Kommer snart ...</p>
            {/* <div className="bg-white rounded-2xl border border-black/8 px-5 divide-y divide-black/5">
              {overview!.apps!.map(item => (
                <div key={item.id} className="flex items-start gap-4 py-4">
                  <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center text-base shrink-0">📱</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.free && (
                        <span className="text-[0.6rem] tracking-wide uppercase bg-black/5 text-black/35 px-2 py-0.5 rounded-full">Free</span>
                      )}
                    </div>
                    <p className="text-xs text-black/45 leading-relaxed">{item.description}</p>
                    <p className="text-[0.65rem] text-black/25 mt-1 uppercase tracking-wide">{item.platform.join(" · ")}</p>
                  </div>
                </div>
              ))}
            </div> */}
          </>
        )}

        {(overview?.cafes?.length ?? 0) > 0 && (
          <>
            <SectionHeading>Kaféer</SectionHeading>
             <p> Kommer snart ...</p>
            {/* <div className="bg-white rounded-2xl border border-black/8 px-5 divide-y divide-black/5">
              {overview!.cafes!.map(item => (
                <div key={item.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.mustVisit && <span className="text-[0.6rem] tracking-wide uppercase bg-black/5 text-black/35 px-2 py-0.5 rounded-full">Must visit</span>}
                    </div>
                    <p className="text-[0.68rem] text-black/30 mb-1 uppercase tracking-wide">{item.area}</p>
                    <p className="text-xs text-black/45 leading-relaxed">{item.tip}</p>
                  </div>
                  <span className="text-xs text-black/25 shrink-0">{item.priceRange}</span>
                </div>
              ))}
            </div> */}
          </>
        )}

        {(overview?.restaurants?.length ?? 0) > 0 && (
          <>
            <SectionHeading>Restauranter</SectionHeading>
             <p> Kommer snart ...</p>
            {/* <div className="bg-white rounded-2xl border border-black/8 px-5 divide-y divide-black/5">
              {overview!.restaurants!.map(item => (
                <div key={item.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.mustVisit && <span className="text-[0.6rem] tracking-wide uppercase bg-black/5 text-black/35 px-2 py-0.5 rounded-full">Must visit</span>}
                    </div>
                    <p className="text-[0.68rem] text-black/30 mb-1 uppercase tracking-wide">{item.area}{item.cuisine ? ` · ${item.cuisine}` : ""}</p>
                    <p className="text-xs text-black/45 leading-relaxed">{item.tip}</p>
                  </div>
                  <span className="text-xs text-black/25 shrink-0">{item.priceRange}</span>
                </div>
              ))}
            </div> */}
          </>
        )}

        {(overview?.shopping?.length ?? 0) > 0 && (
          <>
            <SectionHeading>Shopping</SectionHeading>
             <p> Kommer snart ...</p>
            {/* <div className="bg-white rounded-2xl border border-black/8 px-5 divide-y divide-black/5">
              {overview!.shopping!.map(item => (
                <div key={item.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.mustVisit && <span className="text-[0.6rem] tracking-wide uppercase bg-black/5 text-black/35 px-2 py-0.5 rounded-full">Must visit</span>}
                    </div>
                    <p className="text-[0.68rem] text-black/30 mb-1 uppercase tracking-wide">{item.area}{item.type ? ` · ${item.type}` : ""}</p>
                    <p className="text-xs text-black/45 leading-relaxed">{item.tip}</p>
                  </div>
                  <span className="text-xs text-black/25 shrink-0">{item.priceRange}</span>
                </div>
              ))}
            </div> */}
          </>
        )}

        {/* TIPS TABLE */}
        {tip.items.length > 0 && (
          <>
            <SectionHeading>💡 Tips</SectionHeading>
            {categories.length > 1 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[0.68rem] tracking-[.08em] uppercase border rounded-full px-3 py-1 transition-all cursor-pointer
                      ${activeCategory === cat
                        ? "bg-[#0d0d0d] text-[#f5f0e8] border-[#0d0d0d]"
                        : "border-black/15 text-black/40 hover:border-black/40 hover:text-black"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            <div className="bg-white rounded-2xl border border-black/8 px-5 divide-y divide-black/5">
              {filteredItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 py-3.5">
                  <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${item.essential ? "bg-black/60" : "bg-black/15"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm">{item.tip}</span>
                      <span className="text-[0.6rem] tracking-wide uppercase bg-black/5 text-black/30 px-2 py-0.5 rounded-full">{item.category}</span>
                    </div>
                    {item.note && <p className="text-xs text-black/40 leading-relaxed">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CLOSING NOTE */}
        {tip.closingNote && (
          <div className="mt-12 p-5 rounded-2xl bg-white border border-black/8">
            <p className="text-[0.7rem] tracking-[.2em] uppercase opacity-40 mb-2">Hot tip</p>
            <p className="text-sm text-black/55 leading-relaxed italic">{tip.closingNote}</p>
          </div>
        )}

      </div>
    </div>
  )
}