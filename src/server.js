import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { Transform } from 'stream';

import { encrypt } from './utils/crypt.js';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/', (_, response) => {
  response.sendFile('../public');
});

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

  const chunkSize = 1024 * 32;
  const start = Number(range.replace(/\D/gi, ''));
  const end = Math.min(start + chunkSize, fileSize - 1);

  const stream = fs.createReadStream(filename, { start, end });

  return stream
    .on('open', () => {
      response.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'applicatio/octet-stream',
      });

      const transform = new Transform({
        transform(chunk, _, callback) {
          const cipherText = encrypt(chunk, '6n2347856n234785nc623487c56n2347');

          callback(null, cipherText);
        },
      });

      stream.pipe(transform).pipe(response);
    })
    .on('error', () => {
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });
});

app.listen(3000);
