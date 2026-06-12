import { useState, useEffect, useCallback } from "react";

export interface RecentlyViewedItem {
  id: string;           // hostel.id (uuid)
  name: string;         // hostel.name
  image_url: string;    // hostel.image_url
  location: string;     // hostel.location
  price: number;        // cheapest room price (numeric)
  viewedAt: number;     // Date.now() timestamp
}

const STORAGE_KEY   = "skycobe_recently_viewed";
const MAX_STORED    = 50;   // cap total history
const HOME_STRIP_MAX = 7;   // shown on Home.tsx

function readFromStorage(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentlyViewedItem[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: RecentlyViewedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>(readFromStorage);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setItems(readFromStorage());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Call this when a user taps/clicks a hostel card anywhere in the app
  const recordView = useCallback((hostel: RecentlyViewedItem) => {
    setItems((prev) => {
      // Move to front if already exists, otherwise prepend
      const filtered = prev.filter((h) => h.id !== hostel.id);
      const updated  = [{ ...hostel, viewedAt: Date.now() }, ...filtered]
        .slice(0, MAX_STORED);
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }, []);

  return {
    allItems:   items,                        // full list (up to 50)
    stripItems: items.slice(0, HOME_STRIP_MAX), // first 7 for Home.tsx
    hasItems:   items.length > 0,
    recordView,
    clearHistory,
  };
}
