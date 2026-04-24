import { Link } from "react-router-dom";
import { Github, Mail, Linkedin, MapPin, Code2, BookOpen, Briefcase } from "lucide-react";
import { motion } from "motion/react";
// import { allLists } from "./list-data";
import myImage1 from "../assets/IMG_5190.jpg"
import myImage2 from "../assets/IMG_5274.jpeg"
import myImage3 from "../assets/IMG_4934.jpeg"
import myImage4 from "../assets/IMG_4651.jpeg"

import grid1 from "../assets/IMG_5010.jpeg"
import grid2 from "../assets/shanghai.jpg"
import grid3 from "../assets/beach.jpg"
import grid4 from "../assets/sno.jpeg"

import { useLanguage } from "./Layout.js";
import { BouncyAvatar } from "./BouncyAvatar.js";

import { useEffect, useState } from "react";
import { getLists } from "../data/api.js";

import retro from "../assets/test.jpeg"; 
import sunset from "../assets/IMG_0638.jpeg"

export default function Home() {
  const PROFILE_IMAGE = [myImage1, myImage2, myImage3, myImage4]

  const { t } = useLanguage();
  const openPdfInNewWindow = (e: any, url: string) => {
    e?.preventDefault();
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `
      <!doctype html>
      <html>
        <head>
          <title>Vårin</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>html,body{height:100%;margin:0}iframe{border:0;width:100%;height:100vh}</style>
        </head>
        <body>
          <iframe src="${url}"></iframe>
        </body>
      </html>
    `;
    w.document.open();
    w.document.write(html);
    w.document.close();
    };

  const [allLists, setLists] = useState<any[]>([]);
  
   useEffect(() => {
    getLists().then(setLists);
  }, []);


  
  return (
<div className="min-h-screen">


    {/* INTRO */}
  <section 
    className="py-20"
    style={{ background: "var(--background)" }}
  >
      {/* Birthday Button */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="mb-20"
    >
      <Link
        to="/birthdayPage"

        className="w-1/2 p-5 bg-gradient-to-r from-pink-500 
        via-purple-500 to-pink-500 text-white font-bold text-xl 
        sm:text-2xl py-6 sm:py-8 rounded-2xl hover:shadow-2xl 
        hover:scale-105 transition-all duration-300 text-center animate-pulse"
      >
        🎉 Bursdags-bingo! 🎉
      </Link>
    </motion.div>
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* LEFT: Title */}
        <div>
          <h1
            className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4rem] mb-8 leading-tight"
            style={{  color: "var(--font-color)" }}
          >
            Vårin Sørlie
          </h1>
          
          <p className="text-muted-foreground italic text-base pb-6"
            style={{ color: "var(--font-color)" }}>
            {t("intro")}
          </p>

        {/* Image 2 */}
          <div className="break-inside-avoid">
            <img src={grid2} alt="Placeholder 2" className="w-full h-auto object-cover" />
            <p className="text-sm text-muted-foreground mt-2">Shanghai, China</p>
          </div>
        </div>

        {/* RIGHT: Image grid */}
        <div className="columns-2 gap-4 space-y-4">
          {/* Image 1 */}
          <div className="break-inside-avoid">
            <img src={grid1} alt="Placeholder 1" className="w-full h-auto object-cover" />
            <p className="text-sm text-muted-foreground mt-2">Jomfruslettfjell, Norway</p>
          </div>

          {/* Image 3 */}
          <div className="break-inside-avoid">
            <img src={grid3} alt="Placeholder 3" className="w-full h-auto object-cover" />
            <p className="text-sm text-muted-foreground mt-2">Ko Lanta, Thailand</p>
          </div>

          {/* Image 4 */}
          <div className="break-inside-avoid">
            <img src={grid4} alt="Placeholder 4" className="w-full h-auto object-cover" />
            <p className="text-sm text-muted-foreground mt-2">Gjøvik, Norway</p>
          </div>
        </div>
        
      </div>
    </div>
    
  </section>

  {/* RECENT POSTS */}
  <section 
  className="sticky top-0 z-20 py-20 max-w items-center"
        
>
  <div className="mx-auto px-6 p-25 "
  style={{ 
          background: "var(--background2)",
          backgroundImage: `url(${sunset})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}>
      {/* your recent posts */}
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {/* <div className="border-t border-border pt-5 mb-5 text-center">
        </div> */}
        <p className="text-left text-[1.0rem] mb-4 pl-2 tracking-widest mb-2"
        style={{color: "var(--card)"}}> {/*text-muted-foreground uppercase */}
          {t("curatedLists")}
        </p>
      </motion.div>
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
                {list.items.length} valgte
              </p>

              {/* <span className="inline-block mt-3 text-xl">
                {list.emoji}
              </span> */}
            </Link>
          ))}

        </div>
      </div>
    </div>

      {/* ABOUT */}
    <div className="bg-background rounded-2xl p-8">
       
        <ul className="space-y-4 sm:flex sm:justify-center ">
          
          <li className="text-left">
            <h2 className="font-serif text-2xl mb-4">
              {t("greeting2")}
            </h2>
           <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">Oslo, Norway</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">Computer Science, UiO</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">Fullstack developer</p>
                </div>
              </div>
               <p className="text-sm text-muted-foreground mt-4">
                  {t("about")}
              </p>
          </li>
          <li>
             <div className="grid grid-cols-2 gap-4 place-items-center
                      sm:flex sm:justify-center sm:gap-6 mb-16 pt-5">
        {PROFILE_IMAGE.map((src, i) => (
          <BouncyAvatar key={i} src={src} />
        ))}
      </div>
          </li>
        </ul>
      </div>
        {/* IMAGES */}

   
  </section>


 

  {/* LINKS */}
  {/* <section className="sticky top-0 z-30 py-20"
  style={{ background: "var(--background)" }}
  > */}
  <div className="max-w-xl mx-auto px-6">


      {/* your quick links */}
       <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-5 mb-16 pt-5 justify-center"
          >
            {[
              { label: t("Github"), icon: Github, href: "https://github.com/varinsorlie" },
              { label: t("Linkedin"), icon: Linkedin, href: "https://www.linkedin.com/in/vårin-sørlie" },
              { label: t("Email"), icon: Mail, href: "mailto:vaarinso@uio.no" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) =>
                  link.label === "Resume" ? openPdfInNewWindow(e, String(link.href)) : undefined
                }
                target={link.label === "Resume" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex bg-white items-center gap-2 px-4 py-2.5 border border-border rounded-full text-[0.8rem] tracking-wide text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ))}
          </motion.div>
    </div>
  {/* </section> */}

</div>)
    

}
