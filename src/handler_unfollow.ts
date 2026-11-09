import {
  getFeedByURL,
  deleteFeedFollow,
} from "./lib/db/queries/feeds";

import type { User } from "./lib/db/schema";

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("Usage: unfollow <url>");
  }

  const [url] = args;

  // Find feed by URL
  const feed = await getFeedByURL(url);

  if (!feed) {
    throw new Error(`Feed not found: ${url}`);
  }

  // Delete follow relationship
  const deletedFeedFollow = await deleteFeedFollow(
    user.id,
    feed.id
  );

  if (!deletedFeedFollow) {
    throw new Error("You are not following this feed");
  }

  console.log(
    `${user.name} is no longer following ${feed.name}`
  );
}
