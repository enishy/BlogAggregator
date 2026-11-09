import { getPostsForUser } from "./lib/db/queries/posts";
import type { User } from "./lib/db/schema";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length > 1) {
    throw new Error("Usage: browse [limit]");
  }

  let limit = 2;

  if (args.length === 1) {
    limit = Number(args[0]);

    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error("Limit must be a positive integer");
    }
  }

  const posts = await getPostsForUser(user.id, limit);

  if (posts.length === 0) {
    console.log("No posts found.");
    return;
  }

  for (const post of posts) {
    console.log(`Title: ${post.title}`);
    console.log(`URL: ${post.url}`);
    console.log(`Description: ${post.description ?? "No description"}`);
    console.log(
      `Published: ${post.publishedAt?.toISOString() ?? "Unknown"}`
    );
    console.log(`Feed: ${post.feedName}`);
    console.log("-----------------------------------");
  }
}
