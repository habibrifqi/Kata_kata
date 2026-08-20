import { getSession } from "@/lib/session";
import FavoritesClient from "./FavoritesClient";

export default async function FavoritesPage() {
  const session = await getSession();

  return <FavoritesClient user={session} />;
}
