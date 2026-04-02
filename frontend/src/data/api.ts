const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Get all lists
export async function getLists() {
  const res = await fetch(`${BASE_URL}/lists`);

  if (!res.ok) {
    throw new Error("Failed to fetch lists");
  }

  return res.json();
}

// Get one list
export async function getList(slug: string) {
  const res = await fetch(`${BASE_URL}/lists/${slug}`);

  if (!res.ok) {
    throw new Error("List not found");
  }

  return res.json();
}



export async function getTravelTips() {
  const res = await fetch(`${BASE_URL}/traveltips`)
  if (!res.ok) throw new Error("Failed to fetch travel tips")
  return res.json()
}

export async function getTravelTip(slug: string) {
  const res = await fetch(`${BASE_URL}/traveltips/${slug}`)
  if (!res.ok) throw new Error("Travel tip not found")
  return res.json()
}