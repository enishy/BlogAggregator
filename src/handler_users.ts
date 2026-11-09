import { getUsers } from "./lib/db/queries/users";
import { readConfig } from "./config";

export async function handlerUsers(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const users = await getUsers();
  const config = readConfig();

  for (const user of users) {
    const current =
      user.name === config.currentUserName
        ? " (current)"
        : "";

    console.log(`* ${user.name}${current}`);
  }
}
