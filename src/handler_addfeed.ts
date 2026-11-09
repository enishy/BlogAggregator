import { createFeed } from "./lib/db/queries/feeds";
import { createFeedFollow } from "./lib/db/queries/feeds";


import { Feed, User } from "./lib/db/schema";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  try {
    // Validate arguments
    if (args.length !== 2) {
      throw new Error("Usage: addfeed <name> <url>");
    }

    const [name, url] = args;

    // Create the feed
    const feed = await createFeed(name, url, user.id);

    // Automatically follow the feed
    const feedFollow = await createFeedFollow(user.id, feed.id);

    // Print the result
    printFeed(feed, user);

console.log(
      `${feedFollow.users.name} is now following ${feedFollow.feeds.name}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to add feed:", error);
    process.exit(1);
  }
}

export function printFeed(feed: Feed, user: User): void {
  console.log("Feed created successfully!");
  console.log(`  ID:          ${feed.id}`);
  console.log(`  Created:     ${feed.createdAt}`);
  console.log(`  Updated:     ${feed.updatedAt}`);
  console.log(`  Name:        ${feed.name}`);
  console.log(`  URL:         ${feed.url}`);
  console.log(`  User:        ${user.name}`);
}
