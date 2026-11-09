import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
  };
  items: RSSItem[];
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  // 1. Fetch the RSS feed
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch feed: ${response.status} ${response.statusText}`
    );
  }

  const xmlData = await response.text();

  // 2. Parse the XML
  const parser = new XMLParser({
    processEntities: false,
  });

  const parsedData = parser.parse(xmlData);

  // 3. Extract channel
  const channel = parsedData?.rss?.channel;

  if (!channel || typeof channel !== "object") {
    throw new Error("Invalid RSS feed: missing channel");
  }

  // 4. Extract channel metadata
  const { title, link, description } = channel;

  if (
    typeof title !== "string" ||
    typeof link !== "string" ||
    typeof description !== "string"
  ) {
    throw new Error("Invalid RSS feed: missing channel metadata");
  }

  // 5. Extract feed items
  let items: RSSItem[] = [];

  if (channel.item) {
    const rawItems = Array.isArray(channel.item)
      ? channel.item
      : [channel.item];

    items = rawItems
      .filter((item: any) => {
        return (
          typeof item.title === "string" &&
          typeof item.link === "string" &&
          typeof item.description === "string" &&
          typeof item.pubDate === "string"
        );
      })
      .map((item: any): RSSItem => ({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      }));
  }

  // 6. Assemble RSSFeed
  return {
    channel: {
      title,
      link,
      description,
    },
    items,
  };
}
