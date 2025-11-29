import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { cryptoAgent } from "./agents/gasAgent";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";

export const mastra = new Mastra({
  agents: { cryptoAgent },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  deployer: new CloudflareDeployer({
    projectName: "hello-mastra",
  }),
});
