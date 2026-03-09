import { Link, Outlet, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";


type Locale = "en" | "no";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    greeting: "Hey, I'm Vårin",
    subtitle: "Designer, developer, and professional over-thinker.",
    intro:
      "This site is part portfolio, part personal encyclopedia of opinions. Welcome!",
    curatedLists: "My lists",
    resume: "Resume",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
    footer: "Made with care & caffeine",
  },
  no: {
    greeting: "Hei, jeg er Vårin",
    subtitle: "Designer, utvikler, og livsnyter.",
    intro:
      "Dette er litt som en portfølje, og litt som en samling av tilfeldige ting som interesserer meg. Velkommen!",
    curatedLists: "Mine lister",
    resume: "CV",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "E-post",
    footer: "Laget med kjærlighet & koffein",
  },
};

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: "no",
  setLocale: () => {},
  t: (k) => k,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [locale, setLocale] = useState<Locale>(() => {
  const stored = typeof window !== "undefined" && localStorage.getItem("locale");
    return (stored as Locale) || "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem("locale", locale);
    } catch {}
  }, [locale]);

  const t = (key: string) => translations[locale]?.[key] ?? key;

  return (
   <LanguageContext.Provider value={{ locale, setLocale, t }}>
    
      

      <main>
        
        <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
        {!isHome && (
          // TOP-BAR
          <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[0.8rem] tracking-wide uppercase">Back home</span>
              </Link>
              <Link
                to="/"
                className="text-[0.8rem] tracking-widest uppercase text-muted-foreground"
              >
                Vårin
              </Link>
            </div>
          </header>
        )}
        {/* TOP-RIGTH BUTTON -language  */}
        <div className="fixed top-2 right-4 z-50">
          <div className="flex items-center gap-2 bg-background/70 backdrop-blur rounded-full border border-border px-2 py-1">
            <button
              aria-label="Toggle language"
              onClick={() => setLocale(locale === "en" ? "no" : "en")}
              className="text-[0.85rem] font-medium px-3 py-1 rounded-full hover:bg-foreground/5 transition"
            >
              {locale === "en" ? "NO" : "EN"}
            </button>
          </div>
        </div>
        
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={!isHome ? "pt-16" : ""}
        >
          <Outlet />
        </motion.main>
       </div>
      </main>
    </LanguageContext.Provider>
  );
}
