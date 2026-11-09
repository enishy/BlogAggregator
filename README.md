# Gator – RSS Feed Aggregator

Gator is a command-line RSS feed aggregator built with TypeScript, Node.js, PostgreSQL and Drizzle ORM.

It allows users to register, follow RSS feeds, periodically fetch new posts and browse the latest publications from their followed feeds.

## Requirements

Before running Gator, make sure you have installed:

- **Node.js** (with npm).
- **PostgreSQL** – used to store users, feeds, follows and posts.
- **Git** – to clone and manage the project.

## Installation

Clone the repository:

```bash
git clone https://github.com/enishy/BlogAggregator.git
cd BlogAggregator
```

Install dependencies:

```bash
npm install
```

## Configuration

Gator requires a PostgreSQL database.

Create a database, for example:

```sql
CREATE DATABASE gator;
```

Create a configuration file named `.gatorconfig.json` in your home directory.

On Linux and macOS:

```bash
nano ~/.gatorconfig.json
```

On Windows, the file should be located at:

```text
%USERPROFILE%\.gatorconfig.json
```

Add the following configuration:

```json
{
  "db_url": "postgres://postgres:YOUR_PASSWORD@localhost:5432/gator?sslmode=disable",
  "current_user_name": ""
}
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

The application uses this file to store the database connection and the currently logged-in user.

## Database migrations

Run the database migrations:

```bash
npx drizzle-kit migrate
```

Make sure your database is running and the connection string is correct.

## Running Gator

Start the CLI using:

```bash
npm run start
```

### Available commands

#### User management

Register a new user:

```bash
npm run start register <username>
```

Log in as an existing user:

```bash
npm run start login <username>
```

List registered users:

```bash
npm run start users
```

#### RSS feeds

Add a feed:

```bash
npm run start addfeed "Hacker News" "https://hnrss.org/newest"
```

List all registered feeds:

```bash
npm run start feeds
```

Follow a feed:

```bash
npm run start follow "https://hnrss.org/newest"
```

Unfollow a feed:

```bash
npm run start unfollow "https://hnrss.org/newest"
```

List the feeds followed by the current user:

```bash
npm run start following
```

#### Aggregator

Start periodically fetching RSS feeds:

```bash
npm run start agg 1m
```

The duration argument supports:

- `500ms` – 500 milliseconds
- `5s` – 5 seconds
- `1m` – 1 minute
- `1h` – 1 hour

The aggregator continuously fetches the feeds that have gone the longest without being updated.

Press `Ctrl + C` to stop the aggregator.

#### Browse posts

Display the two latest posts from followed feeds:

```bash
npm run start browse
```

Display a custom number of posts:

```bash
npm run start browse 10
```

## How it works

1. Users register and log in.
2. Users add RSS feeds to the database.
3. Users follow feeds they want to read.
4. The aggregator periodically fetches feeds.
5. New posts are stored in PostgreSQL.
6. Users browse the latest posts from their followed feeds.

Duplicate posts are avoided using the unique URL constraint in the database.

## Technologies

- TypeScript
- Node.js
- PostgreSQL
- Drizzle ORM
- RSS Parser
- npm

## License

This project was created as part of a learning project.
