import { registerCommand, runCommand } from "./commands";
import { handlerLogin } from "./handler_login";
import { handlerRegister } from "./commands/register";
import { handlerReset } from "./commands";
import { handlerUsers } from "./handler_users";
import { handlerAgg } from "./handler_agg";
import { handlerAddFeed } from "./handler_addfeed";
import { handlerFeeds } from "./handler_feeds";
import { handlerFollow } from "./handler_follow";
import { handlerFollowing } from "./handler_following";
import { middlewareLoggedIn } from "./middleware";
import { handlerUnfollow } from "./handler_unfollow";
import { handlerBrowse } from "./handler_browse";

async function main(): Promise<void> {
  registerCommand("login", handlerLogin);
  registerCommand("register", handlerRegister);
  registerCommand("reset", handlerReset);
  registerCommand("users", handlerUsers);
  registerCommand("agg", handlerAgg);
  registerCommand("feeds", handlerFeeds);
  registerCommand("addfeed",middlewareLoggedIn(handlerAddFeed));
  registerCommand("follow",middlewareLoggedIn(handlerFollow));
  registerCommand("following",middlewareLoggedIn(handlerFollowing));
  registerCommand("unfollow",middlewareLoggedIn(handlerUnfollow));
  registerCommand("browse",middlewareLoggedIn(handlerBrowse));

  const args = process.argv.slice(2);

  if (args.length < 1) {
    throw new Error("No command provided");
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  await runCommand(cmdName, ...cmdArgs);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
