import { db } from "..";
import { feeds, users, feedFollows } from "../schema";
import { and, eq, sql } from "drizzle-orm";

export async function getFeeds() {
  const result = await db
    .select()
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));

  return result;
}

export async function createFeed(
  name: string,
  url: string,
  userId: string
) {
  const [feed] = await db
    .insert(feeds)
    .values({
      name,
      url,
      userId,
    })
    .returning();

  return feed;
}

export async function getFeedByURL(url: string) {
  const [feed] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));

  return feed;
}

export async function createFeedFollow(
  userId: string,
  feedId: string
) {
  const [feedFollow] = await db
    .insert(feedFollows)
    .values({
      userId,
      feedId,
    })
    .returning();

  const [result] = await db
    .select()
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, feedFollow.id));

  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select()
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

  return result;
}

export async function deleteFeedFollow(
  userId: string,
  feedId: string
) {
  const [deletedFeedFollow] = await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.userId, userId),
        eq(feedFollows.feedId, feedId)
      )
    )
    .returning();

  return deletedFeedFollow;
}

export async function markFeedFetched(feedId: string) {
  const now = new Date();

  const [feed] = await db
    .update(feeds)
    .set({
      lastFetchedAt: now,
      updatedAt: now,
    })
    .where(eq(feeds.id, feedId))
    .returning();

  return feed;
}

export async function getNextFeedToFetch() {
  const [feed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
    .limit(1);

  return feed;
}
