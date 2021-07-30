import {NowRequest, NowResponse} from "@vercel/node";
import {nowPlaying} from "../utils/spotify";

export default async function (req: NowRequest, res: NowResponse) {
  const {
    item = {},
    is_playing: isPlaying = false,
    progress_ms: progress = 0,
  } = await nowPlaying();

  res.setHeader("Content-Type", "application/json");
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const {duration_ms: duration, name: track, artists,external_urls} = item;
  const {images = []} = item.album || {};
  let href = ""
  if (external_urls) href = external_urls.spotify

  const cover = images[images.length - 1]?.url;
  let coverImg = null;
  if (cover) {
    const buff = await (await fetch(cover)).arrayBuffer();
    coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
  }

  return res.status(200).json({href,isPlaying, progress, duration, track, cover, artists});
}
