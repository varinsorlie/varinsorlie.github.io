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

async function startServer() {
  const db = await connectDB();
  const listsCollection = db.collection("lists");

  // GET all lists
  app.get("/lists", async (req, res) => {
    try {
      const lists = await listsCollection.find().toArray();
      res.json(lists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lists" });
    }
  });

  // GET list by slug
  app.get("/lists/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const list = await listsCollection.findOne({ slug });

      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }

      res.json(list);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch list" });
    }
  });

  // OPTIONAL: filter by category (future-proofing)
  app.get("/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const lists = await listsCollection.find({ category }).toArray();

      res.json(lists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();