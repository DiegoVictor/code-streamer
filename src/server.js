import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import * as crypto from 'crypto-js';

const app = express();

app.use(cors());
app.use(express.static(resolve(process.cwd(), 'public')));
app.use(express.json());

app.get('/videos/:file', async (request, response) => {
  const { file } = request.params;
  const { range } = request.headers;

  if (!range) {
    return response.status(400).json({
      message: 'Range header is required',
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

  const chunkSize = 1024 * 4;
  const start = Number(range.replace(/\D/gi, ''));
  const end = Math.min(start + chunkSize, fileSize - 1);

  const stream = fs.createReadStream(filename, { start, end });

  return stream
    .on('open', () => {
      response.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': 'video/mp4',
      });

      stream.pipe(response);
    })
    .on('error', () => {
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });
});

app.listen(3000);
