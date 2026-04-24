const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Simple cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getFromCache(key) {
  const data = cache.get(key);
  if (data && Date.now() - data.timestamp < CACHE_TTL) {
    return data.value;
  }
  cache.delete(key);
  return null;
}

function setInCache(key, value) {
  cache.set(key, { value, timestamp: Date.now() });
}

// Get all lists
export async function getLists() {
  const cached = getFromCache("lists:all");
  if (cached) {
    return cached;
  }
  
  const res = await fetch(`${BASE_URL}/lists`);

  if (!res.ok) {
    throw new Error("Failed to fetch lists");
  }

  const data = await res.json();
  setInCache("lists:all", data);
  return data;
}

// Get one list
export async function getList(slug: string) {
  const cacheKey = `list:${slug}`;
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  const res = await fetch(`${BASE_URL}/lists/${slug}`);

  if (!res.ok) {
    throw new Error("List not found");
  }

  const data = await res.json();
  setInCache(cacheKey, data);
  return data;
}



export async function getTravelTips() {
  const cached = getFromCache("traveltips:all");
  if (cached) {
    return cached;
  }
  
  const res = await fetch(`${BASE_URL}/traveltips`)
  if (!res.ok) throw new Error("Failed to fetch travel tips")
  const data = await res.json();
  setInCache("traveltips:all", data);
  return data;
}

export async function getTravelTip(slug: string) {
  const cacheKey = `traveltip:${slug}`;
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  const res = await fetch(`${BASE_URL}/traveltips/${slug}`)
  if (!res.ok) throw new Error("Travel tip not found")
  const data = await res.json();
  setInCache(cacheKey, data);
  return data;
}