import {
  getNextFeedToFetch,
  markFeedFetched,
} from "./lib/db/queries/feeds";

import { fetchFeed } from "./rss";
import { createPost } from "./lib/db/queries/posts";

export async function handlerAgg(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  /*try {
    const feed = await fetchFeed(
      "https://www.wagslane.dev/index.xml"
    );

    console.log(JSON.stringify(feed, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Failed to fetch RSS feed:", error);
    process.exit(1);
  }*/

  if (args.length !== 1) {
    throw new Error("Usage: agg <time_between_reqs>");
  }

  const timeBetweenRequests = parseDuration(args[0]);

  console.log(
    `Collecting feeds every ${formatDuration(timeBetweenRequests)}`
  );

  function handleError(error: unknown) {
    console.error("Error scraping feeds:", error);
  }

  // Ejecutar inmediatamente
  scrapeFeeds().catch(handleError);

  // Continuar ejecutando periódicamente
  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  // Mantener el proceso activo hasta recibir SIGINT
  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function scrapeFeeds(): Promise<void> {
  const feed = await getNextFeedToFetch();

  if (!feed) {
    throw new Error("No feeds found");
  }

  console.log(`Scraping feed: ${feed.name}`);

  const rssFeed = await fetchFeed(feed.url);

  await markFeedFetched(feed.id);

  /*for (const item of rssFeed.items) {
    console.log(`Found post: ${item.title}`);
  }*/

  for (const item of rssFeed.items) {
  const publishedAtString = item.isoDate || item.pubDate;

  let publishedAt: Date | null = null;

  if (publishedAtString) {
    const parsedDate = new Date(publishedAtString);

    if (!Number.isNaN(parsedDate.getTime())) {
      publishedAt = parsedDate;
    }
  }

  const title = item.title;
  const url = item.link;

  if (!title || !url) {
    continue;
  }

  await createPost(
    title,
    url,
    item.contentSnippet || item.description || null,
    publishedAt,
    feed.id
  );

  console.log(`Saved post: ${title}`);
}
}

export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(
      "Invalid duration. Use a format like 500ms, 1s, 1m or 1h"
    );
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    default:
      throw new Error("Invalid duration unit");
  }
}

function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h${minutes % 60}m${seconds % 60}s`;
  }

  if (minutes > 0) {
    return `${minutes}m${seconds % 60}s`;
  }

  return `${seconds}s`;
}
