import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { pinata } from "frog/hubs";
import { handle } from "frog/vercel";
import { baseSepolia } from "viem/chains";
import { betMemeAbi } from "../betMemeABI.js";
import { changeTokenInfo } from "../functions/changeTokenInfo.js";

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  imageOptions: {
    fonts: [
      {
        name: "Open Sans",
        weight: 400,
        source: "google",
      },
      {
        name: "Open Sans",
        weight: 700,
        source: "google",
      },
    ],
  },
  hub: pinata(),
});

app.frame("/approve/:gameId/:token", (c) => {
  const { gameId, token } = c.req.param();

  return c.res({
    action: `/${gameId}/${token}`,
    image: (
      <>
        <img
          src="https://github.com/juniahn-dev/twitter/blob/main/assets/card-bg.png?raw=true"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-280",
            left: "39%",
            fontSize: 50,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Approve your token
        </div>
        <img
          src={changeTokenInfo(token).image}
          style={{
            position: "absolute",
            bottom: "-420",
            right: "52%",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-400",
            right: "41%",
            fontSize: 50,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {changeTokenInfo(token).denom}
        </div>
      </>
    ),
    intents: [
      <TextInput placeholder="Approve Amount Value" />,
      <Button.Transaction target={`/approve/${token}`}>
        APPROVE
      </Button.Transaction>,
    ],
  });
});

app.transaction("/approve/:token", async (c) => {
  const { token } = c.req.param();
  const { inputText } = c;

  const approveTx = await c.contract({
    abi: betMemeAbi,
    functionName: "approve",
    args: [
      "0x9c440521dF71e1242B8d1aEB9556EfE5c7a04867",
      parseEther(inputText || "0"),
    ],
    chainId: `eip155:${baseSepolia.id}`,
    to: token as `0x${string}`,
  });

  if (approveTx.status !== "success") {
    throw new Error("Approve transaction failed");
  }

  return approveTx;
});

app.frame("/:gameId/:token", (c) => {
  const { gameId, token } = c.req.param();

  return c.res({
    action: "/finish",
    image: (
      <>
        <img
          src="https://github.com/juniahn-dev/twitter/blob/main/assets/card-bg.png?raw=true"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-280",
            left: "39%",
            fontSize: 50,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Let's Bet!!!
        </div>
        <img
          src={changeTokenInfo(token).image}
          style={{
            position: "absolute",
            bottom: "-420",
            right: "52%",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-400",
            right: "41%",
            fontSize: 50,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {changeTokenInfo(token).denom}
        </div>
      </>
    ),
    intents: [
      <TextInput placeholder="Bet Value" />,
      <Button.Transaction target={`/bet/${gameId}/up`}>UP</Button.Transaction>,
      <Button.Transaction target={`/bet/${gameId}/down`}>
        DOWN
      </Button.Transaction>,
    ],
  });
});

app.transaction("/bet/:gameId/:status", async (c) => {
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

app.frame("/finish", (c) => {
  return c.res({
    image: (
      <img
        src="https://github.com/juniahn-dev/twitter/blob/main/assets/card-tx-bg.png?raw=true"
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    ),
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
