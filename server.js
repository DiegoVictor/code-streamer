const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json());

app.get("/videos/:file", async (request, response) => {
  const { file } = request.params;
  const { range } = request.headers;

  if (range) {
    return response.status(400).json({
      message: "Range header is required",
    });
  }

  const filename = `./${file}`;
  const stat = await fs.promises.stat(filename);

  if (!stat) {
    return response.status(404).json({
      message: `The file ${file} was not found`,
    });
  }
  const { size: fileSize } = stat;

  const chunkSize = 1024 * 1024 * 0.5;
  const start = Number(range.replace(/\D/gi, ""));
  const end = Math.min(start + chunkSize, fileSize - 1);
  const stream = fs.createReadStream(filename, { start, end });
    })
  }
});

app.listen(3000);
