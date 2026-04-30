const { exec } = require("child_process");
const fs = require("fs");

const file = process.argv[2];

if (!file) {
  console.log("Thiếu file mp3");
  return;
}

/* ==========================
   RUN WHISPER
========================== */
exec(
  `whisper "${file}" --language Vietnamese --model base --output_format srt`,
  (err, stdout, stderr) => {
    if (err) {
  console.log("Lỗi whisper:");
  console.log(stderr);
  return;
}

    const srtFile = file.replace(".mp3", ".srt");

    const data = fs.readFileSync(srtFile, "utf8");

    const blocks = data.split("\n\n");

    let lyrics = [];

    blocks.forEach((block) => {
      const lines = block.split("\n");

      if (lines.length >= 3) {
        const timeLine = lines[1];
        const text = lines.slice(2).join(" ");

        const start = timeLine.split(" --> ")[0];

        const sec = convertToSecond(start);

        lyrics.push({
          time: Number(sec.toFixed(1)),
          text,
        });
      }
    });

    console.log("\nCOPY VÀO MONGO:\n");

    console.log(JSON.stringify(lyrics, null, 2));
  }
);

/* ==========================
   HH:MM:SS,ms => second
========================== */
function convertToSecond(str) {
  const [h, m, rest] = str.split(":");
  const [s, ms] = rest.split(",");

  return (
    Number(h) * 3600 +
    Number(m) * 60 +
    Number(s) +
    Number(ms) / 1000
  );
}