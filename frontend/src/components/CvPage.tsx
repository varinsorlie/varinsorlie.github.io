import { useState, useEffect, useRef } from "react"

type Category = "all" | "work" | "edu" | "side" | "award"

interface CVEntry {
  role: string
  org: string
  time: string
  desc: string
  cat: Exclude<Category, "all">
  tags?: string[]
}

interface CVGroup {
  year: string
  entries: CVEntry[]
}

interface Skill {
  name: string
  level: number
}

const CV_DATA: CVGroup[] = [
  {
    year: "2026",
    entries: [
      {
        role: "Software Engineer",
        org: "Pastport, Oslo",
        time: "Des 2025 - Now",
        desc: "Full-stack developer of PastPort App. Implementing the database connected to the app. Implemented the design in front-end.",
        cat: "work",
        tags: ["Figma", "Ghost", "React", "Typescript"],
      },
        {
        role: "varinsorlie.github.io — Personal Site",
        org: "Self-initiated",
        time: "March 2025",
        desc: "Designed and built this very site — part portfolio, part blog, part treasure map.",
        cat: "side",
        tags: ["MongoDB","React", "TypeScript", "CSS", "Tailwind"],
      },
    ],
  },
  {
    year: "2025",
    entries: [
        {
        role: "MS in Informatics: Programming and System Architecture",
        org: "University of Oslo",
        time: "Aug 2025 - Now",
        desc: "Started on my masters in system architecture. I will graduate summer 2027",
        cat: "edu",
        tags: ["AI", "Programming", "Energy informatics","Platform technology", ],
      },
      {
        role: "Software Engineer",
        org: "University of Oslo",
        time: "June 2025 - Aug 2025",
        desc: "Full-stack developer of an interactive game for students. Created an algorithm to create an adaptive task-collector for the game.",
        cat: "work",
        tags: ["React", "Python", "Django", "Typescript","Figma"],
      },
    {
        role: "BS in Informatics: design, use and interaction",
        org: "University of Oslo",
        time: "Aug 2022 - June 2025",
        desc: "",
        cat: "edu",
        tags: ["HCI", "UX design",],
      },
    ],
  },
  {
    year: "2024",
    entries: [
      {
        role: "Exchange Ambassador",
        org: " University of Oslo",
        time: "May 2024 - May 2025",
        desc: "Represented UiO in Asia by arranging and speaking at exchange events.",
        cat: "work",
        tags: ["Public speaking", "Branding"],
      },
      {
        role: "Assistant at hostpital",
        time: "May 2025 - Now",
        org: " Sykehuset Innlandet - Reinsvoll sykehus",
        desc: "Summer substitute at psychiatric hospital for the last two summers. Took care of patients by encouraging them to to activities, and assisted doctors and nurses in their daily tasks at the hospitals.",
        cat: "work",
      },
    ],
  },
  {
    year: "2021",
    entries: [
      {
        role: "History 1-year-course",
        org: "University of Oslo",
        time: "Aug 2021 - June 2022",
        desc: "",
        cat: "edu",
        tags: ["History", "Society",],
      },
    ],
  },
]

const SKILLS: Skill[] = [
   { name: "Java", level: 100 },
  { name: "Python", level: 100 },
  { name: "Figma", level: 90 },
  { name: "React", level: 90 },
  { name: "UX research", level: 85 },
  { name: "MongoDB", level: 75 },
 
]

const FILTERS: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "work", label: "Work" },
  { key: "edu", label: "Education" },
  { key: "side", label: "Projects" },
  
]

const BADGE: Record<Exclude<Category, "all">, string> = {
  work:  "bg-orange-100 text-orange-800",
  edu:   "bg-green-100 text-green-800",
  award: "bg-purple-100 text-purple-800",
  side:  "bg-blue-100 text-blue-800",
}

const BADGE_LABEL: Record<Exclude<Category, "all">, string> = {
  work: "Work", edu: "Education", award: "Award", side: "Project",
}

// Hook: fires when element enters viewport
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, options)
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

// Animated card
function TimelineCard({ entry, index, isLeft }: { entry: CVEntry; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.15 })
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`
        group relative bg-white border border-black/10 rounded-2xl p-5
        transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-0.5
        ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      {/* dot on timeline */}
       <span className={`absolute top-5 w-2.5 h-2.5 rounded-full border-2 border-black/20 bg-[#f5f0e8] group-hover:bg-[#c94b1f] group-hover:border-[#c94b1f] transition-colors ${
        isLeft ? "-right-[18px]" : "-left-[18px]"
      }`} />

      <div className={`flex items-start justify-between gap-3 mb-1 ${isLeft ? "flex-row-reverse" : ""}`}>
        <p className={`font-serif text-[1.1rem] leading-snug tracking-tight ${isLeft ? "text-right" : "text-left"}`}>{entry.role}</p>
        <span className={`text-[0.62rem] tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 font-medium ${BADGE[entry.cat]}`}>
          {BADGE_LABEL[entry.cat]}
        </span>
      </div>

      <p className={`text-sm italic text-black/50 mb-2 ${isLeft ? "text-right" : "text-left"}`}>{entry.org}</p>
      <p className={`text-sm italic text-black/50 mb-2 ${isLeft ? "text-right" : "text-left"}`}>{entry.time}</p>


      {entry.tags && (
        <div className={`flex flex-wrap gap-1.5 mt-3 ${isLeft ? "justify-end" : "justify-start"}`}>
          {entry.tags.map(t => (
            <span key={t} className="text-[0.68rem] bg-[#ede8dc] text-black/70 px-2 py-0.5 rounded">{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// Skill bar
function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.3 })
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 60}ms` }}
      className={`bg-white border border-black/10 rounded-xl p-4 transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <p className="text-sm font-semibold mb-2.5">{skill.name}</p>
      <div className="h-[3px] bg-[#ede8dc] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#f49242] rounded-full transition-all duration-1000 ease-out"
          style={{ width: inView ? `${skill.level}%` : "0%" }}
        />
      </div>
    </div>
  )
}

export default function CVPage() {
  const [active, setActive] = useState<Category>("all")
  const { ref: lineRef, inView: lineIn } = useInView({ threshold: 0.05 })

  const visibleGroups = CV_DATA.filter(g =>
    active === "all" || g.entries.some(e => e.cat === active)
  )

  return (
    <div className="min-h-screen text-[#0d0d0d]"
    style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-6 pt-15 pb-24">
      {/* HEADER */}
        <div className="text-left mb-10">
          <p className="text-[0.7rem] tracking-[.22em] uppercase opacity-40 mb-3">
            Experience
          </p>
         <h1
        className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] mb-1"
        style={{ color: "var(--font-color)"}}
      >
      Resume
      </h1>
          <p className="text-muted-foreground italic text-base pb-6" style={{ color: "var(--font-color)" }}>
            Selected experience in terms of education, work and projects. 
          </p>
        </div>

      {/* FILTERS */}
      <div className="max-w-3xl mx-auto px-6 mt-6 flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`text-[0.72rem] tracking-[.12em] uppercase border rounded-full px-4 py-1.5 transition-all duration-200 cursor-pointer
              ${active === f.key
                ? "bg-[#0d0d0d] text-[#f5f0e8] border-[#0d0d0d]"
                : "border-black/15 text-black/50 hover:border-black/40 hover:text-black"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TIMELINE */}
      <div className="max-w-3xl mx-auto px-0 mt-10 mb-16 relative">

        {/* vertical line */}
        <div
          ref={lineRef}
          style={{
            transformOrigin: "top",
            transform: lineIn ? "scaleY(1)" : "scaleY(0)",
            transition: "transform 1.2s cubic-bezier(.16,1,.3,1)",
          }}
          className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-black/10"
        />

        {visibleGroups.map(group => {
          const entries = active === "all"
            ? group.entries
            : group.entries.filter(e => e.cat === active)
          if (!entries.length) return null
          return (
            <div key={group.year} className="relative mb-12 px-6 sm:px-0">
              {/* year label */}
              <span className="hidden sm:block absolute left-0 top-0.5 w-[110px] text-right pr-6 font-serif italic text-sm text-black/40">
                {group.year}
              </span>
               <span className="sm:hidden block font-serif italic text-sm text-black/40 mb-3">
               {group.year}
              </span>

              
              <div className="sm:flex sm:flex-col">
                {entries.map((entry, i) => {
                  const isLeft = i % 2 === 0; // alternate left/right
                  return (
                    <div
                      key={`${group.year}-${i}`}
                      className={`relative mb-3 sm:flex sm:gap-6 ${isLeft ? "sm:flex-row-reverse" : ""}`}
                    >
                      {/* spacer for centering */}
                      <div className="hidden sm:block sm:w-[50%]" />

                      {/* card */}
                      <div className="sm:w-[50%]">
                        <TimelineCard entry={entry} index={i} isLeft={isLeft} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* SKILLS */}
      {/* <div className="max-w-3xl mx-auto px-6 sm:px-6 pb-24">
        <p className="text-[0.68rem] tracking-[.22em] uppercase text-black/35 mb-4 pt-6 border-t border-black/10">
          Skills & tools
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SKILLS.map((s, i) => <SkillBar key={s.name} skill={s} index={i} />)}
        </div>
      </div> */}
</div>
    </div>
  )
}