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
});

app.listen(3000);
