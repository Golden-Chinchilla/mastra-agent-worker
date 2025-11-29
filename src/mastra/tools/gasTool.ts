import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import "dotenv/config";

const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

// 使用 V2 路径，并加上 chainid=1（Ethereum Mainnet）
const ETH_MAINNET_CHAIN_ID = 1;
const gasTrackerUrl = `https://api.etherscan.io/v2/api?chainid=${ETH_MAINNET_CHAIN_ID}&module=gastracker&action=gasoracle&apikey=${etherscanApiKey}`;

export const gasTool = createTool({
  id: "getGasPrice",
  description: "Get current gas price for Ethereum LastBlock",
  inputSchema: z.object({}), // 仍然不接收任何输入
  outputSchema: z
    .object({
      status: z.literal("1"),
      message: z.string(),
      result: z
        .object({
          LastBlock: z.string(),
          SafeGasPrice: z.string(),
          ProposeGasPrice: z.string(),
          FastGasPrice: z.string(),
          suggestBaseFee: z.string(),
          gasUsedRatio: z.string(),
        })
        .strict(),
    })
    .strict(),

  execute: async (_ctx: any) => {
    return await getGasPrice();
  },
});

const getGasPrice = async () => {
  return fetch(gasTrackerUrl, {
    method: "GET",
    // headers: { 'Accept': 'application/json' }, // 可选
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    })
    .then((data) => {
      // V2 的返回结构与示例中保持一致：
      // { status: "1", message: "OK", result: { LastBlock, SafeGasPrice, ... } }
      return {
        status: "1" as const,
        message: String(data.message),
        result: {
          LastBlock: String(data.result.LastBlock),
          SafeGasPrice: String(data.result.SafeGasPrice),
          ProposeGasPrice: String(data.result.ProposeGasPrice),
          FastGasPrice: String(data.result.FastGasPrice),
          suggestBaseFee: String(data.result.suggestBaseFee),
          gasUsedRatio: String(data.result.gasUsedRatio),
        },
      };
    })
    .catch((error) => {
      console.error("Error fetching gas price:", error);
      throw new Error("Failed to fetch gas price");
    });
};
