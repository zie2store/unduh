const { spawn } = require("child_process");
const path = require("path");

module.exports = (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing ?url parameter");

  const binaryPath = path.join(__dirname, "bin/yt-dlp");

  const child = spawn(binaryPath, [
    url,
    "-o", "-",
    "--merge-output-format", "mp4",
    "-f", "best"
  ]);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", "attachment; filename=video.mp4");

  child.stdout.pipe(res);

  child.stderr.on("data", d => console.error("yt-dlp:", d.toString()));
};
