import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { pinata } from "frog/hubs";
import { handle } from "frog/vercel";
import { baseSepolia } from "viem/chains";
import { betMemeAbi } from "../betMemeABI.js";
import { changeBg, changeTokenInfo } from "../functions/changeTokenInfo.js";

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

app.frame("/finish", (c) => {
  return c.res({
    image: (
      <img
        src="https://github.com/juniahn-dev/twitter/blob/main/assets/card-tx-bg.png?raw=true"
        style={{ position: "absolute", top: 0, left: 0 }}
        width="1200"
        height="630"
      />
    ),
    intents: [
      <Button.Link href="https://bet-meme-base.vercel.app">
        GO TO BetMeme
      </Button.Link>,
    ],
  });
});

app.frame("/approve/:gameId/:token/:time", (c) => {
  const { gameId, token, time } = c.req.param();
  const times = new Date(Number(time) * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = times.getFullYear();
  const date = times.getDate();
  const month = months[times.getMonth()];
  const hour = times.getHours();
  const minute = times.getMinutes();
  const fullDate = `${date}, ${month}, ${year} ${hour}:${minute}`;

  return c.res({
    action: `/${gameId}/${token}/time/${time}`,
    image: (
      <>
        <img
          src={changeBg(token, true).background}
          style={{ position: "absolute", top: 0, left: 0 }}
          width="1200"
          height="630"
        />
        {changeBg(token, true).mainInfo && (
          <img
            src={changeBg(token, true).mainInfo!}
            style={{ position: "absolute", top: 0, left: 0 }}
            width="1200"
            height="630"
          />
        )}
        {!changeBg(token, true).mainInfo && (
          <img
            src={changeTokenInfo(token).image}
            style={{
              position: "absolute",
              bottom: "-320",
              right: "54%",
              borderRadius: "50%",
            }}
            width="150px"
            height="150px"
          />
        )}
        {!changeBg(token, true).mainInfo && (
          <div
            style={{
              position: "absolute",
              bottom: "-290",
              right: "35%",
              fontSize: 70,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {changeTokenInfo(token).denom}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "-555",
            right: "56%",

            padding: "10px",
            border: "2px solid #fff",
            borderRadius: "30px",

            fontSize: 25,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          End Time
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-545",
            right: "32%",
            fontSize: 30,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {fullDate}
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
      "0x3D50b0272c674CEF774738D0CEedDF095C13f9d2",
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

app.frame("/:gameId/:token/time/:time", (c) => {
  const { gameId, token, time } = c.req.param();
  const times = new Date(Number(time) * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = times.getFullYear();
  const date = times.getDate();
  const month = months[times.getMonth()];
  const hour = times.getHours();
  const minute = times.getMinutes();
  const fullDate = `${date}, ${month}, ${year} ${hour}:${minute}`;

  return c.res({
    action: "/finish",
    image: (
      <>
        <img
          src={changeBg(token).background}
          style={{ position: "absolute", top: 0, left: 0 }}
          width="1200"
          height="630"
        />
        {changeBg(token).mainInfo && (
          <img
            src={changeBg(token).mainInfo!}
            style={{ position: "absolute", top: 0, left: 0 }}
            width="1200"
            height="630"
          />
        )}
        {!changeBg(token).mainInfo && (
          <img
            src={changeTokenInfo(token).image}
            style={{
              position: "absolute",
              bottom: "-320",
              right: "54%",
              borderRadius: "50%",
            }}
            width="150px"
            height="150px"
          />
        )}
        {!changeBg(token).mainInfo && (
          <div
            style={{
              position: "absolute",
              bottom: "-290",
              right: "35%",
              fontSize: 70,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {changeTokenInfo(token).denom}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "-555",
            right: "56%",

            padding: "10px",
            border: "2px solid #fff",
            borderRadius: "30px",

            fontSize: 25,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          End Time
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-545",
            right: "32%",
            fontSize: 30,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {fullDate}
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
    to: "0x3D50b0272c674CEF774738D0CEedDF095C13f9d2",
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
