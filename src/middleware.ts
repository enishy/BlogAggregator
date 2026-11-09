import { getUser } from "./lib/db/queries/users";
import { readConfig } from "./config";
import type { User } from "./lib/db/schema";
import type { CommandHandler } from "./commands";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type MiddlewareLoggedIn = (
  handler: UserCommandHandler
) => CommandHandler;

export const middlewareLoggedIn: MiddlewareLoggedIn = (handler) => {
  return async (cmdName, ...args) => {
    const config = readConfig();

    if (!config.currentUserName) {
      throw new Error("You must be logged in to run this command");
    }

    const user = await getUser(config.currentUserName);

    if (!user) {
      throw new Error("Current user not found");
    }

    await handler(cmdName, user, ...args);
  };
};
