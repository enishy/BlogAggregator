import { createUser, getUser } from "../lib/db/queries/users";
import { setUser } from "../config";

export async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length < 1) {
    throw new Error("Username is required");
  }

  const username = args[0];

  const existingUser = await getUser(username);

  if (existingUser) {
    throw new Error(`User ${username} already exists`);
  }

  const user = await createUser(username);

  await setUser(username);

  console.log(`User ${username} was created successfully!`);
  console.log(user);
}
