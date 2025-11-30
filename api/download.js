import { spawn } from "child_process";
import path from "path";

export default function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Missing ?url parameter");
  }

  const binaryPath = path.join(process.cwd(), "api/bin/yt-dlp");

  const process = spawn(binaryPath, [
    url,
    "-o", "-",
    "-f", "bestvideo+bestaudio/best"
  ]);

  // Headers for download
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", "attachment; filename=video.mp4");

  // Send video stream to client
  process.stdout.pipe(res);

  // Log stderr (important for debugging)
  process.stderr.on("data", (data) => {
    console.error("yt-dlp:", data.toString());
  });

  process.on("close", (code) => {
    console.log("yt-dlp exited with code", code);
  });
}
