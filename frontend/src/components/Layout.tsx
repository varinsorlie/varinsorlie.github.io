import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";
import NavItem from "./NavItem.js";

type Locale = "en" | "no";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    greeting: "Vårin Sørlie",
    greeting2: "Welcome!",
    subtitle: "Designer, developer, and professional over-thinker.",
    intro:
      "This site is part portfolio, part personal encyclopedia of opinions. Welcome!",
    curatedLists: "Recently posted",
    about: "Hello! I'm Vårin and i am currently in my first year of the Master’s degree in Informatics: Programming and System Architecture at the University of Oslo. I recently finished a Bachelor’s degree in Informatics: Design, use and interaction, also at UiO. This is my personal website, and i will post a lot of random things that I find intersting and fun! Enjoy!",
    resume: "Resume",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
    footer: "Made with care & caffeine",
  },
  no: {
    greeting: "Vårin Sørlie",
    greeting2: "Velkommen!",
    subtitle: "Designer, utvikler, og livsnyter.",
    intro:
      "Dette er litt som en portfølje, og litt som en samling av tilfeldige ting som interesserer meg. Velkommen!",
    curatedLists: "Nylig postet",
    about: "Hei! Jeg heter Vårin, og jeg går for tiden første året på masterstudiet i informatikk: programmering og systemarkitektur ved Universitetet i Oslo. Jeg har nylig fullført en bachelorgrad i informatikk: design, bruk og interaksjon, også ved UiO. Dette er min personlige nettside, og jeg kommer til å poste mange tilfeldige ting som jeg synes er interessante og morsomme! Kos deg!",
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
  const isMapPage = location.pathname === "/mapPage";
  const isBirthday = location.pathname === "/birthdayPage";
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
    
     {/* NAV */}
      <div className="relative flex flex-col items-center mb-5 pt-5">

        {/* Navigation row (hide on MapPage*/}
      {!isBirthday && (
        <div className="fixed bg-transparent flex gap-2 whitespace-nowrap z-50">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/cvPage">Resume</NavItem>
          <NavItem to="/travelPage">Blog</NavItem>
          {/* <NavItem to="/birthdayPage">Bursdag!</NavItem> */}
           {/* <NavItem to="/mapPage">Map</NavItem> */}
        </div>
      )}

      {/* BACK BUTTON — only on MapPage */}
     {isBirthday && (
       <div className="fixed top-4 left-4 z-50">
         <Link
           to="/"
           className="flex items-center gap-2 px-4 py-2 bg-background backdrop-blur-sm rounded-full border border-border hover:bg-foreground hover:text-background transition-all"
         >
           <ArrowLeft className="w-4 h-4" />
           <span className="text-sm">Back</span>
         </Link>
       </div>
     )}


    
        {/* Language button */}
        {/* <div className=" sm:right-5 sm:top-2.5 pt-5 fixed bg-transparent flex gap-2 whitespace-nowrap z-50">
          <div className="nav-pill">
            <button
              aria-label="Toggle language"
              onClick={() => setLocale(locale === "en" ? "no" : "en")}
              className="text-[0.85rem] font-medium rounded-full hover:bg-foreground/5 transition"
            >
              {locale === "en" ? "NO" : "EN"}
            </button>
          </div>
        </div> */}
      </div>
            

      {/* <main> */}
        
        {/* <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}> */}
        {/* {!isHome && (
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
        )} */}
        
        
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={!isHome ? "pt-16" : ""}
        >
          <Outlet />
        </motion.main>
       {/* </div> */}
      {/* </main> */}
    </LanguageContext.Provider>
  );
}
