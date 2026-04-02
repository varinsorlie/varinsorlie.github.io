import { useParams, Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MessageCircle, Table, List, MapPin, X } from "lucide-react";
// import { allLists } from "./list-data";
import { ImageWithFallback } from "./figma/ImageWithFallback.js";

import { getList } from "../data/api.js";

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export function ListPage() {
  const { slug } = useParams();

  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "table">("list");
  const [activeFilter, setActiveFilter] = useState<{ key: string; value: string } | null>(null);

  useEffect(() => {
    if (slug) {
      getList(slug)
        .then(setList)
        .finally(() => setLoading(false));
    }
  }, [slug]);


  

  // ✅ MOVE useMemo ABOVE returns
  const filteredItems = useMemo(() => {
    if (!list) return [];
    if (!activeFilter) return list.items;

    return list.items.filter(
      (item: any) => item.meta?.[activeFilter.key] === activeFilter.value
    );
  }, [list, activeFilter]);

  // ✅ Now it's safe to return early
  if (loading) return <p>Loading...</p>;
  if (!list) return <p>List not found</p>;

  const hasTable =
    !!list.tableColumns &&
    list.items.some((item: any) => item.meta);

  const handleFilterClick = (key: string, value: string) => {
    if (activeFilter?.key === key && activeFilter?.value === value) {
      setActiveFilter(null);
    } else {
      setActiveFilter({ key, value });
    }
  };

  const getColumnLabel = (key: string) => {
    return list.tableColumns?.find((c: any) => c.key === key)?.label || key;
  };

  const getColumnEmoji = (key: string) => {
    return list.tableColumns?.find((c: any) => c.key === key)?.emoji || "";
  };

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[4rem] mb-4">🤷</p>
          <h1
            className="text-[2rem] mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Page not found
          </h1>
          <p className="text-muted-foreground mb-6 text-[0.9rem]">
            I probably moved something. Sorry about that.
          </p>
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-1 py-1 md:py-1">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative rounded-2xl overflow-hidden mb-10 aspect-[2/1]"
      >
        <ImageWithFallback
          src={list.image}
          alt={list.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <span className="text-[2.5rem]">{list.emoji}</span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <h1
          className="text-[2rem] md:text-[2.5rem] tracking-tight mb-3"
          style={{
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.15,
          }}
        >
          {list.title}
        </h1>
        <p className="text-muted-foreground" style={{ lineHeight: 1.6 }}>
          {list.subtitle}
        </p>
      </motion.div>

      {/* Personal story */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10 p-5 rounded-xl border border-dashed border-border"
        style={{ backgroundColor: list.color + "10" }}
      >
        <div className="flex items-start gap-3">
          <MessageCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p
            className="text-[0.9rem] text-muted-foreground italic"
            style={{ lineHeight: 1.7 }}
          >
            {list.story}
          </p>
        </div>
      </motion.div>

      {/* Controls bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="flex items-center justify-between mb-4"
      >
        <p className="text-[0.8rem] text-muted-foreground">
          {activeFilter ? (
            <span>
              Showing {filteredItems.length} of {list.items.length}
            </span>
          ) : (
            <span>{list.items.length} places</span>
          )}
        </p>
        {hasTable && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] transition-all ${
                viewMode === "list"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] transition-all ${
                viewMode === "table"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Compare
            </button>
          </div>
        )}
      </motion.div>

      {/* Active filter chip */}
      <AnimatePresence>
        {activeFilter && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.75rem] text-muted-foreground">
                Filtered by:
              </span>
              <button
                onClick={() => setActiveFilter(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.75rem] border transition-all hover:border-foreground/30"
                style={{
                  backgroundColor: list.color + "25",
                  borderColor: list.color + "60",
                }}
              >
                <span>
                  {getColumnEmoji(activeFilter.key)}{" "}
                  {getColumnLabel(activeFilter.key)}:
                </span>
                <span className="font-medium">{activeFilter.value}</span>
                <X className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE VIEW */}
      {hasTable && viewMode === "table" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-[0.8rem]">
              <thead>
                <tr
                  className="border-b border-border"
                  style={{ backgroundColor: list.color + "15" }}
                >
                  <th className="text-left px-4 py-3 text-muted-foreground text-[0.7rem] tracking-wider uppercase">
                    Place
                  </th>
                  {list.tableColumns.map((col: any) => (
                    <th
                      key={col.key}
                      className="text-left px-4 py-3 text-muted-foreground text-[0.7rem] tracking-wider uppercase whitespace-nowrap"
                    >
                      <span className="mr-1">{col.emoji}</span> {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item: any, i: any) => (
                  <tr
                    key={item.name}
                    className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${
                      i % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-[0.7rem] tabular-nums w-5">
                            {String(
                              list.items.indexOf(item) + 1
                            ).padStart(2, "0")}
                          </span>
                          <span
                            style={{
                              fontFamily: "'DM Serif Display', serif",
                            }}
                          >
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 ml-7 text-[0.7rem] text-muted-foreground">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <a
                            href={mapsUrl(item.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate max-w-[180px] text-blue-500 hover:underline"
                          >
                            {item.address}
                          </a>
                        </div>
                      </div>
                    </td>
                    {list.tableColumns.map((col: any) => {
                      const val = item.meta?.[col.key] || "—";
                      const isActive =
                        activeFilter?.key === col.key &&
                        activeFilter?.value === val;
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-3 whitespace-nowrap"
                        >
                          <button
                            onClick={() =>
                              val !== "—" && handleFilterClick(col.key, val)
                            }
                            className={`px-2 py-0.5 rounded-md text-[0.78rem] transition-all ${
                              val === "—"
                                ? "text-muted-foreground cursor-default"
                                : isActive
                                ? "text-foreground ring-1 ring-foreground/30"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                            }`}
                            style={
                              isActive
                                ? { backgroundColor: list.color + "30" }
                                : {}
                            }
                            disabled={val === "—"}
                          >
                            {val}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item: any, i: any) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="rounded-xl border border-border overflow-hidden"
              >
                <div
                  className="px-4 py-3"
                  style={{ backgroundColor: list.color + "15" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-[0.7rem] tabular-nums">
                      {String(list.items.indexOf(item) + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-[0.9rem]"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 ml-6 text-[0.7rem] text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <a
                      href={mapsUrl(item.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-blue-500 hover:underline"
                    >
                      {item.address}
                    </a>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {list.tableColumns.map((col: any) => {
                    const val = item.meta?.[col.key] || "—";
                    const isActive =
                      activeFilter?.key === col.key &&
                      activeFilter?.value === val;
                    return (
                      <div
                        key={col.key}
                        className="flex items-center justify-between text-[0.8rem]"
                        
                      >
                        <span className="text-muted-foreground">
                          {col.emoji} {col.label}
                        </span>
                        <button
                          onClick={() =>
                            val !== "—" && handleFilterClick(col.key, val)
                          }
                          className={`px-2 py-0.5 rounded-md transition-all ${
                            val === "—"
                              ? "text-muted-foreground cursor-default"
                              : isActive
                              ? "text-foreground ring-1 ring-foreground/30"
                              : "text-foreground hover:bg-muted/50 cursor-pointer"
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: list.color + "30" }
                              : {}
                          }
                          disabled={val === "—"}
                        >
                          {val}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-[0.9rem]">
                No matches for this filter.
              </p>
              <button
                onClick={() => setActiveFilter(null)}
                className="mt-2 text-[0.8rem] underline text-muted-foreground hover:text-foreground"
              >
                Clear filter
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item: any) => {
              const originalIndex = list.items.indexOf(item);
              return (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group border-t border-border"
                >
                  <div className="py-6 md:py-8 text-left">
                    <div className="flex items-start gap-4 md:gap-6">
                      <span className="text-[0.8rem] text-muted-foreground tabular-nums mt-0.5 w-6 shrink-0">
                        {String(originalIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-[1.05rem] mb-1"
                          style={{
                            fontFamily: "'DM Serif Display', serif",
                          }}
                        >
                          {item.name}
                        </h3>

                        {/* Address */}
                        <div className="flex items-center gap-1.5 mb-2 text-[0.78rem] text-muted-foreground">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <a
                            href={mapsUrl(item.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-blue-500 hover:underline"
                          >
                            {item.address}
                          </a>
                        </div>

                        <p
                          className="text-muted-foreground text-[0.9rem] mb-3"
                          style={{ lineHeight: 1.6 }}
                        >
                          {item.description}
                        </p>

                        {/* Clickable meta badges */}
                        {item.meta && list.tableColumns && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {list.tableColumns.map((col: any) => {
                              const val = item.meta?.[col.key];
                              if (!val) return null;
                              const isActive =
                                activeFilter?.key === col.key &&
                                activeFilter?.value === val;
                              return (
                                <button
                                  key={col.key}
                                  onClick={() =>
                                    handleFilterClick(col.key, val)
                                  }
                                  className={`inline-flex items-center gap-1 text-[0.7rem] px-2 py-1 rounded-md border transition-all cursor-pointer ${
                                    isActive
                                      ? "border-foreground/30 text-foreground shadow-sm"
                                      : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                                  }`}
                                  style={
                                    isActive
                                      ? {
                                          backgroundColor: list.color + "35",
                                        }
                                      : {}
                                  }
                                  title={`Filter by ${getColumnLabel(col.key)}: ${val}`}
                                >
                                  <span>{col.emoji}</span>
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {item.detail && (
                          <p
                            className="text-[0.8rem] px-3 py-1.5 rounded-full inline-block mb-2"
                            style={{
                              backgroundColor: list.color + "30",
                              color: "inherit",
                            }}
                          >
                            {item.detail}
                          </p>
                        )}
                        {item.personalNote && (
                          <p className="text-[0.8rem] text-muted-foreground italic mt-2 pl-3 border-l-2 border-border">
                            {item.personalNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 border-t border-border">
              <p className="text-muted-foreground text-[0.9rem]">
                No matches for this filter.
              </p>
              <button
                onClick={() => setActiveFilter(null)}
                className="mt-2 text-[0.8rem] underline text-muted-foreground hover:text-foreground"
              >
                Clear filter
              </button>
            </div>
          )}

          {filteredItems.length > 0 && (
            <div className="border-t border-border" />
          )}
        </div>
      )}

      {/* Closing note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-10 mb-16 p-5 rounded-xl bg-muted/30"
      >
        <p
          className="text-[0.85rem] text-muted-foreground"
          style={{ lineHeight: 1.7 }}
        >
          <span className="not-italic">✏️</span>{" "}
          <span className="italic">{list.closingNote}</span>
        </p>
      </motion.div>

      {/* Footer nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-[0.8rem] text-muted-foreground tracking-widest uppercase mb-4">
          More lists
        </p>
        <div className="flex flex-wrap gap-2">
         
          {/* {allLists
            .filter((l) => l.slug !== slug)
            .map((l) => ( */}
            {list.items.map((l: any) => (
              <Link
                key={l.name}
                to={mapsUrl(l.address)}
                className="px-3 py-1.5 text-[0.8rem] border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                onClick={() => setActiveFilter(null)}
              >
                {l.name}
              </Link>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
