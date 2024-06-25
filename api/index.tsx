import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { pinata } from "frog/hubs";
import { handle } from "frog/vercel";
import { baseSepolia } from "viem/chains";
import { betMemeAbi } from "../betMemeABI.js";

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: pinata(),
});

app.frame("/approve/:gameId", (c) => {
  const gameId = c.req.param("gameId");

  return c.res({
    action: `/${gameId}`,
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Approve your account with tokens
      </div>
    ),
    intents: [
      <TextInput placeholder="Approve Amount Value" />,
      <Button.Transaction target="/approve">APPROVE</Button.Transaction>,
    ],
  });
});

app.transaction("/approve", async (c) => {
  const { inputText } = c;

  const approveTx = await c.contract({
    abi: betMemeAbi,
    functionName: "approve",
    args: [
      "0x9c440521dF71e1242B8d1aEB9556EfE5c7a04867",
      parseEther(inputText || "0"),
    ],
    chainId: `eip155:${baseSepolia.id}`,
    to: "0xBE5Da172BbffffF5AEa27017745e71eA1907dad1",
  });

  if (approveTx.status !== "success") {
    throw new Error("Approve transaction failed");
  }

  return approveTx;
});

app.frame("/:gameId", (c) => {
  const gameId = c.req.param("gameId");

  return c.res({
    action: "/finish",
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Bet your game
      </div>
    ),
    intents: [
      <TextInput placeholder="Bet Value" />,
      <Button.Transaction target={`/${gameId}/up`}>UP</Button.Transaction>,
      <Button.Transaction target={`/${gameId}/down`}>DOWN</Button.Transaction>,
    ],
  });
});

app.frame("/finish", (c) => {
  const { transactionId } = c;
  return c.res({
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    ),
  });
});

app.transaction("/:gameId/:status", async (c) => {
  const { gameId, status } = c.req.param();
  const uint256GameId = BigInt(gameId);
  const { inputText } = c;

  const betUp = status === "up" ? true : false;

  const betTx = await c.contract({
    abi: betMemeAbi,
    functionName: "bet",
    args: [uint256GameId, betUp, parseEther(inputText || "0")],
    chainId: `eip155:${baseSepolia.id}`,
    to: "0x9c440521dF71e1242B8d1aEB9556EfE5c7a04867",
  });

  if (betTx.status !== "success") {
    throw new Error("Bet transaction failed");
  }

  return betTx;
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
