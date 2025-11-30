import express from "express";
import { spawn } from "child_process";

const app = express();

app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing ?url parameter");

  const ytdlp = spawn("yt-dlp", [
    url,
    "-o", "-",
    "--merge-output-format", "mp4"
  ]);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", "attachment; filename=video.mp4");

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", (data) => {
    console.log("yt-dlp:", data.toString());
  });

  ytdlp.on("close", (code) => {
    console.log("yt-dlp exited with code", code);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on", PORT));
