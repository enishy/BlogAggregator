import { getFeeds } from "./lib/db/queries/feeds";

export async function handlerFeeds(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  try {
    const feeds = await getFeeds();

    for (const feed of feeds) {
      console.log(`Feed: ${feed.feeds.name}`);
      console.log(`URL: ${feed.feeds.url}`);
      console.log(`User: ${feed.users.name}`);
      console.log("");
    }

    process.exit(0);
  } catch (error) {
    console.error("Failed to get feeds:", error);
    process.exit(1);
  }
}
