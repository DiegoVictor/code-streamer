const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json());

app.listen(3000);
