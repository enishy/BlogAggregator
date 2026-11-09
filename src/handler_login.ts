import { setUser } from "./config.js";
import { getUser } from "./lib/db/queries/users";
import { setUser } from "./config";

export async function handlerLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length < 1) {
    throw new Error("Username is required");
  }

  const username = args[0];

  const user = await getUser(username);

  if (!user) {
    throw new Error(`User ${username} does not exist`);
  }

  await setUser(username);

  console.log(`User ${username} has been logged in.`);
}
