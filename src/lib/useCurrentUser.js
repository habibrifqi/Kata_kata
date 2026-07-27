"use client";

import { useState, useEffect } from "react";

/**
 * Hook untuk mendapatkan session user yang sedang login.
 * Fetch dari /api/auth/me — ringan karena hanya baca cookie server-side.
 *
 * @returns {{ user: object|null, isLoading: boolean }}
 */
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { user, isLoading };
}
