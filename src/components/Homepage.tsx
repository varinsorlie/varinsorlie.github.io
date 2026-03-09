

import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Github, Mail, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import { allLists } from "./list-data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import myImage1 from "../assets/IMG_5190.jpg"
import myImage2 from "../assets/IMG_5274.jpeg"
import myImage3 from "../assets/IMG_4934.jpeg"
import myImage4 from "../assets/IMG_4651.jpeg"
import cv from "../assets/cv_march26.pdf"
import { useLanguage } from "./Layout";

const PROFILE_IMAGE = [myImage1, myImage2, myImage3, myImage4]


export default function Home() {
  const { t } = useLanguage();
  const openPdfInNewWindow = (e: any, url: string) => {
    e?.preventDefault();
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `
      <!doctype html>
      <html>
        <head>
          <title>Resume</title>
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
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20 md:py-28">
        <div className="max-w-xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Avatar */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                {PROFILE_IMAGE.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-30 h-30 rounded-full overflow-hidden border-2 border-border flex-shrink-0"
                  >
                    <ImageWithFallback
                      src={src}
                      alt={`profile-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

             <h1
              className="text-left text-[2.5rem] md:text-[3.2rem] tracking-tight mb-4"
              style={{
                fontFamily: "'DM Serif Display', serif",
                lineHeight: 1.1,
              }}
            >
              {t("greeting")}
            </h1>
            <p
              className="text-left tracking-tight mb-4 text-muted-foreground"
              style={{ lineHeight: 1.7 }}
            >
              {t("subtitle")}
            </p>
            <p
              className="text-left text-muted-foreground mb-10 italic"
              style={{ lineHeight: 1.7 }}
            >
              {t("intro")}
            </p>
          </motion.div>

          {/* Quick Links */}
       <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            {[
             { label: t("Resume"), icon: FileText, href: cv },
              { label: t("Github"), icon: Github, href: "https://github.com/varinsorlie" },
              { label: t("Linkedin"), icon: Linkedin, href: "https://www.linkedin.com/in/vårin-sørlie" },
              { label: t("Email"), icon: Mail, href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) =>
                  link.label === "Resume" ? openPdfInNewWindow(e, String(link.href)) : undefined
                }
                target={link.label === "Resume" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-full text-[0.8rem] tracking-wide text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
           <p className="text-muted-foreground text-[0.8rem] tracking-widest uppercase mb-2">
              {t("curatedLists")}
           </p>
          </motion.div>

          {/* List Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {allLists.map((list, i) => (
              <motion.div
                key={list.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={`/${list.slug}`}
                  className="group relative flex items-start gap-4 p-4 rounded-xl border border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-sm overflow-hidden"
                >
                  {/* Subtle color wash on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: list.color + "15" }}
                  />
                  <span
                    className="relative flex items-center justify-center w-10 h-10 rounded-lg shrink-0 text-[1.2rem]"
                    style={{ backgroundColor: list.color + "40" }}
                  >
                    {list.emoji}
                  </span>
                  <div className="relative flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[0.85rem] truncate">
                        {list.title}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <span className="text-[0.75rem] text-muted-foreground">
                      {list.items.length} picks
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Fun sign-off */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-16 p-6 rounded-xl border border-dashed border-border"
          >
            <p className="text-[0.85rem] text-muted-foreground italic" style={{ lineHeight: 1.7 }}>
              "The best way to know a city is to eat, walk, read, and swim your way through it."
            </p>
            <p className="text-[0.75rem] text-muted-foreground mt-2">
              — Me, justifying my hobbies
            </p>
          </motion.div> */}
        </div>
      </section>

      {/* Footer */}
       <footer className="px-6 py-8 text-center">
        <p className="text-[0.75rem] text-muted-foreground">
          {t("footer")}
        </p>
      </footer>
    </div>
  );
}
