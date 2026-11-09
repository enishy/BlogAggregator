
import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: unknown): Config {
  if (
    typeof rawConfig !== "object" ||
    rawConfig === null ||
    !("db_url" in rawConfig) ||
    typeof rawConfig.db_url !== "string"
  ) {
    throw new Error("Invalid config: db_url must be a string");
  }

  if (
    "current_user_name" in rawConfig &&
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error(
      "Invalid config: current_user_name must be a string"
    );
  }

  return {
    dbUrl: rawConfig.db_url,
    currentUserName:
      "current_user_name" in rawConfig
        ? rawConfig.current_user_name as string
        : "",
  };
}

function writeConfig(cfg: Config): void {
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  fs.writeFileSync(
    getConfigFilePath(),
    JSON.stringify(rawConfig, null, 2),
    "utf-8"
  );
}

export function readConfig(): Config {
  const configFilePath = getConfigFilePath();
  const contents = fs.readFileSync(configFilePath, "utf-8");
  const rawConfig: unknown = JSON.parse(contents);

  return validateConfig(rawConfig);
}

export function setUser(userName: string): void {
  const config = readConfig();

  config.currentUserName = userName;

  writeConfig(config);
}

