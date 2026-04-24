import express from "express";
import cors from "cors";
import { connectDB } from "./db.ts";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: [
      "https://varinsorlie.github.io",
      "http://localhost:5173"
    ],
  })
);
app.use(express.json());
// Add caching headers for static data
app.use((req, res, next) => {
  if (req.method === "GET") {
    // Cache for 1 hour (3600 seconds)
    res.set("Cache-Control", "public, max-age=3600");
  }
  next();
});

async function startServer() {
  const db = await connectDB();
  const listsCollection = db.collection("lists");
  const travelTipsCollection = db.collection("travelTips");

  // Simple in-memory cache
  const cache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  function getCache(key) {
    const data = cache.get(key);
    if (data && Date.now() - data.timestamp < CACHE_TTL) {
      return data.value;
    }
    cache.delete(key);
    return null;
  }

  function setCache(key, value) {
    cache.set(key, { value, timestamp: Date.now() });
  }

  // GET all lists
  app.get("/lists", async (req, res) => {
    try {
      const cached = getCache("lists:all");
      if (cached) {
        return res.json(cached);
      }
      
      const lists = await listsCollection.find({}).toArray();
      setCache("lists:all", lists);
      res.json(lists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lists" });
    }
  });

  // GET list by slug
  app.get("/lists/:slug", async (req, res) => {
    try {
      const cacheKey = `lists:${req.params.slug}`;
      const cached = getCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }
      
      const list = await listsCollection.findOne({ slug: req.params.slug });
      if (!list) return res.status(404).json({ error: "List not found" });
      
      setCache(cacheKey, list);
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch list" });
    }
  });

  // GET all travel tips
  app.get("/traveltips", async (req, res) => {
    try {
      const cached = getCache("traveltips:all");
      if (cached) {
        return res.json(cached);
      }
      
      const tips = await travelTipsCollection.find({}).toArray();
      setCache("traveltips:all", tips);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch travel tips" });
    }
  });

  // GET travel tip by slug
  app.get("/traveltips/:slug", async (req, res) => {
    try {
      const cacheKey = `traveltips:${req.params.slug}`;
      const cached = getCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }
      
      const tip = await travelTipsCollection.findOne({ slug: req.params.slug });
      if (!tip) return res.status(404).json({ error: "Travel tip not found" });
      
      setCache(cacheKey, tip);
      res.json(tip);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch travel tip" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();