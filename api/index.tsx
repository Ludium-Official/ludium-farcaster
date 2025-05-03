import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { pinata } from "frog/hubs";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import { commaNumber } from "../functions/utils.js";

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  imageOptions: {
    fonts: [
      {
        name: "Montserrat",
        weight: 400,
        source: "google",
      },
      {
        name: "Montserrat",
        weight: 600,
        source: "google",
      },
      {
        name: "Montserrat",
        weight: 700,
        source: "google",
        style: "italic",
      },
    ],
  },
  hub: pinata(),
});

app.frame("/programs/:title/:programId/:deadline/:price/:token", (c) => {
  const { title, programId, deadline, price, token } = c.req.param();
  const times = new Date(Number(deadline) * 1000);
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
  const fullDate = `${month} ${date}, ${year}`;

  return c.res({
    image: (
      <>
        <img
          src="https://github.com/Ludium-Official/ludium-farcaster/blob/main/assets/DarkBackground.png?raw=true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          width="1200"
          height="630"
        />
        <div
          style={{
            position: "absolute",
            bottom: "-230",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 40,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          New Program
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-350",
            left: "50%",
            transform: "translate(-50%, -50%)",

            width: "80%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",

            fontSize: 50,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-400",
            left: "50%",
            transform: "translate(-50%, -50%)",

            display: "flex",
            alignItems: "center",
            gap: "10px",

            fontSize: 30,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          <span>Price: </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span>{commaNumber(price)}</span>
            <span>{token}</span>
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-555",
            left: "50%",
            transform: "translate(-50%, -50%)",

            display: "flex",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <div
            style={{
              padding: "10px",
              border: "3px solid #fff",
              borderRadius: "30px",

              fontSize: 25,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            DEADLINE
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {fullDate}
          </div>
        </div>
      </>
    ),
    intents: [
      <Button.Link href={`https://www.ludium.world/programs/${programId}`}>
        Check Detail!
      </Button.Link>,
    ],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
