const { spawn } = require("child_process");
const path = require("path");

module.exports = (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Missing ?url parameter");
  }

  // Correct binary path for Vercel Serverless
  const binaryPath = path.join(__dirname, "bin/yt-dlp");

  // Spawn yt-dlp and stream output
  const child = spawn(binaryPath, [
    url,
    "-o", "-",
    "-f", "bestvideo+bestaudio/best"
  ]);

  // Set downloadable headers
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", "attachment; filename=video.mp4");

  // Stream video back to client
  child.stdout.pipe(res);

  // Log errors
  child.stderr.on("data", (data) => {
    console.error("yt-dlp:", data.toString());
  });

  child.on("close", (code) => {
    console.log("yt-dlp exited with code", code);
  });
};
