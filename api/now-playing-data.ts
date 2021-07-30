import { NowRequest, NowResponse } from "@vercel/node";
import { renderToString } from "react-dom/server";
import { decode } from "querystring";
import { Player } from "../components/NowPlaying2";
import { nowPlaying } from "../utils/spotify";

export default async function (req: NowRequest, res: NowResponse) {
  const {
    item = {},
    is_playing: isPlaying = false,
    progress_ms: progress = 0,
  } = await nowPlaying();

  res.setHeader("Content-Type", "application/jsonl");

  const { duration_ms: duration, name: track } = item;
  const { images = [] } = item.album || {};

  const cover = images[images.length - 1]?.url;
  let coverImg = null;
  if (cover) {
    const buff = await (await fetch(cover)).arrayBuffer();
    coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
  }

  return res.status(200).send({progress,duration,name,track,cover});
}
