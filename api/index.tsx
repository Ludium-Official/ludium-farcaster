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
      <Button.Transaction target={`/${gameId}/upBet`}>UP</Button.Transaction>,
      <Button.Transaction target={`/${gameId}/downBet`}>
        DOWN
      </Button.Transaction>,
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

app.transaction("/:gameId/upBet", (c) => {
  const gameId = c.req.param("gameId");
  const uint256GameId = BigInt(gameId);
  const { inputText } = c;

  return c.contract({
    abi: betMemeAbi,
    functionName: "bet",
    args: [uint256GameId, true, parseEther(inputText || "0")],
    chainId: `eip155:${baseSepolia.id}`,
    to: "0x4a65BADe94B89214c243C4ea977B109d1Bc327Fb",
  });
});

app.transaction("/:gameId/downBet", (c) => {
  const gameId = c.req.param("gameId");
  const uint256GameId = BigInt(gameId);
  const { inputText } = c;

  return c.contract({
    abi: betMemeAbi,
    functionName: "bet",
    args: [uint256GameId, false, parseEther(inputText || "0")],
    chainId: `eip155:${baseSepolia.id}`,
    to: "0x4a65BADe94B89214c243C4ea977B109d1Bc327Fb",
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
