import { deleteAllUsers } from "./lib/db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

type CommandsRegistry = Record<string, CommandHandler>;

const commands: CommandsRegistry = {};

export function registerCommand(
  commandName: string,
  handler: CommandHandler
): void {
  commands[commandName] = handler;
}

export async function runCommand(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = commands[cmdName];

  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(cmdName, ...args);
}

export async function handlerReset(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  try {
    await deleteAllUsers();
    console.log("All users have been deleted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to reset the database:", error);
    process.exit(1);
  }
}

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type MiddlewareLoggedIn = (
  handler: UserCommandHandler
) => CommandHandler;
