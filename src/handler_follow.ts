import {
  getFeedByURL,
  createFeedFollow,
} from "./lib/db/queries/feeds";

import type { User } from "./lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("Usage: follow <url>");
  }

  const [url] = args;

  const feed = await getFeedByURL(url);

  if (!feed) {
    throw new Error(`Feed not found: ${url}`);
  }

  const result = await createFeedFollow(user.id, feed.id);

  console.log(
    `${result.users.name} is now following ${result.feeds.name}`
  );
}
