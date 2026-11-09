import {
  registerCommand,
  runCommand,
  type CommandsRegistry,
} from "./commands.js";

import { handlerLogin } from "./handler_login.js";

async function main(): Promise<void> {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Not enough arguments provided");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
  await runCommand(registry, cmdName, ...cmdArgs);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

main();

