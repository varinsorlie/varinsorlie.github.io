import { motion } from "motion/react";
import { allLists } from "./list-data.js";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Blog() {
    return (
        <div className="min-h-screen flex flex-col items-center ">
            
        {/* Divider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                <p className="text-left text-muted-foreground text-[0.8rem] mb-8 tracking-widest uppercase mb-2">
                Blog
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
                      {list.items.length} valgte
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div> 
        </div>
    );
}