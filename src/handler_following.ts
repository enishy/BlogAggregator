import { getFeedFollowsForUser } from "./lib/db/queries/feeds";

import type { User } from "./lib/db/schema";

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  const feeds = await getFeedFollowsForUser(user.id);

  console.log(`${user.name} is following:`);

  for (const feed of feeds) {
    console.log(`* ${feed.feeds.name}`);
  }
}
